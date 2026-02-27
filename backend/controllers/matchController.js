const User = require("../models/User");
const Gig = require("../models/Gig");
const MatchHistory = require("../models/MatchHistory");
const matchService = require("../services/matchService");

exports.matchFreelancer = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // make sure we have skills/resume data
    if (!(user.resumeText || (user.skills && user.skills.length))) {
      return res.status(400).json({
        message: "No resume or skills found. Please upload resume or add skills."
      });
    }

    let gigs = await Gig.find();

    // dedupe gigs by jobId to avoid duplicates
    const seenJobs = new Set();
    gigs = gigs.filter(g => {
      if (seenJobs.has(g.jobId)) return false;
      seenJobs.add(g.jobId);
      return true;
    });

    // compute matches for every gig
    const results = [];
    for (const gig of gigs) {
      const scoreObj = await matchService.computeMatch(user, gig);
      if (scoreObj.matchPercentage > 0) {
        results.push({ gigId: gig._id, title: gig.title, ...scoreObj });
      }
    }

    // deduplicate results by gigId (ensure same gig isn't returned twice)
    const seenGigIds = new Set();
    const uniqueResults = results.filter(r => {
      if (seenGigIds.has(String(r.gigId))) return false;
      seenGigIds.add(String(r.gigId));
      return true;
    });

    // sort by match percentage and take top 10 for better diversity
    const sorted = uniqueResults.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const topMatches = sorted.slice(0, 10);

    // log history for each top match (avoid duplicates from same user/gig pair)
    for (const match of topMatches) {
      // delete old entries for this user-gig pair to avoid duplicates
      await MatchHistory.deleteMany({ user: user._id, gig: match.gigId });
      
      await MatchHistory.create({
        user: user._id,
        gig: match.gigId,
        matchPercentage: match.matchPercentage,
        skillMatchScore: match.skillMatchScore,
        semanticContribution: match.semanticContribution,
        locationScore: match.locationScore,
        salaryScore: match.salaryScore,
        matchedSkills: match.matchedSkills
      });
    }

    res.json(topMatches);
  } catch (error) {
    console.error("MATCH ERROR:", error);
    res.status(500).json({ message: "Matching failed", error: error.message });
  }
};


// ================= GET MATCH HISTORY =================
exports.getMatchHistory = async (req, res) => {
  try {
    const history = await MatchHistory.find({ user: req.user.id })
      .populate("gig")
      .sort({ createdAt: -1 });

    res.json(history);

  } catch (error) {
    console.error("GET MATCH HISTORY ERROR:", error);
    res.status(500).json({ message: "Failed to fetch match history" });
  }
};

// ================= GET APPLICANTS FOR A GIG (CLIENT ONLY) =================
exports.getApplicantsForGig = async (req, res) => {
  try {
    const gigId = req.params.gigId;

    // ensure the requester owns the gig
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (String(gig.createdBy) !== String(req.user.id)) return res.status(403).json({ message: 'Access denied' });

    const applicants = await MatchHistory.find({ gig: gigId }).populate('user', 'name email skills resumeText');

    res.json(applicants);
  } catch (error) {
    console.error('GET APPLICANTS ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch applicants' });
  }
};

// ================= UPDATE MATCH STATUS (ACCEPT / REJECT) =================
exports.updateMatchStatus = async (req, res) => {
  try {
    const matchId = req.params.matchId;
    const { status } = req.body;

    if (!['accepted','rejected','pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const match = await MatchHistory.findById(matchId).populate('gig');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // only gig owner can update
    if (String(match.gig.createdBy) !== String(req.user.id)) return res.status(403).json({ message: 'Access denied' });

    match.status = status;
    await match.save();

    res.json({ message: 'Status updated', match });
  } catch (error) {
    console.error('UPDATE MATCH STATUS ERROR:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
};