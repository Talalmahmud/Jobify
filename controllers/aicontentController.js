import OpenAI from "openai";
import NodeCache from "node-cache";

// Cache setup (5 minutes TTL for responses)
const cache = new NodeCache({ stdTTL: 300 });
const MAX_RETRIES = 3; // Maximum retry attempts

const openai = new OpenAI({ apiKey: process.env.OPEN_AI });

// Exponential backoff function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkQuota = async () => {
  // Here you could periodically check quota with OpenAI usage API if needed
  console.log("Checking quota - customize based on actual implementation.");
};

export const aiTextGenerator = async (req, res) => {
  const { inputText } = req.body;

  // Check if the response is cached
  const cacheKey = `aiResponse-${inputText}`;
  const cachedResponse = cache.get(cacheKey);
  if (cachedResponse) {
    return res.status(200).json({ message: cachedResponse });
  }

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: inputText },
          {
            role: "user",
            content: "Write a haiku about recursion in programming.",
          },
        ],
      });

      const aiMessage = completion.choices[0].message.content;
      cache.set(cacheKey, aiMessage); // Cache the response

      return res.status(200).json({ message: aiMessage });
    } catch (error) {
      attempt++;

      if (error.response?.status === 429) {
        console.warn("Rate limit exceeded. Retrying with backoff...");
        await delay(2000 * attempt); // Exponential backoff

        if (attempt === MAX_RETRIES) {
          return res.status(429).json({
            message:
              "Quota exceeded. Please try again later or check your plan.",
          });
        }
      } else {
        return res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      }
    }
  }
};

// Optional: Schedule quota checks or add an endpoint to view current usage
checkQuota();
