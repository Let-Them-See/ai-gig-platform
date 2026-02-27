import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../api/applicationApi";
import { Button } from "@/components/ui/button";

const MyApplications = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getMyApplications();
        setApps(data);
      } catch (err) {
        console.error(err);
        const e = err as Error;
        if (e.message.toLowerCase().includes("login") || e.message.includes("401")) {
          alert("Please sign in to view your applications");
          navigate("/user/login");
        } else if (e.message.toLowerCase().includes("access denied") || e.message.includes("403")) {
          alert("You are not authorized to view applications");
          navigate("/");
        } else {
          alert("Failed to load your applications");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">My Applications</h1>
      {apps.length === 0 && <p>You have not applied to any gigs yet.</p>}
      <div className="space-y-6">
        {apps.map(app => (
          <div key={app._id} className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              {app.gig?.title || "Unknown gig"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Applied on {new Date(app.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2">Status: {app.status}</p>
            <p className="mt-2">Match score: {app.matchScore}%</p>
            <Button className="mt-4" onClick={() => navigate(`/apply/${app.gig?._id}`, { state: { job: app.gig } })}>
              View Gig
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
