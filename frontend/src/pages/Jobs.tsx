import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../api/matchApi";
import { Button } from "@/components/ui/button";

interface Match {
  gigId: string;
  title: string;
  matchPercentage: number;
  skillMatchScore: number;
  semanticContribution: number;
  locationScore: number;
  salaryScore: number;
  matchedSkills: string[];
}

const Jobs = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches();
        // deduplicate by gigId (keep first occurrence)
        if (Array.isArray(data)) {
          const map = new Map<string, Match>();
          for (const item of data) {
            if (!map.has(item.gigId)) map.set(item.gigId, item);
          }
          setMatches(Array.from(map.values()));
        } else {
          setMatches(data as any);
        }
      } catch (error) {
        console.error(error);
        const err = error as Error;
        // If backend indicates authentication is required, redirect to login
        if (err.message.toLowerCase().includes("login") || err.message.toLowerCase().includes("unauthorized") || err.message.includes("401")) {
          alert("Please sign in to view your matched gigs");
          navigate("/user/login");
          return;
        }

        alert(err.message || "Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading AI Matches...</p>
      </div>
    );
  }

  const uniqueMatches = (() => {
    const seen = new Set<string>();
    const out: Match[] = [];
    for (const m of matches) {
      const key = m.gigId || m.title;
      if (!seen.has(String(key))) {
        seen.add(String(key));
        out.push(m);
      }
    }
    return out;
  })();

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">Your AI Matched Gigs</h1>

      <div className="grid gap-6">
        {uniqueMatches.map((job) => (
          <div
            key={job.gigId}
            className="rounded-lg border p-6 shadow-sm hover:shadow-md"
          >
            <h2 className="text-xl font-semibold">{job.title}</h2>

            <p className="mt-2 text-lg font-medium text-green-600">
              Match Score: {job.matchPercentage}%
            </p>

            <div className="mt-4 text-sm space-y-1 text-muted-foreground">
              <p>Skill Match: {job.skillMatchScore}%</p>
              <p>Semantic Score: {job.semanticContribution}%</p>
              <p>Location Score: {job.locationScore}%</p>
              <p>Salary Score: {job.salaryScore}%</p>
            </div>

            {job.matchedSkills.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">Matched Skills:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded bg-primary/10 px-2 py-1 text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              className="mt-6 mr-2"
              onClick={() => {
                navigate(`/job/${job.gigId}`);
              }}
            >View Details</Button>
            <Button
              className="mt-6"
              onClick={() => {
                import("../api/interactionApi").then(m => m.logInteraction(job.gigId, "click"));
                navigate(`/apply/${job.gigId}`, { state: { job } });
              }}
            >Apply</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;