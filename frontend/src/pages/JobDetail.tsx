import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatches } from "../api/matchApi";
import { apiFetch } from "../api/client";
import { Button } from "@/components/ui/button";
import { getSkillGap } from "../api/gigApi";
import API_BASE from "../api/api";

interface Job {
  gigId: string;
  title: string;
  matchPercentage: number;
  skillMatchScore: number;
  semanticContribution: number;
  locationScore: number;
  salaryScore: number;
  matchedSkills: string[];
}

const JobDetail = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillGap, setSkillGap] = useState<any>(null);
  const [showSkillGap, setShowSkillGap] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        // Fetch the full gig details
        const res = await apiFetch(`/gigs/${gigId}`, { method: "GET" });
        if (!res.ok) {
          throw new Error("Failed to load job details");
        }
        const gigData = await res.json();
        setJob(gigData);

        // Also fetch skill gap analysis
        try {
          const gap = await getSkillGap(gigId as string);
          setSkillGap(gap);
        } catch (err) {
          console.log("Skill gap not available");
        }
      } catch (err) {
        console.error(err);
        const e = err as Error;
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (gigId) {
      fetchJobDetail();
    }
  }, [gigId]);

  const handleApply = async () => {
    try {
      setApplying(true);
      const res = await apiFetch(`/applications/apply/${gigId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to apply");
      }

      alert("Application submitted successfully!");
      navigate("/my-applications");
    } catch (err) {
      const e = err as Error;
      alert(e.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">{error || "Job not found"}</p>
          <Button className="mt-4" onClick={() => navigate("/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Button variant="outline" className="mb-6" onClick={() => navigate("/jobs")}>
        ← Back to Matches
      </Button>

      <div className="max-w-4xl mx-auto rounded-lg border shadow-lg p-8">
        {/* Header */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
          <div className="flex gap-4 flex-wrap text-sm text-muted-foreground">
            <p>📍 {job.location || "Unknown"}</p>
            <p>💼 {job.type || "Unknown"}</p>
            <p>💰 {job.pay?.type || "Unknown"}: ${job.pay?.amount || "0"}</p>
            <p>📊 {job.experienceLevel || "Unknown"} Level</p>
          </div>
        </div>

        {/* Match Score */}
        <div className="mb-8 p-4 rounded-lg bg-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Match Score</p>
              <p className="text-4xl font-bold text-green-600">{Math.round(job.matchPercentage)}%</p>
            </div>
            <div className="text-right space-y-2">
              <p className="text-sm">Skill Match: <span className="font-semibold">{Math.round(job.skillMatchScore)}%</span></p>
              <p className="text-sm">Semantic: <span className="font-semibold">{Math.round(job.semanticContribution)}%</span></p>
              <p className="text-sm">Location: <span className="font-semibold">{Math.round(job.locationScore)}%</span></p>
              <p className="text-sm">Salary: <span className="font-semibold">{Math.round(job.salaryScore)}%</span></p>
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {(job.skills || []).map((skill: string, idx: number) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  job.matchedSkills?.includes(skill)
                    ? "bg-green-500/20 text-green-700 border border-green-500"
                    : "bg-gray-200/50 text-gray-700 border border-gray-300"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Matched Skills */}
        {job.matchedSkills && job.matchedSkills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">✅ Your Matching Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.matchedSkills.map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-500 text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skill Gap */}
        {skillGap && (
          <div className="mb-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <button
              onClick={() => setShowSkillGap(!showSkillGap)}
              className="flex items-center gap-2 w-full text-left font-semibold"
            >
              <span>{showSkillGap ? "▼" : "▶"}</span>
              📚 Skills Gap Analysis
            </button>
            {showSkillGap && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Missing Skills</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(skillGap.missingSkills || []).map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-500 text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Improvement Score:</strong> {skillGap.improvementScore}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* Category & Other Details */}
        {job.category && (
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Category</h3>
            <p className="text-muted-foreground">{job.category}</p>
          </div>
        )}

        {job.underservedFocus && (
          <div className="mb-8 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm"><strong>Underserved Focus:</strong> {job.underservedFocus}</p>
          </div>
        )}

        {/* Apply Button */}
        <div className="flex gap-3 mt-10 pt-6 border-t">
          <Button
            size="lg"
            onClick={handleApply}
            disabled={applying}
            className="flex-1"
          >
            {applying ? "Applying..." : "Apply for This Job"}
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/jobs")}>
            View More Matches
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
