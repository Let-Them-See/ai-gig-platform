const Gig = require("../models/Gig");
const User = require("../models/User");

// ================= CREATE GIG =================
exports.createGig = async (req, res) => {
  try {
    const {
      title,
      type,
      skills,
      location,
      experienceLevel,
      pay,
      category,
      underservedFocus
    } = req.body;

    const gig = await Gig.create({
      jobId: Date.now().toString(),
      title,
      type,
      skills,
      location,
      experienceLevel,
      pay,
      category,
      underservedFocus,
      createdBy: req.user.id
    });

    // asynchronously generate and cache embedding
    try {
      const embeddingService = require("../services/embeddingService");
      embeddingService.getGigEmbedding(gig).catch(() => {});
    } catch (e) {}

    res.status(201).json({
      message: "Gig created successfully",
      gig
    });

  } catch (error) {
    console.error("CREATE GIG ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL GIGS =================
exports.getGigs = async (req, res) => {
  try {
    let gigs = await Gig.find().sort({ createdAt: -1 }).populate("createdBy", "name email");

    // filter out duplicates (by jobId) in case the database contains multiple entries
    const seen = new Set();
    gigs = gigs.filter(g => {
      if (seen.has(g.jobId)) return false;
      seen.add(g.jobId);
      return true;
    });

    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SINGLE GIG BY ID =================
exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("createdBy", "name email");
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (error) {
    console.error("GET GIG BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const MatchHistory = require("../models/MatchHistory");
const Application = require("../models/Application");

// ================= SKILL GAP =================
exports.getSkillGap = async (req, res) => {
  try {
    const gigId = req.params.id;
    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // user must be freelancer (we may also allow clients to preview)
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const scoreObj = await require("../services/matchService").computeMatch(user, gig);

    res.json({
      matchPercentage: scoreObj.matchPercentage,
      matchedSkills: scoreObj.matchedSkills,
      missingSkills: scoreObj.missingSkills,
      improvementScore: scoreObj.improvementScore
    });
  } catch (error) {
    console.error("SKILL GAP ERROR:", error);
    res.status(500).json({ message: "Failed to calculate skill gap" });
  }
};

// ================= RECRUITER DASHBOARD =================
exports.getRecruiterDashboard = async (req, res) => {
  try {
    // aggregate by gig and compute the analytics requested
    const gigs = await Gig.find({ createdBy: req.user.id });

    const dashboard = [];

    for (let gig of gigs) {
      // use applications for most applicant-based analytics
      const apps = await Application.find({ gig: gig._id }).populate("freelancer", "skills expectedPay location");
      const totalMatches = apps.length;
      // average match score is still drawn from MatchHistory
      const hist = await MatchHistory.find({ gig: gig._id }).populate('user', 'name');
      const avgScore =
        hist.length > 0
          ? (
              hist.reduce((sum, m) => sum + m.matchPercentage, 0) /
              hist.length
            ).toFixed(2)
          : 0;

      // skill distribution across applicants based on actual applications
      const skillCounts = {};
      apps.forEach(a => {
        (a.freelancer?.skills || []).forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      });
      const skillDistribution = Object.entries(skillCounts).map(([skill, count]) => ({ skill, count }));

      // salary comparison
      const salaryData = apps.map(a => ({ expected: a.freelancer?.expectedPay || 0, gigPay: gig.pay?.amount || 0 }));
      const avgExpected = salaryData.length > 0 ? salaryData.reduce((a,b)=>a+b.expected,0)/salaryData.length : 0;
      const avgGigPay = gig.pay?.amount || 0;

      // location distribution
      const locCounts = {};
      apps.forEach(a => {
        const loc = a.freelancer?.location || "unknown";
        locCounts[loc] = (locCounts[loc] || 0) + 1;
      });
      const locationDistribution = Object.entries(locCounts).map(([location, count])=>({ location, count }));

      // top demanded skills (sorted by freq)
      const topDemandedSkills = skillDistribution
        .sort((a,b)=>b.count - a.count)
        .slice(0,5)
        .map(s=>s.skill);

      // conversion rate: applications -> accepted
      const accepted = apps.filter(a=>a.status==='accepted').length;
      const conversionRate = totalMatches > 0 ? (accepted/totalMatches)*100 : 0;

      // compute top freelancers from match history (if available)
      const topFreelancers = hist
        .sort((a,b)=>b.matchPercentage - a.matchPercentage)
        .slice(0,3)
        .map(m=>({
          freelancerName: m.user?.name || '',
          score: m.matchPercentage
        }));

      dashboard.push({
        gigId: gig._id,
        title: gig.title,
        totalMatches,
        averageMatchScore: Number(avgScore),
        topFreelancers,
        skillDistribution,
        avgExpectedPay: avgExpected,
        averageGigPay: avgGigPay,
        locationDistribution,
        topDemandedSkills,
        conversionRate: Number(conversionRate.toFixed(2))
      });
    }

    res.json(dashboard);

  } catch (error) {
    console.error("RECRUITER DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};