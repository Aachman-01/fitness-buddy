const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
// IBM Cloud IAM token endpoint (exchanges an API key for a short-lived bearer
// token). Rarely needs changing.
const IAM_TOKEN_URL =
  process.env.WATSONX_TOKEN_URL || "https://iam.cloud.ibm.com/identity/token";

// watsonx.ai DEPLOYMENT chat endpoint (a deployed prompt template).
// The model, parameters, and system prompt live inside the deployment, so the
// request body only needs the conversation `messages`.
//
// Set the full URL via WATSONX_CHAT_URL, or let it be built from the region
// host + deployment id + API version below.
const DEPLOYMENT_ID =
  process.env.WATSONX_DEPLOYMENT_ID || "019f0f4e-1293-7088-a645-3f464b172c1e";
const WATSONX_REGION_HOST =
  process.env.WATSONX_REGION_HOST || "au-syd.ml.cloud.ibm.com";
const WATSONX_VERSION = process.env.WATSONX_VERSION || "2021-05-01";

const CHAT_URL =
  process.env.WATSONX_CHAT_URL ||
  "https://" +
    WATSONX_REGION_HOST +
    "/ml/v1/deployments/" +
    DEPLOYMENT_ID +
    "/text/chat?version=" +
    WATSONX_VERSION;

// ---------------------------------------------------------------------------
// IAM token handling (with caching)
// ---------------------------------------------------------------------------
let cachedToken = null;
let tokenExpiresAt = 0;

async function getIamToken() {
  const now = Date.now();

  // Reuse the cached token until 60s before it expires.
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  if (!process.env.IBM_API_KEY) {
    throw new Error("IBM_API_KEY is not set. Add it to backend/.env");
  }

  const body = new URLSearchParams();
  body.append("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
  body.append("apikey", process.env.IBM_API_KEY);

  const response = await fetch(IAM_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error(data.errorMessage || "Failed to get IAM token");
  }

  cachedToken = data.access_token;
  // IAM tokens are valid for ~1 hour; use expires_in when provided.
  tokenExpiresAt = now + (data.expires_in ? data.expires_in * 1000 : 3600000);

  return cachedToken;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Fitness Buddy watsonx deployment backend running" });
});

app.post("/api/fitness/generate", async (req, res) => {
  try {
    const {
      message = "Create a beginner 20-minute home workout, one healthy meal idea, one motivational line, and one habit goal.",
    } = req.body;

    const token = await getIamToken();

    // Deployed prompt template: only the messages are sent. The deployment
    // applies its own model, parameters, and system instructions.
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Watsonx request failed (" + response.status + "): " + text);
    }

    const data = await response.json();

    res.json({
      success: true,
      reply: data?.choices?.[0]?.message?.content || "No response generated.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
