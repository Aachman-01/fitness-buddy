import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const features = [
  "Premium fitness dashboards and guided planning",
  "Streamlined meal support with clearer recommendations",
  "Calmer progress tracking with a polished modern interface",
];

export default function SignInPage() {
  const [searchParams] = useSearchParams();

  const initialMode = useMemo(() => {
    return searchParams.get("mode") === "signup" ? "signup" : "signin";
  }, [searchParams]);

  const [mode, setMode] = useState(initialMode);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setMode(searchParams.get("mode") === "signup" ? "signup" : "signin");
  }, [searchParams]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setNotice(mode === "signin" ? "Successfully logged in" : "Successfully registered");
  };

  return (
    <div className="auth-page premium-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-gridline" />

      <AnimatePresence>
        {notice && (
          <motion.div
            className="top-notice"
            initial={{ opacity: 0, y: -18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-live="polite"
          >
            <span className="top-notice-dot" />
            <strong>{notice}</strong>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        className="auth-shell premium-auth-shell"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.section className="auth-panel auth-copy premium-glass premium-copy" custom={0.08} variants={fadeUp}>
          <div className="premium-badge">Fitness Buddy Access</div>
          <h1>{mode === "signin" ? "Return to your premium fitness space." : "Create your premium fitness account."}</h1>
          <p className="premium-copy-text">
            {mode === "signin"
              ? "Sign in to continue with guided workouts, better nutrition support, and a cleaner progress experience designed for consistency."
              : "Sign up to unlock a more polished AI fitness workflow with personalized plans, elevated visuals, and daily momentum tools."}
          </p>

          <div className="feature-stack">
            {features.map((item, index) => (
              <motion.div
                className="feature-line"
                key={item}
                initial="hidden"
                animate="visible"
                custom={0.14 + index * 0.06}
                variants={fadeUp}
              >
                <span className="feature-dot" />
                <p>{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="copy-footer-card">
            <span>Designed for clarity</span>
            <strong>High-contrast text, softer depth, and a more focused sign-in flow.</strong>
          </div>
        </motion.section>

        <motion.section className="auth-panel auth-card premium-glass premium-form-shell" custom={0.14} variants={fadeUp}>
          <div className="auth-tabs premium-tabs">
            <button
              className={mode === "signin" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("signin")}
              type="button"
            >
              Sign In
            </button>
            <button
              className={mode === "signup" ? "auth-tab active" : "auth-tab"}
              onClick={() => setMode("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {mode === "signin" ? (
            <form className="auth-form premium-auth-form" onSubmit={handleSubmit}>
              <div className="form-heading-wrap">
                <p className="section-kicker">Account access</p>
                <h2>Sign In</h2>
              </div>

              <label htmlFor="signin-email">Email address</label>
              <input id="signin-email" type="email" placeholder="you@example.com" />

              <label htmlFor="signin-password">Password</label>
              <input id="signin-password" type="password" placeholder="Enter your password" />

              <div className="auth-meta-row">
                <span>Secure access</span>
                <button type="button" className="text-link">Forgot password?</button>
              </div>

              <button type="submit" className="btn btn-primary auth-submit">Sign In</button>

              <p className="auth-switch">
                New here? <button type="button" className="text-link" onClick={() => setMode("signup")}>Create an account</button>
              </p>
            </form>
          ) : (
            <form className="auth-form premium-auth-form" onSubmit={handleSubmit}>
              <div className="form-heading-wrap">
                <p className="section-kicker">New membership</p>
                <h2>Sign Up</h2>
              </div>

              <label htmlFor="signup-name">Full name</label>
              <input id="signup-name" type="text" placeholder="Your full name" />

              <label htmlFor="signup-email">Email address</label>
              <input id="signup-email" type="email" placeholder="you@example.com" />

              <label htmlFor="signup-password">Create password</label>
              <input id="signup-password" type="password" placeholder="Create a secure password" />

              <div className="auth-meta-row">
                <span>Fast onboarding</span>
                <span>No clutter, just essentials</span>
              </div>

              <button type="submit" className="btn btn-primary auth-submit">Create Account</button>

              <p className="auth-switch">
                Already have an account? <button type="button" className="text-link" onClick={() => setMode("signin")}>Sign in</button>
              </p>
            </form>
          )}

          <Link to="/" className="back-home">← Back to Home</Link>
        </motion.section>
      </motion.main>
    </div>
  );
}