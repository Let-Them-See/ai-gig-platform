require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");
const Gig = require("./models/Gig");

const MONGO_URI = process.env.MONGO_URI;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const JSEARCH_QUERY = process.env.JSEARCH_QUERY || "software engineer";

if (!RAPIDAPI_KEY) {
  console.error("RAPIDAPI_KEY is not set in .env. Please add your RapidAPI key.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("Mongo connection error", err);
    process.exit(1);
  });

async function fetchJobsFromJSearch(query) {
  const options = {
    method: "GET",
    url: "https://jsearch.p.rapidapi.com/search",
    params: {
      query,
      page: "1",
      num_pages: "1",
    },
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    },
  };

  const response = await axios.request(options);
  // RapidAPI JSearch usually returns { data: [ ...jobs ] }
  return response.data?.data || [];
}

(async () => {
  try {
    console.log(`Fetching jobs from JSearch for query: "${JSEARCH_QUERY}"`);
    const jobs = await fetchJobsFromJSearch(JSEARCH_QUERY);
    console.log(`Fetched ${jobs.length} jobs from JSearch.`);

    if (!jobs.length) {
      console.warn("No jobs returned from JSearch. Nothing to seed.");
      process.exit(0);
    }

    const docs = jobs.map((job) => {
      const skillsRaw =
        job.job_required_skills ||
        job.job_required_skills_keywords ||
        job.job_skills ||
        [];

      const skills = Array.isArray(skillsRaw)
        ? skillsRaw
        : typeof skillsRaw === "string"
        ? skillsRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const minSalary = Number(job.job_min_salary) || 0;
      const maxSalary = Number(job.job_max_salary) || 0;
      const amount = maxSalary || minSalary || 0;

      return {
        jobId: job.job_id || job.job_id_raw || job.job_apply_link || String(Date.now()) + Math.random().toString(36).slice(2),
        title: job.job_title || "Untitled role",
        type: job.job_employment_type || job.job_type || "Unknown",
        skills,
        location:
          job.job_city && job.job_country
            ? `${job.job_city}, ${job.job_country}`
            : job.job_city || job.job_country || "Remote",
        experienceLevel:
          (job.job_required_experience && job.job_required_experience.experience_level) ||
          job.job_experience_level ||
          "Not specified",
        pay: {
          type: job.job_salary_period || "year",
          amount,
        },
        category: job.job_industry || job.job_title || "General",
        underservedFocus: "",
      };
    });

    // optional: clear old gigs seeded from previous runs
    await Gig.deleteMany({});
    console.log("Cleared existing gigs.");

    await Gig.insertMany(docs);
    console.log(`Seeded ${docs.length} gigs from JSearch 🔥`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding jobs from JSearch:", error.response?.data || error.message || error);
    process.exit(1);
  }
})();
