#!/usr/bin/env bash
set -e

PROJECT_NAME="fitness-buddy"
mkdir -p "$PROJECT_NAME"/frontend/public
mkdir -p "$PROJECT_NAME"/frontend/src/assets
mkdir -p "$PROJECT_NAME"/frontend/src/components
mkdir -p "$PROJECT_NAME"/frontend/src/pages
mkdir -p "$PROJECT_NAME"/frontend/src/services
mkdir -p "$PROJECT_NAME"/backend/src/config
mkdir -p "$PROJECT_NAME"/backend/src/controllers
mkdir -p "$PROJECT_NAME"/backend/src/routes
mkdir -p "$PROJECT_NAME"/backend/src/services
mkdir -p "$PROJECT_NAME"/backend/src/utils

cat > "$PROJECT_NAME/package.json" <<'JSON'
{
  "name": "fitness-buddy",
  "private": true,
  "scripts": {
    "client": "npm run dev --prefix frontend",
    "server": "npm start --prefix backend",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  },
  "devDependencies": {
    "concurrently": "^9.0.1"
  }
}
JSON

cat > "$PROJECT_NAME/.gitignore" <<'TXT'
node_modules
.env
dist
TXT

cat > "$PROJECT_NAME/README.md" <<'TXT'
# Fitness Buddy
Full-stack AI fitness assistant using React, Node.js, Express, and IBM watsonx.ai.
TXT

cat > "$PROJECT_NAME/frontend/package.json" <<'JSON'
{
  "name": "frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.1"
  }
}
JSON

cat > "$PROJECT_NAME/frontend/.env" <<'TXT'
VITE_API_URL=http://localhost:5000
TXT

cat > "$PROJECT_NAME/frontend/vite.config.js" <<'TXT'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
TXT

cat > "$PROJECT_NAME/frontend/index.html" <<'TXT'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fitness Buddy</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
TXT

cat > "$PROJECT_NAME/frontend/src/main.jsx" <<'TXT'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
TXT

cat > "$PROJECT_NAME/frontend/src/App.jsx" <<'TXT'
export default function App() {
  return <h1>Fitness Buddy</h1>
}
TXT

cat > "$PROJECT_NAME/frontend/src/index.css" <<'TXT'
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 2rem;
}
TXT

cat > "$PROJECT_NAME/backend/package.json" <<'JSON'
{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node src/server.js"
  },
  "dependencies": {
    "@ibm-cloud/watsonx-ai": "^1.4.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
JSON

cat > "$PROJECT_NAME/backend/.env" <<'TXT'
IAM_APIKEY=your_ibm_cloud_api_key
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_PROJECT_ID=your_project_id
WATSONX_MODEL_ID=meta-llama/llama-3-3-70b-instruct
PORT=5000
TXT

cat > "$PROJECT_NAME/backend/src/server.js" <<'TXT'
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Fitness Buddy backend is running' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
TXT

echo "Project created successfully: $PROJECT_NAME"
