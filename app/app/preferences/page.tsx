"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function PreferencesPage() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggleTheme() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
  }

  return (
    <div className="preferences-page">
      <h1>Preferences</h1>

      <section className="preferences-section">
        <h2>Appearance</h2>
        <div className="preferences-row">
          <div>
            <strong>Theme</strong>
            <p>Switch between dark and light mode.</p>
          </div>
          <button type="button" className="button button-secondary" onClick={toggleTheme}>
            {light ? <Sun size={15} /> : <Moon size={15} />}
            {light ? "Light" : "Dark"}
          </button>
        </div>
      </section>

      <section className="preferences-section">
        <h2>Account</h2>
        <div className="preferences-row">
          <div>
            <strong>Daily AI usage</strong>
            <p>Free plan — audits, tailoring, and cover letters reset every day.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
