import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGigApplications, updateApplicationStatus } from "../api/applicationApi";
import { Button } from "@/components/ui/button";

const GigApplications = () => {
  const { gigId } = useParams();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!gigId) return;
      try {
        const data = await getGigApplications(gigId);
        setApps(data);
      } catch (err) {
        console.error(err);
        alert("Unable to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [gigId]);

  const changeStatus = async (appId: string, status: string) => {
    try {
      await updateApplicationStatus(appId, status);
      setApps(prev => prev.map(a => (a._id === appId ? { ...a, status } : a)));
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-6 text-2xl font-bold">Applications for Gig</h1>
      {apps.length === 0 && <p>No applications yet.</p>}
      <div className="space-y-4">
        {apps.map(app => (
          <div key={app._id} className="border rounded p-4">
            <p>Name: {app.freelancer?.name}</p>
            <p>Email: {app.freelancer?.email}</p>
            <p>Applied: {new Date(app.createdAt).toLocaleString()}</p>
            <p>Status: {app.status}</p>
            <div className="mt-2 flex gap-2">
              <Button onClick={() => changeStatus(app._id, "shortlisted")}>Shortlist</Button>
              <Button onClick={() => changeStatus(app._id, "accepted")}>Accept</Button>
              <Button variant="destructive" onClick={() => changeStatus(app._id, "rejected")}>Reject</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GigApplications;
