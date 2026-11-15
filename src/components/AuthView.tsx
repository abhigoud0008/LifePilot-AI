import { useState, type FormEvent } from "react";
import { ArrowLeft, Compass, Eye, EyeOff } from "lucide-react";

interface AuthViewProps {
  mode: "login" | "register";
  onSwitchMode: (mode: "login" | "register") => void;
  onBackToLanding: () => void;
  onLogin: (email: string, password: string) => { ok: boolean; error?: string };
  onRegister: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => { ok: boolean; error?: string };
  onDemoLogin: () => void;
}

export function AuthView({
  mode,
  onSwitchMode,
  onBackToLanding,
  onLogin,
  onRegister,
  onDemoLogin,
}: AuthViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("College Student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (mode === "login") {
      const res = onLogin(email, password);
      if (!res.ok) setError(res.error || "Sign in failed.");
    } else {
      if (name.trim().length < 2) {
        setError("Please enter your full name.");
        return;
      }
      const res = onRegister(name, email, password, role);
      if (!res.ok) setError(res.error || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] px-6 py-10 text-slate-100 flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to LifePilot AI
        </button>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/75 p-7 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Compass className="h-6 w-6 text-indigo-400" aria-hidden="true" />
            <span className="font-display text-lg font-bold text-white">
              LifePilot AI
            </span>
          </div>

          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            {mode === "login" ? "Welcome back" : "Create your workspace"}
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            {mode === "login"
              ? "Sign in to access your AI planner, focus telemetry, and daily schedule."
              : "Stored locally in your browser with instant migration support."}
          </p>

          {/* 1-Click Judge / Demo Access */}
          <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
            <p className="text-xs font-medium text-indigo-200">
              Exploring the hackathon demo?
            </p>
            <button
              type="button"
              onClick={onDemoLogin}
              className="mt-2.5 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors cursor-pointer"
            >
              Enter Demo Workspace (Alex Rivera)
            </button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-slate-800" />
            <span>or continue with email</span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label
                    htmlFor="auth-name"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Full Name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Taylor"
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auth-role"
                    className="block text-xs font-medium text-slate-300"
                  >
                    Profile Track
                  </label>
                  <select
                    id="auth-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="High School Student">High School Student</option>
                    <option value="College Student">College Student</option>
                    <option value="Young Professional">Young Professional</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="auth-email"
                className="block text-xs font-medium text-slate-300"
              >
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@lifepilot.ai"
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                className="block text-xs font-medium text-slate-300"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors cursor-pointer"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            {mode === "login" ? "New to LifePilot AI? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setError(null);
                onSwitchMode(mode === "login" ? "register" : "login");
              }}
              className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
