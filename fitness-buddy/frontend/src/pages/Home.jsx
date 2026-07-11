import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const quickPrompts = [
  "Create a 5-day fat loss workout plan with home equipment",
  "Suggest a muscle gain meal plan for a vegetarian diet",
  "Build a beginner workout routine for busy weekdays",
  "Give me a recovery-friendly fitness plan for low energy days",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (matches) => setTheme(matches ? "dark" : "light");

    applyTheme(media.matches);

    const onChange = (event) => applyTheme(event.matches);
    media.addEventListener("change", onChange);

    return () => media.removeEventListener("change", onChange);
  }, []);

  const stats = useMemo(
    () => [
      { label: "Adaptive plans", value: "Goal-based fitness flows" },
      { label: "Meal support", value: "Simple nutrition suggestions" },
      { label: "AI motivation", value: "Smarter daily accountability" },
    ],
    []
  );

const generatePlan = async (e) => {
  e.preventDefault();
  if (!prompt.trim()) return;

  setLoading(true);
  setResult("");

  try {
    const rawApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000")
      .trim()
      .replace(/\/+$/, "");
    // Ensure the base URL always includes a scheme. Without it the browser
    // reads "localhost:5000" as an unsupported URL scheme and the fetch fails.
    const API_URL = /^https?:\/\//i.test(rawApiUrl)
      ? rawApiUrl
      : `http://${rawApiUrl}`;

const response = await fetch(`${API_URL}/api/fitness/generate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: prompt.trim(),
  }),
});

    const data = await response.json();

    if (data.success) {
      setResult(data.reply);
    } else {
      setResult(data.error || "Something went wrong while generating your fitness plan.");
    }
  } catch {
    setResult("Failed to connect to backend.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={`app-shell theme-${theme}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <motion.header
        className="topbar glass-card"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <div className="brand-wrap">
          <div className="brand-mark" aria-hidden="true">
            <span />
          </div>

          <div>
            <p className="topbar-pill">AI Fitness Platform</p>
            <h1>Fitness Buddy</h1>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary navigation">
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/signin?mode=signin" className="btn btn-ghost">Sign In</Link>
          <Link to="/signin?mode=signup" className="btn btn-primary">Sign Up</Link>

          <button
            className="theme-toggle"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            type="button"
          >
            <span className="toggle-track">
              <span className="toggle-thumb">{theme === "dark" ? "🌙" : "☀️"}</span>
            </span>
          </button>
        </nav>
      </motion.header>

      <main className="hero">
        <motion.section
          className="hero-card"
          initial="hidden"
          animate="visible"
          custom={0.08}
          variants={fadeUp}
        >
          <div className="hero-copy-full">
            <p className="eyebrow">Personal AI fitness companion</p>
            <h2>Train smarter with a smoother, more focused experience.</h2>
            <p className="hero-text">
              Track workouts, plan meals, and generate guided AI fitness support in a premium
              interface with glass surfaces, polished motion, and a stronger light and dark theme system.
            </p>

            <div className="hero-actions">
              <Link to="/signin?mode=signup" className="btn btn-primary">Get Started</Link>
              <Link to="/about" className="btn btn-secondary">Explore Features</Link>
            </div>

            <div className="highlight-row">
              {stats.map((item, index) => (
                <motion.div
                  className="mini-panel"
                  key={item.label}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.24 }}
                  initial="hidden"
                  animate="visible"
                  custom={0.14 + index * 0.08}
                  variants={fadeUp}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="dashboard-grid">
          <motion.section
            className="planner-panel glass-card"
            initial="hidden"
            animate="visible"
            custom={0.18}
            variants={fadeUp}
          >
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Fitness generation</p>
                <h3>Create your plan</h3>
              </div>
              <div className="live-pill active">Live AI-ready UI</div>
            </div>

            <form className="planner-form" onSubmit={generatePlan}>
              <label className="input-label" htmlFor="fitnessPrompt">
                Describe your goal, routine, food preference, or fitness challenge
              </label>

              <textarea
                id="fitnessPrompt"
                className="prompt-input"
                placeholder="Example: Build me a beginner fat loss plan with vegetarian meals, 30-minute workouts, and 5 workout days per week."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="chip-row">
                {quickPrompts.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="quick-chip"
                    onClick={() => setPrompt(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="action-row">
                <button type="submit" className="btn btn-primary action-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Generating
                    </>
                  ) : (
                    <>
                      <span className="button-spark" />
                      Generate Plan
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary action-btn"
                  onClick={() => {
                    setPrompt("");
                    setResult("");
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
          </motion.section>

          <motion.section
            className="result-panel glass-card"
            initial="hidden"
            animate="visible"
            custom={0.24}
            variants={fadeUp}
          >
            <div className="panel-heading">
              <div>
                <p className="section-kicker">Output</p>
                <h3>Your generated fitness plan</h3>
              </div>
              <div className="char-pill">Readable response panel</div>
            </div>

            {result ? (
              <div className="result-box markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
              </div>
            ) : (
              <div className="empty-state">
                <div className="pulse-ring">
                  <div />
                </div>
                <strong>No plan generated yet</strong>
                <p>
                  Enter a fitness prompt to generate a guided workout and nutrition response on the home screen.
                </p>
              </div>
            )}
          </motion.section>
        </section>

        <motion.section
          className="feature-grid"
          initial="hidden"
          animate="visible"
          custom={0.28}
          variants={fadeUp}
        >
          <motion.article className="info-card" whileHover={{ y: -6 }} transition={{ duration: 0.24 }}>
            <p className="section-kicker">01</p>
            <h3>Workout Plans</h3>
            <p>Build routines based on your goal, schedule, and available intensity.</p>
          </motion.article>

          <motion.article className="info-card" whileHover={{ y: -6 }} transition={{ duration: 0.24 }}>
            <p className="section-kicker">02</p>
            <h3>Meal Guidance</h3>
            <p>Get practical nutrition suggestions designed for daily consistency.</p>
          </motion.article>

          <motion.article className="info-card" whileHover={{ y: -6 }} transition={{ duration: 0.24 }}>
            <p className="section-kicker">03</p>
            <h3>AI Motivation</h3>
            <p>Stay accountable with prompts, progress cues, and smarter support.</p>
          </motion.article>
        </motion.section>

        <motion.section
          className="support-box glass-card"
          initial="hidden"
          animate="visible"
          custom={0.32}
          variants={fadeUp}
        >
          <div>
            <p className="eyebrow">Support</p>
            <h3>Need help with your fitness journey?</h3>
            <p className="hero-text support-text">
              Contact our support team for account help, workout issues, sign-up support,
              or questions about meal planning features.
            </p>
          </div>

          <div className="support-actions">
            <a href="mailto:support@fitnessbuddy.com" className="btn btn-primary">
              Contact Support
            </a>
            <Link to="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}