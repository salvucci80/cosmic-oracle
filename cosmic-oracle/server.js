const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

app.post("/api/reading", async (req, res) => {
  try {
    const { sign, type } = req.body;

    const prompt = `
You are a mystical but modern astrologer.
Write a ${type} horoscope reading for ${sign}.
Tone: dark, intimate, direct.
Keep it under 120 words.
Avoid generic fluff.
`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ text: response.content[0].text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
