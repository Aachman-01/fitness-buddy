import { useMemo, useState } from 'react';

const summaryStats = [
  { label: 'Recovery', value: '87%', tone: 'primary' },
  { label: 'Workout streak', value: '14 days', tone: 'success' },
  { label: 'Sleep avg', value: '7.8 h', tone: 'accent' },
];

const defaultOutput = {
  title: 'Weekly muscle gain plan',
  subtitle: 'Goal-focused training, nutrition, and recovery guidance generated for this week.',
  sections: [
    {
      heading: 'Workout focus',
      content:
        '4 strength sessions, 1 mobility day, and 1 active recovery day with progressive overload on compound lifts.',
    },
    {
      heading: 'Nutrition target',
      content:
        'Aim for high-protein meals across 4 feedings with a carb-heavy pre-workout meal and a recovery meal within 90 minutes.',
    },
    {
      heading: 'Recovery note',
      content:
        'Keep Friday intensity moderate if leg fatigue stays elevated and prioritize hydration before evening sessions.',
    },
  ],
};

function DashboardShell() {
  const [prompt, setPrompt] = useState('Build a high-protein muscle gain plan for this week with workouts, meals, and recovery advice.');
  const [theme, setTheme] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  );

  const quickPrompts = useMemo(
    () => [
      'Muscle gain week',
      'Fat loss meals',
      'Recovery reset',
      'Home workout plan',
    ],
    []
  );

  const handlePromptFill = (value) => {
    const promptMap = {
      'Muscle gain week': 'Create a 7-day muscle gain plan with workouts, macros, and recovery timing.',
      'Fat loss meals': 'Suggest a fat loss meal plan with high protein, moderate carbs, and simple prep.',
      'Recovery reset': 'Build a recovery-focused schedule for soreness, sleep, hydration, and light movement.',
      'Home workout plan': 'Create a home workout plan using bodyweight and minimal equipment for 5 days.',
    };
    setPrompt(promptMap[value] || value);
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="background-layer background-one" />
      <div className="background-layer background-two" />
      <div className="noise-grid" />

      <main className="dashboard">
        <section className="hero panel reveal reveal-1">
          <div className="hero-copy">
            <p className="eyebrow">AI fitness workspace</p>
            <h1>Fitness Buddy</h1>
            <p className="hero-text">
              A focused interface for your training prompts and AI-generated fitness output with cleaner structure,
              stronger readability, and seamless use across desktop and mobile.
            </p>

            <div className="stats-row">
              {summaryStats.map((item) => (
                <article key={item.label} className="stat-card">
                  <span className="stat-label">{item.label}</span>
                  <strong>{item.value}</strong>
                  <span className={`stat-dot ${item.tone}`} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>

          <div className="hero-side">
            <button
              className="theme-toggle"
              type="button"
              aria-label="Toggle light and dark mode"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>

            <div className="score-card float-card">
              <span className="mini-label">Readiness</span>
              <div className="score-ring" aria-hidden="true">
                <div className="score-core">
                  <strong>87</strong>
                  <span>ready</span>
                </div>
              </div>
              <p className="score-copy">Excellent recovery balance for a productive training day.</p>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <article className="panel prompt-panel reveal reveal-2">
            <div className="panel-head compact-head">
              <div>
                <p className="eyebrow">Coach input</p>
                <h2>Prompt studio</h2>
              </div>
            </div>

            <label htmlFor="coachPrompt" className="input-label">
              Describe the plan you want
            </label>
            <textarea
              id="coachPrompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="6"
              placeholder="Ask for workout plans, meals, progress support, or recovery guidance"
            />

            <div className="chip-row">
              {quickPrompts.map((item) => (
                <button key={item} type="button" className="chip" onClick={() => handlePromptFill(item)}>
                  {item}
                </button>
              ))}
            </div>

            <button className="primary-button wide-button" type="button">
              Generate output
            </button>
          </article>

          <article className="panel output-panel reveal reveal-3">
            <div className="panel-head compact-head">
              <div>
                <p className="eyebrow">Fitness Buddy output</p>
                <h2>{defaultOutput.title}</h2>
              </div>
              <span className="status-pill">Ready</span>
            </div>

            <p className="output-subtitle">{defaultOutput.subtitle}</p>

            <div className="output-stack">
              {defaultOutput.sections.map((section) => (
                <article key={section.heading} className="output-card">
                  <h3>{section.heading}</h3>
                  <p>{section.content}</p>
                </article>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default DashboardShell;
