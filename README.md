# 🍽️ FoodVerse AI – Multimodal Food Intelligence Agent

### AI-Powered Food Recognition, Nutrition Analysis & Smart Meal Planning

FoodVerse AI is a full-stack, multimodal artificial intelligence platform designed to provide intelligent food-related insights using computer vision, natural language processing, and Google's Gemini AI.

The platform integrates multiple AI-powered modules into a single application to assist users with food recognition, nutritional estimation, food freshness assessment, restaurant hygiene analysis, smart kitchen assistance, and personalized meal planning.

---

## 🚀 Project Overview

FoodVerse AI aims to make food-related decision-making smarter, more accessible, and data-driven.

Traditional food applications often focus on individual tasks such as calorie tracking or recipe recommendations. FoodVerse AI brings several food intelligence capabilities together through a unified interface.

The application combines a React frontend, a Python FastAPI backend, and the Google Gemini multimodal AI API to process user inputs and generate contextual recommendations.

---

## ✨ Key Features

### 🥗 1. Food Recognition & Nutrition Analysis

- Upload food images for AI-based analysis.
- Identify visible food items using multimodal AI.
- Generate approximate calorie estimates.
- Estimate protein, carbohydrates, and fats.
- Provide general nutritional insights.

### 🍎 2. Food Freshness & Spoilage Guidance

- Analyze uploaded food images.
- Identify visible signs of possible spoilage.
- Generate food storage recommendations.
- Provide general freshness and food-handling guidance.

**Note:** Image analysis cannot guarantee that food is safe to consume.

### 🏪 3. Restaurant Hygiene Analysis

- Analyze restaurant or kitchen images.
- Identify visible cleanliness concerns.
- Generate hygiene improvement suggestions.
- Provide general food safety recommendations.

This module does not replace professional hygiene inspections.

### 👨‍🍳 4. Smart Kitchen Assistant

- Generate cooking instructions.
- Suggest recipes using available ingredients.
- Recommend ingredient substitutions.
- Provide cooking tips and meal preparation guidance.

### 📅 5. Personalized AI Meal Planner

- Generate personalized meal suggestions.
- Select dietary preferences and goals.
- Specify the number of servings.
- Enter available ingredients.
- Exclude allergens or unwanted ingredients.
- Receive AI-generated meal plans with recipes and approximate nutritional information.

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend

- Python
- FastAPI
- Uvicorn
- REST APIs

### Artificial Intelligence

- Google Gemini API
- Multimodal image and text processing
- Natural Language Processing
- AI-assisted food and nutrition analysis

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Google AI Studio

## 📂 Project Structure

```text
FoodVerse-AI/
|
|-- backend/
|   |-- main.py
|   |-- requirements.txt
|   |-- test_main.py
|   |-- .env.example
|
|-- frontend/
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   |-- src.jsx
|   |-- style.css
|
|-- .gitignore
|-- README.md
```


## 🔗 API Integration

FoodVerse AI integrates the Google Gemini API to provide AI-powered functionality.

The backend receives requests from the React application and sends relevant text or image inputs to Gemini.

The AI-generated response is processed by the backend and displayed in the frontend.

### API Security

- API credentials are stored in environment variables.
- Sensitive credentials are excluded from GitHub.
- Gemini API requests are handled through the backend.
- The frontend does not require direct access to the private API key.

## 🔮 Future Enhancements

- Real-time food recognition using camera input
- Improved portion-size estimation
- Integration with verified nutrition databases
- Food expiry tracking and notifications
- Multilingual AI assistance
- User authentication and personalized dashboards
- Meal history and nutrition tracking
- Improved food freshness classification
- Restaurant hygiene reporting dashboard
- Cloud deployment and database integration

---
