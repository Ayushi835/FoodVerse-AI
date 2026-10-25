##🥗 FoodVerse AI — Multimodal Food Intelligence Agent
An AI-powered food assistant for image understanding, nutrition insights, food-quality guidance, hygiene observations, personalized meal planning, and smart cooking.

Built as a full-stack educational project with React + Vite, Python + FastAPI, and the Google Gemini API.
Project status: Functional development prototype. The meal-planning feature has been manually exercised with Gemini by the project user; other modules, production deployment, and full end-to-end validation should be tested before submission. AI access requires your own API key and quota.

##✨ Features
Module	What it does	Input
🥗 Food recognition & nutrition	Describes likely foods and gives rough calorie/macronutrient estimates	Food photo
🍎 Freshness guidance	Reviews visible quality cues and explains uncertainty	Food photo
🧼 Restaurant hygiene	Summarizes visible kitchen/restaurant hygiene indicators	Kitchen/restaurant photo
📅 Meal planner	Generates a one-day meal plan for dietary preferences, goals, ingredients, servings and exclusions	Form fields
🍳 Smart kitchen	Suggests recipes and cooking steps based on ingredients, equipment, time and exclusions	Form fields


Important: Image-based analysis does not establish food safety, hygiene compliance, or exact nutrition. Meal recommendations are informational and do not guarantee allergen safety.
##🛠️ Tech stack
- Frontend: React 18, JavaScript, CSS, Vite
- Backend: Python, FastAPI, Pydantic, Uvicorn
- AI: Google Gemini via the google-genai Python SDK
- Image handling: Pillow, multipart uploads
- Configuration: python-dotenv
