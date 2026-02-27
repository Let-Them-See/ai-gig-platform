import { useState } from "react";
import { uploadResume } from "../api/resumeApi";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Redirect clients to job creation dashboard
  if (role === "client") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 rounded-lg border p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold">Client Portal</h2>
          <p className="text-sm text-muted-foreground">Clients create jobs in the dashboard, not here.</p>
          <Link to="/client/dashboard">
            <Button>Go to Job Creation</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume file");
      return;
    }

    try {
      setLoading(true);

      const data = await uploadResume(file);
      // backend success payload may include message
      if (data && data.message) {
        alert(data.message);
      } else {
        alert("Resume uploaded successfully");
      }

    } catch (error) {
      console.error(error);
      const err = error as Error;
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      {!token ? (
        <div className="space-y-4 rounded-lg border p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold">You need to login to upload a resume</h2>
          <p className="text-sm text-muted-foreground">Please sign in to upload your resume and view personalized matches.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/user/login">
              <Button>Sign In</Button>
            </Link>
            <Button variant="outline" onClick={() => navigate('/jobs')}>View Jobs</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-6 rounded-lg border p-8 shadow-md">
          <h2 className="text-2xl font-bold">Upload Your Resume</h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Resume"}
            </Button>
            <Button variant="outline" onClick={() => navigate(localStorage.getItem('token') ? '/jobs' : '/jobs')}>
              Find Gigs
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResumeUpload;