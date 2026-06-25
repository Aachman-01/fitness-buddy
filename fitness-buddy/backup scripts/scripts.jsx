import { useMemo, useState } from "react";

const quickPrompts = [
  "Create a fat-loss plan for a college student with 20 minutes a day.",
  "Give me a beginner home workout and simple Indian meal ideas.",
  "Build a 7-day consistency routine for strength and energy.",
  "Make a low-equipment workout plus recovery and hydration tips."
];

const highlights = [
  { label: "Response type", value: "Workout + Meal + Habit" },
  { label: "Time style", value: "Fast, practical" },
  { label: "Best for", value: "Beginners to regulars" }
];

export default function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const fallbackPrompt =
    "Create a beginner 20-minute home workout, one healthy meal idea, one motivational line, and one habit goal.";

  const promptCount = useMemo(() => userPrompt.trim().length, [userPrompt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/api/fitness/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userPrompt || fallbackPrompt
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.reply);
      } else {
        setResult(data.error || "Something went wrong");
      }
    } catch (error) {
      setResult("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="hero-card reveal">
        <nav className="topbar" aria-label="Primary">
          <div className="brand-wrap">
            <div className="brand-mark" aria-hidden="true">
              <span />
            </div>
            <div>
              <p className="eyebrow">AI fitness companion</p>
              <h1>Fitness Buddy</h1>
            </div>
          </div>
          <div className="topbar-pill">Smart daily planning</div>
        </nav>

        <div className="hero-grid hero-grid-full">
          <section className="hero-copy hero-copy-full reveal delay-1">
            <p className="section-kicker">Personalized training</p>
            <h2>Build a cleaner routine with workouts, meals, habits, and motivation in one flow.</h2>
            <p className="hero-text">
              Turn a simple goal into a focused daily plan that feels structured, modern, and easy to follow.
            </p>

            <div className="highlight-row">
              {highlights.map((item) => (
                <article key={item.label} className="mini-panel">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </section>

        </div>
      </header>

      <main className="dashboard-grid">
        <section className="planner-panel glass-card reveal delay-2">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Generate your plan</p>
              <h3>Describe your goal</h3>
            </div>
            <div className="char-pill">{promptCount}/300</div>
          </div>

          <form onSubmit={handleSubmit} className="planner-form">
            <label className="input-label" htmlFor="fitness-prompt">
              What do you want help with today?
            </label>
            <textarea
              id="fitness-prompt"
              rows="6"
              maxLength={300}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Example: I want a beginner fat-loss workout, simple vegetarian meals, and one habit to stay consistent this week."
              className="prompt-input"
            />

            <div className="chip-row">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="quick-chip"
                  onClick={() => setUserPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="action-row">
              <button type="submit" disabled={loading} className="primary-btn">
                <span className={loading ? "spinner" : "button-spark"} aria-hidden="true" />
                {loading ? "Generating your plan..." : "Generate plan"}
              </button>
              <button type="button" className="secondary-btn" onClick={() => setUserPrompt(fallbackPrompt)}>
                Use smart default
              </button>
            </div>
          </form>
        </section>


        <section className="result-panel glass-card reveal delay-4">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">AI output</p>
              <h3>Your generated plan</h3>
            </div>
            <div className={`live-pill ${loading ? "active" : ""}`}>{loading ? "Live" : "Ready"}</div>
          </div>

          {result ? (
            <pre className="result-box">{result}</pre>
          ) : (
            <div className="empty-state">
              <div className="pulse-ring" aria-hidden="true">
                <div />
              </div>
              <h4>No plan generated yet</h4>
              <p>
                Enter a fitness request and the app will return a workout, meal idea, motivation line, and habit goal.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}