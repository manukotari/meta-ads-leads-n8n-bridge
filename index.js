import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// ✅ Replace with your values
const VERIFY_TOKEN = "meta-n8n-verify";
const N8N_WEBHOOK_URL = "https://paramathma.app.n8n.cloud/webhook-test/meta-ads-leads";

// 🔹 Meta verification
app.get("/meta-verify", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Meta webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verification failed.");
    res.sendStatus(403);
  }
});

// 🔹 Lead delivery
app.post("/meta-verify", async (req, res) => {
  try {
    await axios.post(N8N_WEBHOOK_URL, req.body);
    console.log("✅ Lead data forwarded to n8n!");
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error forwarding to n8n:", error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
