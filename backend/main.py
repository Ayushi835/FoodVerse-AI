"""FoodVerse AI backend. Image understanding requires a user-supplied Gemini API key."""
import io
import json
import os
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).with_name('.env'))
app = FastAPI(title='FoodVerse AI', version='1.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'], allow_credentials=False, allow_methods=['*'], allow_headers=['*'])
MAX_BYTES = 8 * 1024 * 1024

class MealRequest(BaseModel):
    diet: Literal['balanced','vegetarian','vegan','high-protein'] = 'balanced'
    goal: Literal['balanced','budget','higher-protein'] = 'balanced'
    allergies: str = Field(default='', max_length=300)
    servings: int = Field(default=1, ge=1, le=8)
    ingredients: str = Field(default='', max_length=1000)

class KitchenRequest(BaseModel):
    ingredients: str = Field(min_length=2, max_length=1000)
    equipment: str = Field(default='stove', max_length=200)
    time_minutes: int = Field(default=30, ge=5, le=180)
    allergies: str = Field(default='', max_length=300)

async def ai_json(prompt: str, image: Image.Image | None = None):
    key = os.getenv('GEMINI_API_KEY', '').strip()
    if not key or key == 'replace_with_your_api_key':
        raise HTTPException(503, 'AI is not configured. Add GEMINI_API_KEY to backend/.env.')
    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=key)
        contents = [prompt] if image is None else [image, prompt]
        response = client.models.generate_content(
            model=os.getenv('GEMINI_MODEL', 'gemini-2.5-flash'),
            contents=contents,
            config=types.GenerateContentConfig(response_mime_type='application/json', temperature=0.2),
        )
        return json.loads(response.text)
    except HTTPException:
        raise
    except Exception as exc:
        # Don't leak API keys or sensitive provider diagnostics to the browser.
        raise HTTPException(502, f'AI request failed ({type(exc).__name__}). Check model access, quota and server logs.') from exc

async def read_image(upload: UploadFile):
    if upload.content_type not in {'image/jpeg','image/png','image/webp'}:
        raise HTTPException(415, 'Upload JPG, PNG or WEBP images only.')
    raw = await upload.read(MAX_BYTES + 1)
    if len(raw) > MAX_BYTES:
        raise HTTPException(413, 'Maximum image size is 8 MB.')
    try:
        im = Image.open(io.BytesIO(raw))
        im.verify()
        im = Image.open(io.BytesIO(raw)).convert('RGB')
        if im.width * im.height > 20_000_000:
            raise HTTPException(413, 'Image dimensions are too large.')
        im.thumbnail((1400, 1400))
        return im
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(400, 'Invalid image file.') from exc

@app.get('/api/health')
def health():
    return {'status':'ok','ai_configured':bool(os.getenv('GEMINI_API_KEY') and os.getenv('GEMINI_API_KEY') != 'replace_with_your_api_key')}

@app.post('/api/analyze')
async def analyze(image: UploadFile = File(...), mode: Literal['food','freshness','hygiene'] = Form('food')):
    im = await read_image(image)
    shared = ('Return ONLY a JSON object with keys title (string), summary (string), findings '
              '(array of 3-6 short strings), recommendations (array of 2-5 short strings), '
              'confidence ("low", "medium" or "high"), limitations (string). '
              'Never invent certainty. Clearly distinguish what is visible from what cannot be verified.')
    prompts = {
        'food': 'Describe likely visible foods and ingredients. Add a nutrition object with estimated_kcal, protein_g, carbs_g, fat_g as numbers or null. Estimates are rough and portion-dependent. Do not claim exact nutrition.',
        'freshness': 'Describe visible quality indicators, if any. Never declare food safe or unsafe from a photo. Explain that pathogens, storage history, internal temperature and spoilage cannot be reliably determined visually. Do not provide a freshness certification.',
        'hygiene': 'Assess only observable kitchen or restaurant hygiene cues. Do not score compliance or certify a restaurant based on a photo. Note that actual hygiene requires on-site inspection, handling history and temperature checks.',
    }
    result = await ai_json(shared + '\n' + prompts[mode], im)
    return {'mode':mode, 'result':result, 'disclaimer':'AI-generated observations are uncertain. Food safety requires appropriate handling and verification; nutrition values are estimates.'}

@app.post('/api/meal-plan')
async def meal_plan(req: MealRequest):
    prompt = (f'Create a one-day meal plan for diet={req.diet}, goal={req.goal}, servings={req.servings}, '
              f'allergies or foods to avoid={req.allergies!r}, ingredients on hand={req.ingredients!r}. '
              'Avoid the listed allergens. Return JSON object with title, summary, meals (array of objects with name, '
              'ingredients (array), instructions (array), estimated_kcal (number or null))), shopping_list (array), '
              'limitations (string). Calories are rough estimates. No medical claims. No guarantee of allergen safety.')
    return await ai_json(prompt)

@app.post('/api/kitchen')
async def kitchen(req: KitchenRequest):
    prompt = (f'Create a realistic home cooking recipe using available ingredients={req.ingredients!r}, '
              f'equipment={req.equipment!r}, time budget={req.time_minutes} minutes, allergies={req.allergies!r}. '
              'Return JSON object with title, summary, ingredients (array), steps (array), '
              'safety_tips (array), limitations (string). Avoid allergens, mention cross-contact risk and safe cooking.')
    return await ai_json(prompt)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://foodverse-ai-501o.onrender.com"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)
