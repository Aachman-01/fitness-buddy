import { Link } from "react-router-dom";
import { motion } from "motion/react";

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

const values = [
  {
    label: "Precision coaching",
    text: "We shape guided plans that feel practical, adaptive, and easier to sustain every week.",
  },
  {
    label: "Clarity first",
    text: "The experience is built to reduce noise so your workouts, meals, and progress stay easy to understand.",
  },
  {
    label: "Daily momentum",
    text: "Small improvements compound when the interface keeps your next best action visible and motivating.",
  },
];

export default function About() {
  return (
    <div className="auth-page premium-page">
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <motion.main
        className="about-shell premium-shell"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.section className="about-hero premium-glass" custom={0.06} variants={fadeUp}>
          <div className="premium-badge">About Fitness Buddy</div>
          <h1>Built to make modern fitness guidance feel premium, personal, and calm.</h1>
          <p className="about-lead">
            Fitness Buddy helps people stay consistent with workouts, nutrition, and better daily habits through an AI-powered experience designed for focus instead of friction.
          </p>

          <div className="about-metrics">
            <div className="metric-card">
              <span>Interface goal</span>
              <strong>Less overwhelm</strong>
            </div>
            <div className="metric-card">
              <span>Planning style</span>
              <strong>Simple and adaptive</strong>
            </div>
            <div className="metric-card">
              <span>Experience tone</span>
              <strong>Calm premium flow</strong>
            </div>
          </div>
        </motion.section>

        <section className="about-grid">
          <motion.article className="about-story premium-glass" custom={0.12} variants={fadeUp}>
            <p className="section-kicker">Our mission</p>
            <h2>Healthy living should feel guided, not confusing.</h2>
            <p>
              We designed the platform to turn broad goals into cleaner next steps, whether someone is trying to improve energy, build strength, stay accountable, or simplify food choices.
            </p>
            <p>
              Every part of the interface is meant to feel elevated and readable, with clear actions, refined contrast, and a polished rhythm that supports trust.
            </p>
          </motion.article>

          <motion.aside className="about-values premium-glass" custom={0.18} variants={fadeUp}>
            <p className="section-kicker">Why it feels different</p>
            <div className="value-list">
              {values.map((item) => (
                <div className="value-item" key={item.label}>
                  <span>{item.label}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </motion.aside>
        </section>

        <motion.section className="about-cta premium-glass" custom={0.24} variants={fadeUp}>
          <div>
            <p className="section-kicker">Get started</p>
            <h3>Ready to explore a more refined fitness workflow?</h3>
            <p>
              Move back to the home experience or open the account page to begin with the new premium sign-in and sign-up flow.
            </p>
          </div>

          <div className="about-actions">
            <Link to="/signin?mode=signup" className="btn btn-primary">Create Account</Link>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}