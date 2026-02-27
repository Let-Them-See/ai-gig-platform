import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import { loginUser, registerUser } from "../api/authApi";

const UserLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");

    try {
      if (isSignUp) {
        const data = await registerUser({
          name,
          email,
          password,
          skills,
          role: "freelancer",
        });

        alert(data.message || "Account created");
        setIsSignUp(false);
        setName("");
        setEmail("");
        setPassword("");
        setSkills("");
      } else {
        const data = await loginUser(email, password);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", "freelancer");
          // Persist user display info if returned by the API so the
          // navbar can show name/avatar immediately after login.
          if (data.user?.name || data.name) {
            localStorage.setItem("name", data.user?.name || data.name);
          } else {
            // fallback to local part of email
            localStorage.setItem("name", email.split("@")[0]);
          }
          if (data.user?.avatar || data.avatar) {
            localStorage.setItem("avatar", data.user?.avatar || data.avatar);
          }

          // After login, return users to the public home page where
          // navigation (including the Jobs list) is available.
          navigate("/");
          // notify other parts of the app (Navbar) that user info changed
          try {
            window.dispatchEvent(new Event("user:login"));
          } catch (e) {}
        } else {
          alert(data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 gradient-hero p-12 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky/20">
            <Briefcase className="h-5 w-5 text-sky" />
          </div>
          <span className="font-heading text-xl font-bold text-dark-base-foreground">
            GigMatch<span className="text-sky">AI</span>
          </span>
        </Link>

        <div>
          <h1 className="font-heading text-4xl font-bold leading-tight text-dark-base-foreground">
            Find Gigs That
            <br />
            <span className="text-gradient">Match Your Skills</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Our AI removes bias and connects you with opportunities that truly match your skills and potential.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky/20">
              <User className="h-5 w-5 text-sky" />
            </div>
            <span className="text-sm font-medium text-sky">Gig Worker / Freelancer Portal</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted/80">
            Are you an employer?{" "}
            <Link to="/client/login" className="text-sky underline hover:text-sky/80">
              Login as Client →
            </Link>
          </p>
          <p className="text-sm text-muted/60">© 2026 GigMatchAI. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground">
              GigMatch<span className="text-accent">AI</span>
            </span>
          </Link>

          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            <User className="h-4 w-4" /> User Portal
          </div>

          <h2 className="font-heading text-3xl font-bold text-foreground">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isSignUp
              ? "Join as a freelancer and find fair gig opportunities"
              : "Sign in to find your next gig opportunity"}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="skills">Key Skills</Label>
                <Input id="skills" placeholder="e.g. React, Python, Design" value={skills} onChange={(e) => setSkills(e.target.value)} />
              </div>
            )}

            <Button className="w-full gap-2" size="lg">
              {isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-medium text-accent hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground lg:hidden">
            Are you an employer?{" "}
            <Link to="/client/login" className="font-medium text-accent hover:underline">
              Login as Client →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
