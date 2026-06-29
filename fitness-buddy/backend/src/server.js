const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Fitness Buddy deployed prompt backend running" });
});

async function getIamToken() {
  const body = new URLSearchParams();
  body.append("grant_type", "urn:ibm:params:oauth:grant-type:apikey");
  body.append("apikey", process.env.IBM_API_KEY);

  const response = await fetch(process.env.WATSONX_TOKEN_URL, {
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

  return data.access_token;
}

app.post("/api/fitness/generate", async (req, res) => {
  try {
    const {
      message = "Create a beginner 20-minute home workout, one healthy meal idea, one motivational line, and one habit goal."
    } = req.body;

    const token = await getIamToken();

    const response = await fetch(process.env.WATSONX_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: message
          }
        ]
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Watsonx request failed: ${text}`);
    }

    const data = await response.json();

    res.json({
      success: true,
      reply: data?.choices?.[0]?.message?.content || "No response generated."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});