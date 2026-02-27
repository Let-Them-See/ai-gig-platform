const axios = require("axios");
const Gig = require("../models/Gig");
const User = require("../models/User");

// simple cosine similarity helper (for use when API fails or not available)
function cosineSimilarity(vecA = [], vecB = []) {
  if (!vecA.length || !vecB.length) return 0;
  const dot = vecA.reduce((sum, val, i) => sum + val * (vecB[i] || 0), 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// call Google Gemini embedding API
async function requestEmbedding(text) {
  if (!text || typeof text !== "string" || text.trim() === "") {
    return [];
  }

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        model: "models/embedding-001",
        content: {
          parts: [
            {
              text: text
            }
          ]
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );
    
    if (res.data && res.data.embedding && res.data.embedding.values) {
      return res.data.embedding.values;
    }
    return [];
  } catch (err) {
    console.error("Gemini Embedding API error:", err.message);
    return null; // signal failure
  }
}

// get or compute embedding for gig; writes back to DB if needed
async function getGigEmbedding(gig) {
  if (gig.embedding && gig.embedding.length > 0) {
    return gig.embedding;
  }

  const text = `${gig.title || ""} ${gig.skills ? gig.skills.join(" ") : ""} ${gig.description || ""}`;
  const emb = await requestEmbedding(text);
  if (emb && emb.length) {
    gig.embedding = emb;
    await gig.save().catch(() => {}); // best-effort cache
    return emb;
  }
  return null;
}

// get or compute embedding for user resume
async function getUserEmbedding(user) {
  if (user.resumeEmbedding && user.resumeEmbedding.length > 0) {
    return user.resumeEmbedding;
  }
  const text = user.resumeText || (user.skills ? user.skills.join(" ") : "");
  const emb = await requestEmbedding(text);
  if (emb && emb.length) {
    user.resumeEmbedding = emb;
    await user.save().catch(() => {});
    return emb;
  }
  return null;
}

// compare two texts using embedding; returns similarity percentage [0,100]
async function semanticScoreFromEmbeddings(vecA, vecB) {
  const sim = cosineSimilarity(vecA, vecB);
  if (isNaN(sim)) return 0;
  return sim * 100;
}

// fallback hybrid pf slow environment
async function fallbackHybrid(user, gig) {
  // reuse existing logic from matchController maybe call separate function
  // but for brevity we can compute a simple TF-IDF or skill overlap here
  const userSkills = (user.skills || []).map(s => s.toLowerCase());
  const gigSkills = (gig.skills || []).map(s => s.toLowerCase());
  const matchedSkills = gigSkills.filter(gigSkill =>
    userSkills.some(userSkill =>
      gigSkill.includes(userSkill) || userSkill.includes(gigSkill)
    )
  );
  const skillScore = gigSkills.length > 0 ? (matchedSkills.length / gigSkills.length) * 100 : 0;
  // location & salary scoring omitted here; caller can compute separately
  return { skillScore, matchedSkills };
}

module.exports = {
  cosineSimilarity,
  requestEmbedding,
  getGigEmbedding,
  getUserEmbedding,
  semanticScoreFromEmbeddings,
  fallbackHybrid
};
