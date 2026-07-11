#!/usr/bin/env bash
set -e

PROJECT="fitness-buddy"

mkdir -p "$PROJECT/backend/src/config"
mkdir -p "$PROJECT/backend/src/controllers"
mkdir -p "$PROJECT/backend/src/routes"
mkdir -p "$PROJECT/backend/src/services"

cat > "$PROJECT/backend/src/config/watsonx.js" <<'TXT'
const { WatsonXAI } = require('@ibm-cloud/watsonx-ai');

const watsonxAIService = WatsonXAI.newInstance({
  version: '2024-05-31',
  serviceUrl: process.env.WATSONX_URL
});

module.exports = watsonxAIService;
TXT

cat > "$PROJECT/backend/src/services/promptService.js" <<'TXT'
const watsonxAIService = require('../config/watsonx');

async function generateFitnessPlan(userData) {
  const {
    goal = 'Weight loss',
    level = 'Beginner',
    time = '20 minutes',
    diet = 'Vegetarian',
    place = 'Home',
    country = 'India',
    budget = 'Low'
  } = userData;

  const prompt = `
You are Fitness Buddy, a friendly AI fitness and wellness coach.

Always respond in exactly 4 sections:
1. Workout
2. Meal Idea
3. Motivation
4. Habit Goal

Rules:
- Keep the full response short and practical.
- Make the Workout section a balanced plan with warm-up, main activity, and cool-down.
- Suggest affordable ${country} ${diet.toLowerCase()} meal ideas.
- Keep Motivation to one short sentence.
- Keep Habit Goal to one measurable action only.
- Do not provide medical diagnosis or treatment.
- If pain, injury, or illness is mentioned, advise consulting a qualified professional.

User details:
Goal: ${goal}
Level: ${level}
Time: ${time}
Diet: ${diet}
Place: ${place}
Country: ${country}
Budget: ${budget}
`;

  const response = await watsonxAIService.generateText({
    input: prompt,
    modelId: process.env.WATSONX_MODEL_ID,
    projectId: process.env.WATSONX_PROJECT_ID,
    parameters: {
      max_new_tokens: 220,
      min_new_tokens: 50,
      temperature: 0.7
    }
  });

  return response?.result?.results?.[0]?.generated_text || 'No response generated.';
}

module.exports = { generateFitnessPlan };
TXT

cat > "$PROJECT/backend/src/controllers/fitnessController.js" <<'TXT'
const { generateFitnessPlan } = require('../services/promptService');

async function generatePlan(req, res) {
  try {
    const result = await generateFitnessPlan(req.body);
    res.json({ success: true, result });
  } catch (error) {
    console.error('watsonx error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate plan'
    });
  }
}

module.exports = { generatePlan };
TXT

cat > "$PROJECT/backend/src/routes/fitnessRoutes.js" <<'TXT'
const express = require('express');
const { generatePlan } = require('../controllers/fitnessController');

const router = express.Router();

router.post('/generate', generatePlan);

module.exports = router;
TXT

cat > "$PROJECT/backend/src/server.js" <<'TXT'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fitnessRoutes = require('./routes/fitnessRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Fitness Buddy backend is running' });
});

app.use('/api/fitness', fitnessRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(\`Server running on port \${process.env.PORT || 5000}\`);
});
TXT

echo "watsonx backend files created successfully."
