import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Replicate from "replicate";
import cors from "cors";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Definisi sesi
const sessions = [
  "Main Theme",
  "Background & Time",
  "Main Character",
  "Supporting Character",
  "Adventure Goal"
];

// Generate kategori per sesi
app.post("/generate-category", async (req, res) => {
  const { previousChoices } = req.body;
  const currentSession = sessions[previousChoices.length];

  if (!currentSession) return res.status(400).json({ error: "Invalid session" });

  try {
    const prompt = `
You are generating story categories for a family-friendly interactive story game.
Focus only on the current session: ${currentSession}.
Previous choices: ${previousChoices.join(", ") || "None"}.
Generate 32 unique and relevant options for this session.
Output one category per line, without numbers or symbols.
`;

    const output = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct",
      { input: { prompt } }
    );

    // Parsing: split per baris, trim, hapus nomor/simbol, filter kosong
    let categories = output.join("").split(/\r?\n/).map(c => c.trim().replace(/^\d+[\.\)\- ]*/, "")).filter(Boolean);

    categories = categories.slice(0, 32);

    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate categories" });
  }
});

// Generate story final
app.post("/generate-story", async (req, res) => {
  const { choices } = req.body;
  if (!choices || choices.length !== 5) return res.status(400).json({ error: "Incomplete choices" });

  try {
    const prompt = `
Create a detailed interactive story in English based on these choices:
Main Theme: ${choices[0]}
Background & Time: ${choices[1]}
Main Character: ${choices[2]}
Supporting Character: ${choices[3]}
Adventure Goal: ${choices[4]}

Output format:
First line: story title
Rest: story content
No numbering or extra symbols.
`;

    const storyOutput = await replicate.run(
      "ibm-granite/granite-3.3-8b-instruct",
      { input: { prompt } }
    );

    const storyText = storyOutput.join("").trim();
    const [titleLine, ...contentLines] = storyText.split("\n").filter(Boolean);
    const story = {
      title: titleLine || "Magic Story",
      content: contentLines.join(" ")
    };

    res.json({ story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
