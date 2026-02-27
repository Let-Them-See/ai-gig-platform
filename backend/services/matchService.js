const embeddingService = require("./embeddingService");
const UserInteraction = require("../models/UserInteraction");

/**
 * Compute match information between a freelancer (user) and a gig.
 * Returns an object containing all scoring details and missing skills.
 * This function is used by multiple controllers (matching, applying, skill-gap).
 */
async function computeMatch(user, gig) {
  // score ingredients
  let semanticScore = 0;
  let usingEmbeddings = false;

  try {
    const [userEmb, gigEmb] = await Promise.all([
      embeddingService.getUserEmbedding(user),
      embeddingService.getGigEmbedding(gig)
    ]);

    if (userEmb && gigEmb) {
      semanticScore = await embeddingService.semanticScoreFromEmbeddings(
        userEmb,
        gigEmb
      );
      usingEmbeddings = true;
    } else {
      // API failed or embeddings not available
      semanticScore = 0;
    }
  } catch (err) {
    console.error("Error while getting embeddings:", err.message);
  }

  // fallback if semanticScore is zero and we suspect failure
  if (!usingEmbeddings) {
    // compute simple TF-IDF based or at least skill-overlap based fallback
    const fallback = await embeddingService.fallbackHybrid(user, gig);
    // we will treat fallback.skillScore as "semantic" contribution
    semanticScore = fallback.skillScore;
  }

  // skill matching
  const userSkills = (user.skills || []).map(s => s.toLowerCase());
  const gigSkills = (gig.skills || []).map(s => s.toLowerCase());
  const matchedSkills = gigSkills.filter(gigSkill =>
    userSkills.some(userSkill =>
      gigSkill.includes(userSkill) || userSkill.includes(gigSkill)
    )
  );

  const skillScore = gigSkills.length > 0 ? (matchedSkills.length / gigSkills.length) * 100 : 0;

  // missing skills
  const missingSkills = gigSkills.filter(s => !matchedSkills.includes(s));

  // location score
  const userLocation = (user.location || "").toLowerCase();
  const gigLocation = (gig.location || "").toLowerCase();

  let locationScore = 0;
  if (gigLocation.includes("remote")) {
    locationScore = 80;
  } else if (userLocation && gigLocation.includes(userLocation)) {
    locationScore = 100;
  }

  // salary score
  const userExpectedPay = user.expectedPay || 0;
  const gigPay = gig.pay?.amount || 0;
  let salaryScore = 0;
  if (gigPay >= userExpectedPay && userExpectedPay > 0) {
    salaryScore = 100;
  } else if (gigPay >= userExpectedPay * 0.8) {
    salaryScore = 70;
  } else if (gigPay > 0) {
    salaryScore = 30;
  } else {
    salaryScore = 0;
  }

  // normalize semantic score relative to 100
  const normalizedSemantic = Math.min(Math.max(semanticScore, 0), 100);

  let finalScore =
    0.4 * normalizedSemantic +
    0.25 * skillScore +
    0.2 * locationScore +
    0.15 * salaryScore;

  // personalization: boost if user previously applied to same category
  try {
    const pastApplies = await UserInteraction.find({ user: user._id, action: "apply" }).populate("gig", "category skills");
    const sameCatCount = pastApplies.filter(pi => pi.gig && pi.gig.category === gig.category).length;
    if (sameCatCount > 0) {
      // simple 5% boost per past application of same category (cap 15%)
      finalScore += Math.min(sameCatCount * 5, 15);
    }

    // boost if user often views gigs that share skills
    const pastViews = await UserInteraction.find({ user: user._id, action: "view" }).populate("gig", "skills");
    const viewedSkills = new Set();
    pastViews.forEach(v => {
      (v.gig?.skills || []).forEach(s => viewedSkills.add(s));
    });
    const overlap = gigSkills.filter(s => viewedSkills.has(s));
    if (overlap.length > 0) {
      finalScore += Math.min(overlap.length * 3, 15);
    }
  } catch (e) {
    // ignore personalization errors
  }

  finalScore = Math.min(finalScore, 100);

  const improvementScore = gigSkills.length > 0 ? (missingSkills.length / gigSkills.length) * 100 : 0;

  return {
    matchPercentage: Number(finalScore.toFixed(2)),
    skillMatchScore: Number(skillScore.toFixed(2)),
    semanticContribution: Number(normalizedSemantic.toFixed(2)),
    locationScore: Number(locationScore.toFixed(2)),
    salaryScore: Number(salaryScore.toFixed(2)),
    matchedSkills,
    missingSkills,
    improvementScore: Number(improvementScore.toFixed(2)),
    usingEmbeddings
  };
}

module.exports = {
  computeMatch
};
