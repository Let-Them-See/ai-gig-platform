import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Users, Briefcase, Star, User, Building2, Zap, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
// Navbar moved to App so it's shown on every page
import { useEffect, useRef, useState, useCallback } from "react";

const stats = [
  { value: 10000, suffix: "+", label: "Gig Workers" },
  { value: 5000, suffix: "+", label: "Companies" },
  { value: 95, suffix: "%", label: "Match Rate" },
  { value: 0, suffix: "", label: "Bias Tolerance", display: "Zero" },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    desc: "Our algorithms focus on skills and potential, not demographics or pedigree.",
  },
  {
    icon: Shield,
    title: "Bias-Free Hiring",
    desc: "Anonymized profiles ensure every candidate gets a fair shot at opportunities.",
  },
  {
    icon: Users,
    title: "Inclusive by Design",
    desc: "Built to serve diverse communities with accessible, equitable experiences.",
  },
];

const howItWorks = [
  { step: "01", icon: User, title: "Create Profile", desc: "Sign up and let our AI extract your skills from your resume." },
  { step: "02", icon: Brain, title: "AI Matching", desc: "Our algorithms find gigs that perfectly match your abilities." },
  { step: "03", icon: Zap, title: "Get Matched", desc: "Receive bias-free gig recommendations ranked by fit." },
  { step: "04", icon: Award, title: "Start Working", desc: "Apply with confidence and begin your next opportunity." },
];

const useCountUp = (end: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || end === 0) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  return count;
};

const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

// Parallax scroll hook
const useParallax = () => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return scrollY;
};

const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
};

// Scroll-reveal wrapper
const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transforms: Record<string, string> = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    scale: "scale(0.9)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) translateX(0) scale(1)" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const StatItem = ({ value, suffix, label, display, delay }: { value: number; suffix: string; label: string; display?: string; delay: number }) => {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 2000, inView);
  return (
    <ScrollReveal delay={delay} direction="scale">
      <div ref={ref} className="text-center">
        <p className="font-heading text-3xl font-bold text-primary md:text-4xl">
          {display || `${count.toLocaleString()}${suffix}`}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </ScrollReveal>
  );
};

