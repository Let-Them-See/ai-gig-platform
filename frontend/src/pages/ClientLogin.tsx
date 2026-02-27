import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser, registerUser } from "../api/authApi";

const ClientLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        const data = await registerUser({
          name,
          email,
          password,
          role: "client",
        });

        alert(data.message || "Account created");
        setIsSignUp(false);
      } else {
        const data = await loginUser(email, password);

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", "client");
          // Persist user display info so the navbar can show name/avatar immediately
          if (data.user?.name || data.name) {
            localStorage.setItem("name", data.user?.name || data.name);
          } else {
            localStorage.setItem("name", email.split("@")[0]);
          }
          if (data.user?.avatar || data.avatar) {
            localStorage.setItem("avatar", data.user?.avatar || data.avatar);
          }
          navigate("/client/home");
          // Notify navbar to update
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
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold">
          {isSignUp ? "Create Client Account" : "Client Login"}
        </h2>

        {isSignUp && (
          <div>
            <Label>Company / Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        )}

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          {isSignUp ? "Create Account" : "Login"}
        </Button>

        <p className="text-center text-sm">
          {isSignUp ? "Already have account?" : "No account?"}{" "}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>

        <p className="text-center text-sm">
          <Link to="/user/login" className="underline">
            Back to User Portal
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ClientLogin;