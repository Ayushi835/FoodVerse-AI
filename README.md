# FoodVerse AI — Multimodal Food Intelligence Agent

A full-stack **React + FastAPI + Google Gemini** educational project. It includes five connected modules: image-based food recognition and approximate nutrition, visual freshness guidance, visual restaurant hygiene observations, personalized meal planning, and smart kitchen recipe assistance.

## Architecture

React (Vite) frontend → FastAPI Python backend → Gemini multimodal API → structured JSON insights → React display.

## Prerequisites

- Python 3.10+ and Node.js 18+
- A Google Gemini API key with an image-capable model available and sufficient quota. Model availability, API pricing and free-tier quotas may vary.

## Setup

**1. Backend** (terminal 1):

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and replace `replace_with_your_api_key` with your real key. Do not upload `.env` to GitHub. If the configured model is unavailable, change `GEMINI_MODEL` to an image-capable model available to your API key.

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Check http://127.0.0.1:8000/api/health and API documentation at http://127.0.0.1:8000/docs.

**2. Frontend** (terminal 2):

```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173.

## Features / Epics

1. **Requirements and setup:** architecture, instructions, environment example, project structure.
2. **Food recognition and nutrition:** image upload to Gemini; likely food descriptions and *rough* nutrient estimates.
3. **Freshness and spoilage:** visual quality cues with explicit limits; cannot establish food safety.
4. **Restaurant hygiene and smart kitchen:** image-based hygiene observations and AI recipe suggestions.
5. **Personalized meal planning:** one-day plans based on diet, goal, allergies and available ingredients.
6. **Interface, testing and deployment:** responsive React UI, health endpoint, API docs, basic tests, deployment notes.

## Running tests

```bash
cd backend
pip install pytest httpx
pytest -q
```

## Deploying

You can upload the full source to GitHub. **GitHub Pages alone cannot host the Python backend**. Deploy the frontend on a static hosting platform (with `/api` proxy or `VITE`-configured backend URL), and the backend on a Python-capable host with HTTPS and the API key stored as an environment variable. Configure `allow_origins` in `backend/main.py` for your real frontend origin. For production, use HTTPS, rate limiting, authentication and image data-retention policies. This project is a development reference, not a production-hardened service.

## Honest limitations

- AI requires your own key, internet access and available quota. It is **not** an offline pretrained model.
- Calories/macros are uncertain guesses from photos, not measured nutrition.
- A photograph cannot verify microbial safety, spoilage, regulatory compliance or hygiene certification.
- Meal plans are suggestions and may contain errors or allergens; independently check ingredients and cross-contact.
- This implementation is a runnable baseline, not proof of meeting every unpublished course acceptance criterion. Validate the detailed stories in your portal before final submission.
- No real-time video monitoring, database persistence, user accounts, or independent model validation is included.
