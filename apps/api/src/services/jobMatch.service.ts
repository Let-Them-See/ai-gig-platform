import fs from 'fs';
import path from 'path';

export interface CsvJob {
  job_id: string;
  job_title: string;
  job_type: string;
  required_skills: string[];
  location: string;
  experience_level: string;
  pay_type: string;
  pay_amount: number;
  category: string;
  underserved_focus: string;
}

let cachedJobs: CsvJob[] | null = null;

function loadJobsFromCsv(): CsvJob[] {
  if (cachedJobs) return cachedJobs;

  const csvPath = path.join(process.cwd(), 'tech_gig_jobs_dataset_CLEAN_FINAL_INR.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const [, ...rows] = lines;

  cachedJobs = rows.map((line) => {
    const parts = line.split(',');
    if (parts.length < 10) {
      throw new Error('Invalid CSV row: ' + line);
    }

    const [
      job_id,
      job_title,
      job_type,
      required_skills_raw,
      location,
      experience_level,
      pay_type,
      pay_amount_raw,
      category,
      underserved_focus,
    ] = parts;

    return {
      job_id,
      job_title,
      job_type,
      required_skills: required_skills_raw.split('|').map((s) => s.trim()),
      location,
      experience_level,
      pay_type,
      pay_amount: Number(pay_amount_raw),
      category,
      underserved_focus,
    };
  });

  return cachedJobs;
}

export function matchJobsFromResume(resumeText: string) {
  const text = resumeText.toLowerCase();
  const jobs = loadJobsFromCsv();

  const scored = jobs
    .map((job) => {
      const skills = job.required_skills;
      const matches = skills.filter((skill) =>
        text.includes(skill.toLowerCase())
      );
      const score =
        skills.length > 0 ? matches.length / skills.length : 0;

      return {
        job,
        score,
        matchedSkills: matches,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  return scored;
}

