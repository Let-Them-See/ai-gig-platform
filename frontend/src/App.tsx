import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserLogin from "./pages/UserLogin";
import ClientLogin from "./pages/ClientLogin";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import ApplyJob from "./pages/ApplyJob";
import ResumeUpload from "./pages/ResumeUpload";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Navbar from "./components/Navbar";
import ClientHome from "./pages/ClientHome";
import MyApplications from "./pages/MyApplications";
import GigApplications from "./pages/GigApplications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/home" element={<ClientHome />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:gigId" element={<JobDetail />} />
          <Route path="/apply/:id" element={<ApplyJob />} />
          <Route path="/resume" element={<ResumeUpload />} />
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/applications" element={<MyApplications />} />
          <Route path="/gig/:gigId/applications" element={<GigApplications />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
