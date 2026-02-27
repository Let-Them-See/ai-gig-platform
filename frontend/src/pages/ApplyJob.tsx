import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import API_BASE from "../api/api";
import { uploadResume } from "../api/resumeApi";
import { Button } from "@/components/ui/button";

const ApplyJob = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(location.state?.job || null);
  const [cover, setCover] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [skillGap, setSkillGap] = useState<any>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (job || !id) return;
      try {
        const res = await fetch(`${API_BASE}/gigs`);
        if (!res.ok) throw new Error("Failed to fetch gigs");
        const data = await res.json();
        const found = data.find((g: any) => String(g._id) === String(id) || String(g.jobId) === String(id));
        setJob(found || null);
      if (found && localStorage.getItem("token")) {
        import("../api/gigApi").then(m =>
          m.getSkillGap(found._id || found.gigId).then(setSkillGap).catch(() => {})
        );
      }
      } catch (e) {
        console.error(e);
      }
    };
    fetchJob();

    // log that user viewed job
    if (id && localStorage.getItem("token")) {
      import("../api/interactionApi").then(m => m.logInteraction(id, "view"));
    }
  }, [id, job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem("token")) {
      alert("Please sign in to apply");
      navigate('/user/login');
      return;
    }

    try {
      setLoading(true);
      if (file) {
        await uploadResume(file);
      }

      // call backend application endpoint
      try {
        await import("../api/applicationApi").then(m=>m.applyToGig(job._id || job.gigId));
      } catch (err) {
        console.error(err);
        throw err;
      }

      alert("Application submitted successfully");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const e2 = err as Error;
      alert(e2.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto rounded-lg border p-8 shadow text-foreground">
        <h1 className="text-2xl font-bold mb-2 text-foreground">Apply: {job.title}</h1>
        <p className="text-sm text-muted-foreground mb-4">Location: {job.location || 'Remote'}</p>
        {skillGap && (
          <div className="mb-4 text-sm">
            {skillGap.missingSkills && skillGap.missingSkills.length > 0 ? (
              <p className="text-red-600">
                You are missing: {skillGap.missingSkills.join(", ")}
              </p>
            ) : (
              <p className="text-green-600">You have all required skills!</p>
            )}
            {skillGap.improvementScore != null && (
              <p className="mt-1">Improvement score: {skillGap.improvementScore}%</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground">Cover Letter</label>
            <textarea
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              className="w-full mt-2 rounded border p-2 bg-transparent text-foreground placeholder:text-muted-foreground"
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground">Attach Resume (optional)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="mt-2 text-foreground bg-transparent"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;
