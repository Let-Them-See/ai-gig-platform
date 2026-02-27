import { useEffect, useState } from "react";
import { createGig, getDashboard } from "../api/gigApi";
import { getApplicantsForGig, updateMatchStatus } from "../api/matchApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Part-Time");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("Remote");
  const [experienceLevel, setExperienceLevel] = useState("Mid");
  const [payType, setPayType] = useState("Per Hour");
  const [payAmount, setPayAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [underservedFocus, setUnderservedFocus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedGigApplicants, setSelectedGigApplicants] = useState<any[] | null>(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "client") {
      // redirect to client login if not authorized
      navigate("/client/login");
    }

    const fetchData = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);
        const e = err as Error;
        setError(e.message || "Failed to load dashboard");
        if (e.message.toLowerCase().includes("login") || e.message.includes("401")) {
          alert("Session expired, please login again");
          navigate("/client/login");
        }
      }
    };

    fetchData();
  }, []);

  const fetchApplicants = async (gigId: string) => {
    setLoadingApplicants(true);
    try {
      const apps = await getApplicantsForGig(gigId);
      setSelectedGigApplicants(apps);
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to load applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateStatus = async (matchId: string, status: string) => {
    try {
      await updateMatchStatus(matchId, status);
      alert('Status updated');
      if (selectedGigApplicants && selectedGigApplicants.length > 0) {
        const gigId = selectedGigApplicants[0].gig?._id || selectedGigApplicants[0].gig;
        fetchApplicants(gigId);
      }
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to update status');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createGig({
        title,
        type,
        skills: skills.split(",").map(s => s.trim()),
        location,
        experienceLevel,
        pay: { type: payType, amount: payAmount },
        category,
        underservedFocus,
      });

      if (res.message) alert(res.message);
      // refresh dashboard
      const d = await getDashboard();
      setDashboard(d);
      // reset form
      setTitle("");
      setSkills("");
      setPayAmount(0);
      setCategory("");
      setUnderservedFocus(false);
    } catch (err) {
      console.error(err);
      alert((err as Error).message || "Failed to create gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Create Gig section - more prominent */}
      <section className="mb-12 rounded-xl border-2 border-accent/30 p-8 shadow-lg bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">📋 Create a New Job Post</h2>
          <p className="text-muted-foreground">Post a job and find the best candidates matched by our AI</p>
        </div>
        <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label className="font-semibold">Job Title *</Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., React Developer"
              required
            />
          </div>
          <div>
            <Label className="font-semibold">Job Type</Label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Part-Time</option>
              <option>Full-Time</option>
              <option>Contract</option>
              <option>Freelance</option>
            </select>
          </div>
          <div>
            <Label className="font-semibold">Location</Label>
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Remote</option>
              <option>On-Site</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div>
            <Label className="font-semibold">Experience Level</Label>
            <select 
              value={experienceLevel} 
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </div>
          <div>
            <Label className="font-semibold">Pay Type</Label>
            <select 
              value={payType} 
              onChange={(e) => setPayType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Per Hour</option>
              <option>Per Project</option>
              <option>Salary</option>
            </select>
          </div>
          <div>
            <Label className="font-semibold">Pay Amount ($)</Label>
            <Input 
              type="number" 
              value={payAmount} 
              onChange={(e) => setPayAmount(Number(e.target.value))}
              placeholder="e.g., 50"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="font-semibold">Required Skills (comma separated)</Label>
            <Input 
              value={skills} 
              onChange={(e) => setSkills(e.target.value)} 
              placeholder="e.g., React, TypeScript, Node.js"
            />
          </div>
          <div>
            <Label className="font-semibold">Category</Label>
            <Input 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder="e.g., Software Development"
            />
          </div>
          <div className="md:col-span-3 flex items-center gap-3 rounded-lg bg-background/50 p-3">
            <input 
              id="underserved" 
              type="checkbox" 
              checked={underservedFocus} 
              onChange={(e)=>setUnderservedFocus(e.target.checked)} 
            />
            <Label htmlFor="underserved" className="cursor-pointer">
              ✨ Focus on underserved candidates (diverse backgrounds)
            </Label>
          </div>

          <div className="md:col-span-3 flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              size="lg"
              className="flex-1"
            >
              {loading ? '⏳ Creating...' : '✨ Post Job'}
            </Button>
            {dashboard.length > 0 && (
              <Button type="button" variant="outline" size="lg" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                View Posted Jobs
              </Button>
            )}
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">📌 Your Posted Jobs & Applicants</h2>
        <div className="space-y-6">
          {dashboard.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
              <p className="text-lg text-muted-foreground">No jobs posted yet. Create your first job above! 👆</p>
            </div>
          )}
          {dashboard.map((g: any) => (
            <div key={g.gigId} className="rounded-xl border border-border/50 p-6 shadow-md bg-card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{g.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    👥 {g.totalMatches} applicants • ⭐ {g.averageMatchScore || 0}% avg match
                  </p>
                </div>
              </div>

              {g.topFreelancers && g.topFreelancers.length > 0 && (
                <div className="mt-4 p-4 rounded-lg bg-muted/30">
                  <p className="font-semibold mb-3">🌟 Top Applicants</p>
                  <ul className="space-y-2">
                    {g.topFreelancers.map((f:any, idx:number) => (
                      <li key={idx} className="rounded bg-background p-3 text-sm flex items-center justify-between border border-border/50">
                        <div>
                          <p className="font-semibold">{f.freelancerName}</p>
                          <p className="text-xs text-muted-foreground">{f.freelancerEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-accent">{f.score}%</p>
                          <button 
                            className="text-xs text-primary hover:underline mt-1" 
                            onClick={()=>fetchApplicants(g.gigId)}
                          >
                            View All
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Applicants panel */}
      {selectedGigApplicants && (
        <section className="mt-12 rounded-xl border-2 border-accent/30 p-8 shadow-lg bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">👥 All Applicants</h2>
            <button 
              onClick={() => setSelectedGigApplicants(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕ Close
            </button>
          </div>
          {loadingApplicants ? (
            <p className="text-center py-8">⏳ Loading applicants...</p>
          ) : (
            <div className="space-y-4">
              {selectedGigApplicants.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No applicants yet. Check back soon!</p>
              )}
              {selectedGigApplicants.map((a:any) => (
                <div key={a._id} className="rounded-lg border border-border/50 p-4 bg-background hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{a.user?.name}</p>
                      <p className="text-sm text-muted-foreground">{a.user?.email}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Match Score</p>
                          <p className="text-lg font-bold text-accent">{a.matchPercentage}%</p>
                        </div>
                        {Array.isArray(a.matchedSkills) && a.matchedSkills.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground">Matched Skills</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {a.matchedSkills.slice(0, 3).map((s:any, idx:number) => (
                                <span key={idx} className="inline-flex items-center rounded-full bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                                  {s}
                                </span>
                              ))}
                              {a.matchedSkills.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{a.matchedSkills.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {a.user?.resumeText && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          📄 {a.user.resumeText.slice(0, 150)}...
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        className="rounded-lg bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors" 
                        onClick={()=>handleUpdateStatus(a._id, 'accepted')}
                      >
                        ✓ Accept
                      </button>
                      <button 
                        className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors" 
                        onClick={()=>handleUpdateStatus(a._id, 'rejected')}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ClientDashboard;
