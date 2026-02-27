import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, getFreelancerDashboard } from "../api/gigApi";
import { Button } from "@/components/ui/button";

// lightweight charts
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Freelancer {
  freelancerName: string;
  freelancerEmail: string;
  score: number;
}

interface GigDashboard {
  gigId: string;
  title: string;
  totalMatches: number;
  averageMatchScore: number;
  topFreelancers: Freelancer[];
}

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = localStorage.getItem("role") || "freelancer";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = role === "client" ? await getDashboard() : await getFreelancerDashboard();
        const filtered = Array.isArray(res)
          ? res.filter((g: any) => !/build a react website/i.test(g.title || ""))
          : res;
        setData(filtered);
      } catch (error) {
        console.error(error);
        const e = error as Error;
        setError(e.message || "Failed to load dashboard");
        if (e.message.toLowerCase().includes("login") || e.message.includes("401")) {
          alert("Session expired, please login again");
          navigate(role === "client" ? "/client/login" : "/user/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [role]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-3xl font-bold">{role === "client" ? "Recruiter Dashboard" : "Available Gigs"}</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {data.length === 0 && (
        <p>No gigs found. Post a job to see analytics.</p>
      )}

      <div className="space-y-6">
        {data.map((gig) => (
          <div key={gig._id || gig.gigId} className="rounded-lg border p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{gig.title}</h2>

            {role === "client" ? (
              <>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <p>Total Matches: {gig.totalMatches}</p>
                  <p>Average Match Score: {gig.averageMatchScore}%</p>
                </div>

                {gig.topFreelancers.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium">Top Freelancers:</p>
                    <ul className="mt-2 space-y-2">
                      {gig.topFreelancers.map((freelancer, index) => (
                        <li
                          key={index}
                          className="rounded bg-primary/10 p-3 text-sm"
                        >
                          <p>{freelancer.freelancerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {freelancer.freelancerEmail}
                          </p>
                          <p className="font-medium">
                            Score: {freelancer.score}%
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* analytics charts */}
                {gig.skillDistribution && gig.skillDistribution.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold">Skill Distribution</h3>
                    <Bar
                      data={{
                        labels: gig.skillDistribution.map((s: any) => s.skill),
                        datasets: [
                          {
                            label: "Count",
                            data: gig.skillDistribution.map((s: any) => s.count),
                            backgroundColor: "rgba(75,192,192,0.4)"
                          }
                        ]
                      }}
                      options={{ responsive: true, plugins: { legend: { display: false } } }}
                    />
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gig.locationDistribution && gig.locationDistribution.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Location Distribution</h3>
                      <Pie
                        data={{
                          labels: gig.locationDistribution.map((l: any) => l.location),
                          datasets: [
                            {
                              data: gig.locationDistribution.map((l: any) => l.count),
                              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
                            }
                          ]
                        }}
                      />
                    </div>
                  )}

                  {gig.topDemandedSkills && gig.topDemandedSkills.length > 0 && (
                    <div>
                      <h3 className="font-semibold">Top Demanded Skills</h3>
                      <ul className="list-disc ml-6">
                        {gig.topDemandedSkills.map((s: any, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <p className="mt-4">Application Conversion: {gig.conversionRate}%</p>
                <p className="mt-2">Average Expected Salary: ${gig.avgExpectedPay.toFixed(2)}</p>
                <p className="mt-1">Job Pay: ${gig.averageGigPay.toFixed(2)}</p>

                <Button
                  className="mt-4"
                  onClick={() => navigate(`/gig/${gig.gigId || gig._id}/applications`)}
                >
                  View Applications
                </Button>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">{gig.type}</p>
                <div className="mt-4 space-y-1 text-sm">
                  <p><strong>Skills:</strong> {Array.isArray(gig.skills) ? gig.skills.join(", ") : gig.skills}</p>
                  <p><strong>Location:</strong> {gig.location}</p>
                  <p><strong>Pay:</strong> {gig.pay?.type && gig.pay?.amount ? `${gig.pay.type} - $${gig.pay.amount}` : "Not specified"}</p>
                </div>
              </>
            )}

            <Button
              className="mt-4"
              onClick={() => navigate(`/apply/${gig._id || gig.gigId}`, { state: { job: gig } })}
            >
              View Gig Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;