const Index = () => {
  const ctaSection = useInView(0.2);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const scrollY = useParallax();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user role from localStorage
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  const handleHeroMouse = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 30,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* Hero with parallax */}
      <section
        className="gradient-hero px-4 py-28 md:py-36 relative overflow-hidden"
        onMouseMove={handleHeroMouse}
      >
        {/* Parallax orbs */}
        <div
          className="absolute top-16 left-[10%] h-72 w-72 rounded-full opacity-20 blur-3xl animate-float"
          style={{
            background: "radial-gradient(circle, hsla(204,71%,70%,0.4) 0%, transparent 70%)",
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5 + scrollY * 0.15}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute bottom-10 right-[5%] h-96 w-96 rounded-full opacity-15 blur-3xl animate-float"
          style={{
            background: "radial-gradient(circle, hsla(193,35%,47%,0.5) 0%, transparent 70%)",
            animationDelay: "2s",
            transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3 - scrollY * 0.1}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />
        <div
          className="absolute top-1/3 right-[20%] h-48 w-48 rounded-full opacity-10 blur-2xl animate-float"
          style={{
            background: "radial-gradient(circle, hsla(195,30%,57%,0.6) 0%, transparent 70%)",
            animationDelay: "1s",
            transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8 + scrollY * 0.08}px)`,
            transition: "transform 0.3s ease-out",
          }}
        />

        {/* Glass floating panels — symmetrically aligned */}
        <div
          className="absolute bottom-24 right-[8%] hidden lg:block glass-dark bg-black/40 rounded-2xl px-5 py-4 opacity-0 animate-fade-in glow-ring"
          style={{
            animationDelay: "800ms",
            transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4 - scrollY * 0.12}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky" />
            <span className="text-sm font-medium text-white">95% Match</span>
          </div>
          <p className="mt-1 text-xs text-white/90">Frontend Developer · Remote</p>
        </div>

        <div
          className="absolute bottom-24 left-[8%] hidden lg:block glass-dark bg-black/40 rounded-2xl px-5 py-4 opacity-0 animate-fade-in glow-ring"
          style={{
            animationDelay: "1000ms",
            transform: `translate(${mousePos.x * 0.6}px, ${mousePos.y * 0.6 - scrollY * 0.12}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-highlight" />
            <span className="text-sm font-medium text-white">Bias-Free</span>
          </div>
          <p className="mt-1 text-xs text-white/90">Anonymized Profile Active</p>
        </div>

        {/* Hero content with parallax text */}
        <div
          className="container mx-auto text-center relative z-10"
          style={{
            transform: `translateY(${scrollY * -0.08}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass-dark bg-black/40 px-4 py-1.5 text-sm text-white animate-fade-in animate-pulse-glow glow-ring">
            <Star className="h-4 w-4 text-white/90" /> AI-Driven Fair Matching
          </div>

          {role === "client" ? (
            <>
              <h1
                className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-dark-base-foreground md:text-6xl opacity-0 animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                Find & Hire{" "}
                <span className="text-shimmer">Top Talent</span>
              </h1>

              <p
                className="mx-auto mt-5 max-w-xl text-lg text-muted opacity-0 animate-fade-in"
                style={{ animationDelay: "400ms" }}
              >
                Post jobs and connect with pre-screened candidates matched by AI based on skills and merit — free from bias.
              </p>

              <div
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row opacity-0 animate-fade-in"
                style={{ animationDelay: "600ms" }}
              >
                <Link to="/client/dashboard">
                  <Button size="lg" className="gap-2 text-base hover-scale shadow-lg shadow-primary/20">
                    Post Your Job <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/client/home">
                  <Button size="lg" variant="hero" className="gap-2 text-base hover-scale glow-ring">
                    Find Talent
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1
                className="mx-auto mt-6 max-w-3xl font-heading text-4xl font-extrabold leading-tight text-dark-base-foreground md:text-6xl opacity-0 animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                Your Skills Deserve{" "}
                <span className="text-shimmer">Fair Opportunities</span>
              </h1>

              <p
                className="mx-auto mt-5 max-w-xl text-lg text-muted opacity-0 animate-fade-in"
                style={{ animationDelay: "400ms" }}
              >
                An AI-powered platform that matches gig workers with opportunities based on skills and merit — free from bias.
              </p>

              <div
                className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row opacity-0 animate-fade-in"
                style={{ animationDelay: "600ms" }}
              >
                <Link to="/jobs">
                  <Button size="lg" className="gap-2 text-base hover-scale shadow-lg shadow-primary/20">
                    Find Gigs <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/resume">
                  <Button size="lg" variant="hero" className="gap-2 text-base hover-scale glow-ring">
                    Upload Resume
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats with glass effect */}
      <section className="border-b border-border glass-card px-4 py-14 relative -mt-6 mx-4 md:mx-8 rounded-2xl z-20 shadow-lg">
        <div className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <StatItem key={s.label} {...s} delay={i * 150} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                Why <span className="text-accent">GigMatchAI</span>?
              </h2>
              <p className="mt-3 text-muted-foreground">
                We're reshaping gig work to be fair, transparent, and inclusive.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={200 + i * 150} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <TiltCard>
                  <div
                    className="group glass-feature rounded-2xl p-8 transition-all duration-500 hover:shadow-xl h-full"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-accent/15 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/10"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <f.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3
                      className="mt-5 font-heading text-xl font-semibold text-foreground"
                      style={{ transform: "translateZ(15px)" }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-relaxed text-muted-foreground"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="glass-card mx-4 md:mx-8 rounded-2xl px-4 py-20 mb-8">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                How It <span className="text-accent">Works</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Get matched with your ideal gig in four simple steps.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {howItWorks.map((item, i) => (
              <ScrollReveal key={item.step} delay={200 + i * 120} direction="up">
                <div className="relative text-center">
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-border" />
                  )}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl glass-highlight transition-all duration-300 hover:scale-110 group hover-lift">
                    <item.icon className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
                  </div>
                  <span className="mt-3 inline-block font-heading text-xs font-bold text-accent">{item.step}</span>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="gradient-accent px-4 py-20 relative overflow-hidden" ref={ctaSection.ref}>
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-sky/10 blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-highlight/10 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

          <div className="container mx-auto text-center relative z-10">
            {role === "client" ? (
              <>
                <ScrollReveal delay={100}>
                  <h2 className="font-heading text-3xl font-bold text-dark-base-foreground md:text-4xl">
                    Ready to Hire Top Talent?
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  <p className="mx-auto mt-3 max-w-md text-muted">
                    Post your first job today and connect with pre-screened, AI-matched candidates.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/client/dashboard">
                      <Button size="lg" variant="hero" className="gap-2 hover-scale glow-ring">
                        <Briefcase className="h-4 w-4" /> Post a Job
                      </Button>
                    </Link>
                    <Link to="/client/home">
                      <Button size="lg" variant="hero" className="gap-2 hover-scale glow-ring">
                        <Users className="h-4 w-4" /> View Candidates
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              </>
            ) : (
              <>
                <ScrollReveal delay={100}>
                  <h2 className="font-heading text-3xl font-bold text-dark-base-foreground md:text-4xl">
                    Ready to Find Your Next Gig?
                  </h2>
                </ScrollReveal>
                <ScrollReveal delay={200}>
                  <p className="mx-auto mt-3 max-w-md text-muted">
                    Join thousands of workers and employers building a fairer gig economy.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link to="/user/login">
                      <Button size="lg" variant="hero" className="gap-2 hover-scale glow-ring">
                        <User className="h-4 w-4" /> I'm a Freelancer
                      </Button>
                    </Link>
                    <Link to="/client/login">
                      <Button size="lg" variant="hero" className="gap-2 hover-scale glow-ring">
                        <Building2 className="h-4 w-4" /> I'm an Employer
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>
              </>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold text-foreground">
              GigMatch<span className="text-accent">AI</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 GigMatchAI. Fair & Inclusive Gig Matching.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
