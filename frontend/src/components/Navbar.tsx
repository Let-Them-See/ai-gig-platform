import { Link, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Menu, X, User, Building2, ChevronDown, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; avatar?: string } | null>(null);
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const navigate = useNavigate();
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "light");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Default links for freelancers
  let links = [
    { to: "/", label: "Home" },
    { to: "/jobs", label: "Find Gigs" },
    { to: "/resume", label: "Upload Resume" },
    { to: "/applications", label: "My Applications" }
  ];
  
  // Override links for clients
  if (role === "client") {
    links = [
      { to: "/client/home", label: "Home" },
      { to: "/client/dashboard", label: "Post Jobs" },
      { to: "/applications", label: "Applications" }
    ];
  }

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLoginDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load user info from backend or localStorage so navbar shows name/avatar when logged in
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const currentRole = localStorage.getItem("role");
      setRole(currentRole);
      
      if (!token) {
        setUser(null);
        setRole(null);
        return;
      }

      // try fetch profile from API (preferred)
      try {
        // lazy import to avoid circular deps
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { getProfile } = await import("../api/authApi");
        const profile = await getProfile();
        if (profile && (profile.name || profile.user)) {
          const name = profile.name || profile.user?.name;
          const avatar = profile.avatar || profile.user?.avatar;
          if (name) localStorage.setItem("name", name);
          if (avatar) localStorage.setItem("avatar", avatar);
          setUser({ name, avatar });
          return;
        }
      } catch (err) {
        // ignore and fallback to storage
      }

      // fallback to localStorage
      let name = localStorage.getItem("name") || undefined;
      let avatar = localStorage.getItem("avatar") || undefined;

      // If still no name, try to decode JWT token payload for common claims
      if (!name) {
        try {
          const token = localStorage.getItem("token") || "";
          const parts = token.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(decodeURIComponent(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c){
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')));
            name = payload.name || payload.username || payload.email?.split('@')[0] || name;
            avatar = avatar || payload.avatar || payload.picture || avatar;
          }
        } catch (e) {
          // ignore
        }
      }

      setUser({ name: name || undefined, avatar: avatar || undefined });
    };

    // load initially
    load();

    // also refresh on storage changes (other tabs) or after login event
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("user:login", onStorage as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user:login", onStorage as EventListener);
    };
  }, []);

  // Theme handling
  useEffect(() => {
    try {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }, [theme]);

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            GigMatch<span className="text-accent">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop login or user menu */}
        <div className="hidden items-center gap-2 md:flex relative" ref={dropdownRef}>
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="rounded-lg p-2 hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {!user ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setLoginDropdown(!loginDropdown)}
              >
                Login / Sign Up
                <ChevronDown className={`h-4 w-4 transition-transform ${loginDropdown ? "rotate-180" : ""}`} />
              </Button>

              {loginDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover p-2 shadow-lg">
                  <Link
                    to="/user/login"
                    onClick={() => setLoginDropdown(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <User className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">User Login</p>
                      <p className="text-xs text-muted-foreground">Freelancer / Gig Worker</p>
                    </div>
                  </Link>
                  <Link
                    to="/client/login"
                    onClick={() => setLoginDropdown(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-highlight/10">
                      <Building2 className="h-5 w-5 text-highlight" />
                    </div>
                    <div>
                      <p className="font-semibold">Client Login</p>
                      <p className="text-xs text-muted-foreground">Employer / Company</p>
                    </div>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
              >
                {user.avatar ? (
                  // show remote avatar image if provided
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img src={user.avatar} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  // show initials
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                    {user.name ? user.name.split(" ").map(n=>n[0]).slice(0,2).join("") : "U"}
                  </div>
                )}
                <span className="hidden md:inline-block text-sm font-medium">{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-border bg-popover p-2 shadow-lg">
                  <button
                    onClick={async () => {
                      try {
                        await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
                      } catch (e) {}
                      localStorage.removeItem("token");
                      localStorage.removeItem("name");
                      localStorage.removeItem("avatar");
                      localStorage.removeItem("role");
                      setUser(null);
                      setRole(null);
                      setUserMenuOpen(false);
                      navigate("/");
                    }}
                    className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    Logout
                  </button>
                  <Link 
                    to={role === "client" ? "/client/dashboard" : "/dashboard"} 
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-muted" 
                    onClick={()=>setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 space-y-2">
            <Link to="/user/login" className="block" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <User className="h-4 w-4" /> User Login
              </Button>
            </Link>
            <Link to="/client/login" className="block" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full justify-start gap-2">
                <Building2 className="h-4 w-4" /> Client Login
              </Button>
            </Link>
            <div className="pt-2">
              <button
                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                className="w-full rounded-lg px-4 py-3 text-sm text-left hover:bg-muted"
              >
                Theme: {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
