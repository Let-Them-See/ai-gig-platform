import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Zap, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { getDashboard } from "../api/gigApi";

const ClientHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "client") {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await getDashboard();
        const totalApplicants = data.reduce((sum: number, gig: any) => sum + gig.totalMatches, 0);
        setStats({
          totalJobs: data.length,
          totalApplicants,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - matching main home design */}
      <section className="gradient-hero px-4 py-24 md:py-36 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle, hsla(193,35%,47%,0.4) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ background: "radial-gradient(circle, hsla(195,30%,57%,0.5) 0%, transparent 70%)" }} />
        
        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-2 mb-6 text-sm text-sky">
            <Zap className="h-4 w-4" />
            <span className="font-medium">Recruiter Portal</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-dark-base-foreground mb-4 leading-tight">
            Find & Hire
            <br />
            <span className="text-shimmer">Top Talent</span>
          </h1>

          <p className="text-lg text-muted mt-5 mb-8 max-w-2xl mx-auto">
            An AI-powered platform that matches companies with candidates based on skills and merit — free from bias.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/client/dashboard">
              <Button size="lg" className="gap-2 text-base hover-scale shadow-lg shadow-primary/20">
                Post Your First Job <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="hero" className="gap-2 text-base hover-scale glow-ring">
                View Talent Pool
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - with glass effect */}
      <section className="border-b border-border glass-card px-4 py-12 relative -mt-6 mx-4 md:mx-8 rounded-2xl z-20 shadow-lg">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-bold text-primary">
                {stats.totalJobs}+
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Jobs Posted</p>
            </div>

            <div className="text-center">
              <p className="font-heading text-3xl md:text-4xl font-bold text-sky">
                {stats.totalApplicants}+
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Candidates Matched</p>
            </div>

            <div className="text-center col-span-2 md:col-span-1">
              <p className="font-heading text-3xl md:text-4xl font-bold text-highlight">
                95%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Match Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              How It <span className="text-accent">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Post jobs and connect with AI-matched candidates in four simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center relative">
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 left-[55%] w-[90%] h-px border-t-2 border-dashed border-border/50" />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-highlight text-lg font-bold text-primary mb-4">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Post a Job</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about the role, skills needed, and compensation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 left-[55%] w-[90%] h-px border-t-2 border-dashed border-border/50" />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-highlight text-lg font-bold text-primary mb-4">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">AI Screens Candidates</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes resumes and matches top candidates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 left-[55%] w-[90%] h-px border-t-2 border-dashed border-border/50" />
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-highlight text-lg font-bold text-primary mb-4">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Review Candidates</h3>
              <p className="text-sm text-muted-foreground">
                See matched candidates with skills and match scores.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full glass-highlight text-lg font-bold text-primary mb-4">
                4
              </div>
              <h3 className="font-semibold text-foreground mb-2">Hire & Connect</h3>
              <p className="text-sm text-muted-foreground">
                Accept candidates and start the hiring process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why GigMatchAI?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Bias-Free Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Our AI focuses on skills and experience, not demographics.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Underserved Talent</h4>
                <p className="text-sm text-muted-foreground">
                  Option to focus on diverse and underrepresented candidates.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-highlight flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Smart Matching</h4>
                <p className="text-sm text-muted-foreground">
                  AI learns from your preferences to find better candidates over time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Easy Management</h4>
                <p className="text-sm text-muted-foreground">
                  Accept or reject applicants right from your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Hire?</h2>
          <p className="text-muted-foreground mb-8">
            Post your first job today and start connecting with pre-screened, AI-matched candidates.
          </p>
          
          {stats.totalJobs === 0 ? (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/client/dashboard">
                <Button size="lg" className="gap-2">
                  <Briefcase className="h-5 w-5" />
                  Start Posting Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Link to="/client/dashboard">
                <Button size="lg" className="gap-2">
                  <Users className="h-5 w-5" />
                  View Applicants
                </Button>
              </Link>
              <Link to="/client/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  <Briefcase className="h-5 w-5" />
                  Post Another Job
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-12 border-t border-border bg-gradient-to-r from-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Need help?</h3>
          <p className="text-sm text-muted-foreground">
            Check out our documentation or contact support for assistance with posting jobs or managing applicants.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ClientHome;
