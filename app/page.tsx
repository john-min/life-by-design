"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type EnergyEntry = {
  id: number;
  activity: string;
  energy: number;
  engagement: number;
};

type OdysseyPath = {
  label: string;
  prompt: string;
  description: string;
  title: string;
  detail: string;
  color: "blue" | "yellow" | "green";
};

type DashboardKey = "health" | "work" | "play" | "love";

type DashboardScores = Record<DashboardKey, number | null>;

type Views = {
  life: string;
  work: string;
  coherence: string;
};

const storageKeys = {
  dashboard: "life-by-design-dashboard",
  views: "life-by-design-views",
  energy: "life-by-design-energy",
  odyssey: "life-by-design-odyssey",
  reflections: "life-by-design-reflections",
  nextStep: "life-by-design-next-step",
} as const;

function readStoredValue<T>(key: string): T | null {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

function writeStoredValue(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Reflection still works in memory when storage is unavailable.
  }
}

const principles = [
  {
    number: "01",
    title: "Curiosity",
    copy: "Turn judgment into questions. Stay open to what you do not yet know and let new possibilities become visible.",
  },
  {
    number: "02",
    title: "Bias to action",
    copy: "Build your way forward. Small experiments create real information that thinking alone cannot provide.",
  },
  {
    number: "03",
    title: "Reframing",
    copy: "Step back and examine the problem you think you are solving. A more useful frame can unlock a next move.",
  },
  {
    number: "04",
    title: "Awareness",
    copy: "Notice where you are in the process, including when you feel stuck. Life design is iterative, not linear.",
  },
  {
    number: "05",
    title: "Radical collaboration",
    copy: "You do not have to design alone. Other people bring perspective, opportunities, and possibilities you cannot see by yourself.",
  },
];

const questions = [
  "Where in your life do you feel most alive right now?",
  "What regularly leaves you feeling depleted—even when you do it well?",
  "When did you last become so absorbed that you lost track of time?",
  "Beyond work, which people and roles make your life feel full?",
  "What belief about your future might be ready for a gentler reframe?",
  "If your current path continued beautifully, what could the next five years hold?",
  "If that path disappeared tomorrow, what different life would you explore?",
  "If money and other people’s opinions went quiet, what would you become curious about?",
];

const starterPaths: OdysseyPath[] = [
  {
    label: "Life 1",
    prompt: "Life 1 — Your current direction",
    description: "Carry the life you’re living—or the idea already taking shape—five years forward.",
    title: "Keep growing this life",
    detail: "What becomes possible when the current direction goes well?",
    color: "blue",
  },
  {
    label: "Life 2",
    prompt: "Life 2 — If Life 1 were no longer possible",
    description: "Set your first plan aside. What different direction would you pursue?",
    title: "Follow a different thread",
    detail: "Remove the obvious answer. What else deserves a real look?",
    color: "yellow",
  },
  {
    label: "Life 3",
    prompt: "Life 3 — Without money or image constraints",
    description: "Imagine your basic needs are covered. What would you pursue without concerns about status or other people’s expectations?",
    title: "Choose the wild card",
    detail: "What would you try if nobody needed an explanation?",
    color: "green",
  },
];

const energyLabels = ["Drained", "Low", "Neutral", "Lifted", "Energized"];
const engagementLabels = ["Distant", "Distracted", "Present", "Absorbed", "In flow"];
const dashboardLevels = [0, 25, 50, 75, 100];

const dashboardLevelLabels: Record<number, string> = {
  0: "Empty",
  25: "One-quarter full",
  50: "Half full",
  75: "Three-quarters full",
  100: "Full",
};

const dashboardAreas: Array<{
  key: DashboardKey;
  label: string;
  description: string;
  reflection: string;
}> = [
  {
    key: "health",
    label: "Health",
    description: "Body, mind, and emotional wellbeing",
    reflection: "How supported and alive do you feel in your body and mind?",
  },
  {
    key: "work",
    label: "Work",
    description: "Contribution, craft, and livelihood",
    reflection: "How meaningful and sustainable does your work feel today?",
  },
  {
    key: "play",
    label: "Play",
    description: "Joy without a productive purpose",
    reflection: "How much room is there for delight, wonder, and fun?",
  },
  {
    key: "love",
    label: "Love",
    description: "People, belonging, and mutual care",
    reflection: "How connected do you feel to the people who matter?",
  },
];

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? "mark mark--compact" : "mark"} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function Constellation() {
  return (
    <svg
      className="constellation"
      viewBox="0 0 520 320"
      role="img"
      aria-label="A constellation of possible paths above the lake"
    >
      <g className="constellation__lines">
        <path d="M42 226 116 178 188 207 257 119 333 154 407 76 478 112" />
        <path d="M116 178 132 86 257 119 291 244 410 256" />
        <path d="M188 207 291 244 333 154 478 112" />
      </g>
      <g className="constellation__points">
        <circle className="point point--sun" cx="42" cy="226" r="6" />
        <circle className="point point--sky" cx="116" cy="178" r="7" />
        <circle className="point point--trail" cx="132" cy="86" r="5" />
        <circle className="point point--sun" cx="188" cy="207" r="5" />
        <circle className="point point--paper" cx="257" cy="119" r="8" />
        <circle className="point point--trail" cx="291" cy="244" r="6" />
        <circle className="point point--sky" cx="333" cy="154" r="5" />
        <circle className="point point--sun" cx="407" cy="76" r="7" />
        <circle className="point point--paper" cx="410" cy="256" r="5" />
        <circle className="point point--trail" cx="478" cy="112" r="6" />
      </g>
    </svg>
  );
}

function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg
      aria-hidden="true"
      className={`arrow arrow--${direction}`}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
    >
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function Landscape() {
  return (
    <div className="landscape" aria-label="An open lake beneath distant mountains">
      <div className="sun" />
      <div className="mountain mountain--back" />
      <div className="mountain mountain--front" />
      <div className="shore shore--far" />
      <div className="lake">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="shore shore--near" />
      <div className="trail-dots" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <Constellation />
      <p className="landscape-note">There is more than one way forward.</p>
    </div>
  );
}

function JourneyGuide() {
  const stages = [
    { number: "01", label: "Learn", detail: "Meet the five designer mindsets.", href: "#framework" },
    { number: "02", label: "Notice", detail: "Take stock and follow your energy.", href: "#dashboard" },
    { number: "03", label: "Imagine", detail: "Sketch three possible futures.", href: "#odyssey" },
    { number: "04", label: "Reflect", detail: "Answer eight quiet questions.", href: "#reflect" },
  ];

  return (
    <section className="journey-guide" aria-labelledby="journey-title">
      <div className="journey-guide__intro">
        <p className="eyebrow">A light guided experience</p>
        <h2 id="journey-title">Follow the trail, or begin where you feel curious.</h2>
        <p>About 10 minutes for the reflection, or 25 minutes to explore the full framework. Nothing is graded.</p>
      </div>
      <ol>
        {stages.map((stage) => (
          <li key={stage.number}>
            <a href={stage.href}>
              <span>{stage.number}</span>
              <strong>{stage.label}</strong>
              <small>{stage.detail}</small>
              <Arrow />
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function LifeDashboard() {
  const [scores, setScores] = useState<DashboardScores>({ health: null, work: null, play: null, love: null });

  useEffect(() => {
    const saved = readStoredValue<DashboardScores>(storageKeys.dashboard);
    if (!saved) return;
    const timer = window.setTimeout(() => {
      const normalize = (value: number | null) => {
        if (value === null || value === undefined) return null;
        const percentage = value <= 10 ? value * 10 : value;
        return Math.min(100, Math.max(0, Math.round(percentage / 25) * 25));
      };
      setScores({
        health: normalize(saved.health),
        work: normalize(saved.work),
        play: normalize(saved.play),
        love: normalize(saved.love),
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateScore(key: DashboardKey, score: number) {
    const next = { ...scores, [key]: score };
    setScores(next);
    writeStoredValue(storageKeys.dashboard, next);
  }

  return (
    <div className="life-dashboard">
      <div className="dashboard-note">
        <span>Today’s snapshot</span>
        <strong>Four gauges<small>no total score</small></strong>
        <p>Think of each area as a gas tank. How full does it feel today: empty, one-quarter, half, three-quarters, or full?</p>
      </div>
      <div className="dashboard-grid">
        {dashboardAreas.map((area) => (
          <article
            className="dashboard-area"
            key={area.key}
            data-level={scores[area.key] ?? undefined}
          >
            <div className="dashboard-tank-reading">
              <div
                className={`dashboard-tank ${scores[area.key] === null ? "is-unanswered" : ""}`}
                role="img"
                aria-label={scores[area.key] === null ? `${area.label} has not been answered` : `${area.label} feels ${scores[area.key]}% full`}
              >
                {[25, 50, 75, 100].map((level) => (
                  <i className={(scores[area.key] ?? -1) >= level ? "is-filled" : ""} key={level} />
                ))}
              </div>
              <strong>{scores[area.key] === null ? "—" : `${scores[area.key]}%`}</strong>
            </div>
            <div className="dashboard-area__copy">
              <h3>{area.label}</h3>
              <p>{area.description}</p>
            </div>
            <p className="dashboard-question">{area.reflection}</p>
            <div className="dashboard-levels" role="group" aria-label={`How full does ${area.label.toLowerCase()} feel?`}>
              {dashboardLevels.map((level) => (
                <button
                  type="button"
                  key={level}
                  aria-pressed={scores[area.key] === level}
                  aria-label={`${area.label}: ${dashboardLevelLabels[level]}`}
                  onClick={() => updateScore(area.key, level)}
                >
                  {level}%
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="local-note">There is no ideal shape and no combined score. A low tank is information—an invitation to notice what may need care.</p>
    </div>
  );
}

function Viewfinder() {
  const [views, setViews] = useState<Views>({ life: "", work: "", coherence: "" });

  useEffect(() => {
    const saved = readStoredValue<Views>(storageKeys.views);
    if (!saved) return;
    const timer = window.setTimeout(() => setViews(saved), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateView(key: keyof typeof views, value: string) {
    const next = { ...views, [key]: value };
    setViews(next);
    writeStoredValue(storageKeys.views, next);
  }

  return (
    <div className="viewfinder">
      <div className="viewfinder__views">
        <article>
          <span className="view-number">01</span>
          <p className="eyebrow">Lifeview</p>
          <h3>What gives life meaning?</h3>
          <p className="view-prompt">Consider purpose, joy, connection, the world, and what you believe makes a life worth living.</p>
          <label htmlFor="lifeview">In a few sentences, what do you believe?</label>
          <textarea
            id="lifeview"
            rows={6}
            value={views.life}
            onChange={(event) => updateView("life", event.target.value)}
            placeholder="A meaningful life is one where…"
          />
        </article>
        <article>
          <span className="view-number">02</span>
          <p className="eyebrow">Workview</p>
          <h3>What is the purpose behind work?</h3>
          <p className="view-prompt">Consider contribution, growth, money, service, craft, and the role work should play in a full life.</p>
          <label htmlFor="workview">In a few sentences, what do you believe?</label>
          <textarea
            id="workview"
            rows={6}
            value={views.work}
            onChange={(event) => updateView("work", event.target.value)}
            placeholder="Good work allows me to…"
          />
        </article>
      </div>
      <div className="coherence-field">
        <div className="coherence-field__copy">
          <span className="view-number">03</span>
          <p className="eyebrow">Coherence</p>
          <label htmlFor="coherence">Where do your Lifeview and Workview reinforce each other—and where are they in tension?</label>
        </div>
        <div className="coherence-field__input">
          <textarea
            id="coherence"
            rows={6}
            value={views.coherence}
            onChange={(event) => updateView("coherence", event.target.value)}
            placeholder="I notice that…"
          />
        </div>
      </div>
      <p className="views-local-note">These views are drafts. Let them change as your life gives you new evidence.</p>
    </div>
  );
}

function EnergyCompass() {
  const [activity, setActivity] = useState("");
  const [energy, setEnergy] = useState(4);
  const [engagement, setEngagement] = useState(4);
  const [entries, setEntries] = useState<EnergyEntry[]>([]);

  useEffect(() => {
    const saved = readStoredValue<EnergyEntry[]>(storageKeys.energy);
    if (!saved) return;
    const timer = window.setTimeout(() => setEntries(saved), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function addEntry(event: FormEvent) {
    event.preventDefault();
    if (!activity.trim()) return;
    const next = [{ id: Date.now(), activity: activity.trim(), energy, engagement }, ...entries].slice(0, 5);
    setEntries(next);
    writeStoredValue(storageKeys.energy, next);
    setActivity("");
  }

  function deleteEntry(id: number) {
    const next = entries.filter((entry) => entry.id !== id);
    setEntries(next);
    writeStoredValue(storageKeys.energy, next);
  }

  return (
    <div className="energy-workbench">
      <form className="energy-form" onSubmit={addEntry}>
        <div className="field-group">
          <label htmlFor="activity">What did you just spend time doing?</label>
          <input
            id="activity"
            value={activity}
            onChange={(event) => setActivity(event.target.value)}
            placeholder="A team meeting, a long walk, making dinner…"
          />
        </div>

        <div className={`slider-group slider-group--${energy}`}>
          <div className="slider-label">
            <label htmlFor="energy">Energy</label>
            <output htmlFor="energy">{energyLabels[energy - 1]}</output>
          </div>
          <input
            id="energy"
            type="range"
            min="1"
            max="5"
            value={energy}
            onChange={(event) => setEnergy(Number(event.target.value))}
          />
          <div className="range-ends"><span>Drained</span><span>Energized</span></div>
        </div>

        <div className={`slider-group slider-group--${engagement}`}>
          <div className="slider-label">
            <label htmlFor="engagement">Engagement</label>
            <output htmlFor="engagement">{engagementLabels[engagement - 1]}</output>
          </div>
          <input
            id="engagement"
            type="range"
            min="1"
            max="5"
            value={engagement}
            onChange={(event) => setEngagement(Number(event.target.value))}
          />
          <div className="range-ends"><span>Distant</span><span>In flow</span></div>
        </div>

        <button className="button button--ink" type="submit" disabled={!activity.trim()}>
          Add this moment <Arrow />
        </button>
      </form>

      <div className="energy-log" aria-live="polite">
        <div className="energy-log__heading">
          <span>Your field notes</span>
          <span>{entries.length}/5</span>
        </div>
        {entries.length === 0 ? (
          <div className="empty-note">
            <Mark compact />
            <p>Add one ordinary moment. A pattern only needs a first dot.</p>
          </div>
        ) : (
          <ol>
            {entries.map((entry) => (
              <li key={entry.id}>
                <span className="energy-dots" aria-hidden="true">
                  <i className={`energy-dot energy-dot--${entry.energy}`} />
                  <i className={`energy-dot energy-dot--${entry.engagement}`} />
                </span>
                <span className="energy-entry">
                  <strong>{entry.activity}</strong>
                  <small>{energyLabels[entry.energy - 1]} · {engagementLabels[entry.engagement - 1]}</small>
                </span>
                <button
                  className="delete-note"
                  type="button"
                  aria-label={`Delete energy note for ${entry.activity}`}
                  onClick={() => deleteEntry(entry.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function OdysseyStudio() {
  const [paths, setPaths] = useState(starterPaths);
  const [activePath, setActivePath] = useState(0);

  useEffect(() => {
    const saved = readStoredValue<OdysseyPath[]>(storageKeys.odyssey);
    if (!saved) return;
    const timer = window.setTimeout(() => {
      setPaths(saved.map((path, index) => ({
        ...path,
        prompt: starterPaths[index]?.prompt ?? path.prompt,
        label: starterPaths[index]?.label ?? path.label,
        description: starterPaths[index]?.description ?? path.description,
        color: starterPaths[index]?.color ?? path.color,
      })));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updatePath(field: "title" | "detail", value: string) {
    const next = paths.map((path, index) => index === activePath ? { ...path, [field]: value } : path);
    setPaths(next);
    writeStoredValue(storageKeys.odyssey, next);
  }

  function selectAdjacentPath(index: number) {
    const nextIndex = (index + paths.length) % paths.length;
    setActivePath(nextIndex);
    window.requestAnimationFrame(() => {
      document.getElementById(`odyssey-tab-${nextIndex}`)?.focus();
    });
  }

  return (
    <div className="odyssey-studio">
      <div className="path-tabs" role="tablist" aria-label="Odyssey paths">
        {paths.map((path, index) => (
          <button
            key={path.label}
            id={`odyssey-tab-${index}`}
            role="tab"
            aria-selected={activePath === index}
            aria-controls={`odyssey-panel-${index}`}
            tabIndex={activePath === index ? 0 : -1}
            className={`path-tab path-tab--${path.color}`}
            onClick={() => setActivePath(index)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                selectAdjacentPath(activePath + 1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                selectAdjacentPath(activePath - 1);
              }
              if (event.key === "Home") {
                event.preventDefault();
                selectAdjacentPath(0);
              }
              if (event.key === "End") {
                event.preventDefault();
                selectAdjacentPath(paths.length - 1);
              }
            }}
          >
            {path.label}
          </button>
        ))}
      </div>

      <div
        id={`odyssey-panel-${activePath}`}
        className={`path-canvas path-canvas--${paths[activePath].color}`}
        role="tabpanel"
        aria-labelledby={`odyssey-tab-${activePath}`}
      >
        <div className="path-canvas__prompt">
          <span>{paths[activePath].prompt}</span>
          <p>{paths[activePath].description}</p>
        </div>
        <div className="path-line" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
        <div className="path-fields">
          <div className="field-group">
            <label htmlFor="path-title">Six-word title</label>
            <input
              id="path-title"
              value={paths[activePath].title}
              onChange={(event) => updatePath("title", event.target.value)}
            />
          </div>
          <div className="field-group">
            <label htmlFor="path-detail">What questions does this life raise?</label>
            <input
              id="path-detail"
              value={paths[activePath].detail}
              onChange={(event) => updatePath("detail", event.target.value)}
            />
          </div>
        </div>
      </div>
      <p className="local-note">Your notes stay on this device. No account, no cloud, no audience.</p>
    </div>
  );
}

function downloadReflectionNotes() {
  const dashboard = readStoredValue<DashboardScores>(storageKeys.dashboard);
  const views = readStoredValue<Views>(storageKeys.views);
  const energy = readStoredValue<EnergyEntry[]>(storageKeys.energy) ?? [];
  const paths = readStoredValue<OdysseyPath[]>(storageKeys.odyssey) ?? starterPaths;
  const reflections = readStoredValue<string[]>(storageKeys.reflections) ?? Array(questions.length).fill("");
  const nextStep = readStoredValue<string>(storageKeys.nextStep) ?? "";

  const lines = [
    "LIFE BY DESIGN — PERSONAL FIELD NOTES",
    `Saved ${new Date().toLocaleDateString(undefined, { dateStyle: "long" })}`,
    "",
    "LIFE DESIGN DASHBOARD",
    ...dashboardAreas.map((area) => {
      const score = dashboard?.[area.key];
      return `${area.label}: ${score === null || score === undefined ? "Not answered" : `${score}% full`}`;
    }),
    "",
    "LIFEVIEW",
    views?.life || "Not answered",
    "",
    "WORKVIEW",
    views?.work || "Not answered",
    "",
    "COHERENCE",
    views?.coherence || "Not answered",
    "",
    "ENERGY FIELD NOTES",
    ...(energy.length
      ? energy.map((entry) => `• ${entry.activity} — ${energyLabels[entry.energy - 1]}, ${engagementLabels[entry.engagement - 1]}`)
      : ["No moments recorded"]),
    "",
    "THREE ODYSSEY PATHS",
    ...paths.flatMap((path, index) => [
      `${index + 1}. ${path.title || "Untitled path"}`,
      path.detail || "No note yet",
      "",
    ]),
    "EIGHT REFLECTIONS",
    ...questions.flatMap((question, index) => [
      `${index + 1}. ${question}`,
      reflections[index]?.trim() || "Not answered",
      "",
    ]),
    "ONE SMALL NEXT STEP",
    nextStep || "Not answered",
    "",
    "Inspired by Designing Your Life by Bill Burnett and Dave Evans.",
    "Independent educational companion; not affiliated with the authors or publisher.",
  ];

  const file = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "life-by-design-field-notes.txt";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function NextStep() {
  const [nextStep, setNextStep] = useState("");

  useEffect(() => {
    const saved = readStoredValue<string>(storageKeys.nextStep);
    if (!saved) return;
    const timer = window.setTimeout(() => setNextStep(saved), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateNextStep(value: string) {
    setNextStep(value);
    writeStoredValue(storageKeys.nextStep, value);
  }

  return (
    <div className="next-step">
      <label htmlFor="next-step">Name one conversation or small experiment.</label>
      <p>Keep it specific enough to try, and small enough to begin this week.</p>
      <textarea
        id="next-step"
        rows={3}
        value={nextStep}
        onChange={(event) => updateNextStep(event.target.value)}
        placeholder="I’ll ask Maya to walk by the lake and talk about…"
      />
      <p className="save-state" role="status">Saved in this browser as you type.</p>
    </div>
  );
}

function LocalDataControls() {
  const [confirmClear, setConfirmClear] = useState(false);
  const [message, setMessage] = useState("");

  function clearNotes() {
    try {
      Object.values(storageKeys).forEach((key) => window.localStorage.removeItem(key));
    } catch {
      setMessage("This browser did not allow the saved notes to be cleared.");
      return;
    }
    setMessage("Your notes have been cleared.");
    setConfirmClear(false);
    window.setTimeout(() => window.location.reload(), 500);
  }

  return (
    <div className="local-data-controls">
      <div>
        <p className="eyebrow">Your notes, your device</p>
        <p>Nothing is sent to an account or server. Download a copy before moving to another device.</p>
      </div>
      <div className="local-data-controls__actions">
        <button
          className="button button--ink"
          type="button"
          onClick={() => {
            downloadReflectionNotes();
            setMessage("Your field notes download has started.");
          }}
        >
          Download my field notes
        </button>
        {confirmClear ? (
          <>
            <button className="text-button text-button--danger" type="button" onClick={clearNotes}>
              Yes, clear everything
            </button>
            <button className="text-button" type="button" onClick={() => setConfirmClear(false)}>
              Keep my notes
            </button>
          </>
        ) : (
          <button className="text-button" type="button" onClick={() => setConfirmClear(true)}>
            Clear my notes
          </button>
        )}
      </div>
      <p className="visually-hidden" aria-live="polite">{message}</p>
    </div>
  );
}

function ReflectionJourney() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const saved = readStoredValue<string[]>(storageKeys.reflections);
    if (!saved) return;
    const timer = window.setTimeout(() => setAnswers(saved), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const answered = useMemo(() => answers.filter((answer) => answer.trim()).length, [answers]);

  function updateAnswer(value: string) {
    const next = answers.map((answer, index) => index === current ? value : answer);
    setAnswers(next);
    writeStoredValue(storageKeys.reflections, next);
  }

  if (complete) {
    return (
      <div className="reflection-complete">
        <div className="completion-mark"><Mark /></div>
        <p className="eyebrow">A beginning, not a verdict</p>
        <h3>You have more clues than you did eight questions ago.</h3>
        <p>
          Read your answers for energy, surprise, and repetition. Then choose one small conversation or experiment—not a life-changing decision.
        </p>
        <details className="reflection-recap">
          <summary>Review my eight notes</summary>
          <ol>
            {questions.map((question, index) => (
              <li key={question}>
                <strong>{question}</strong>
                <p>{answers[index].trim() || "Skipped for now"}</p>
              </li>
            ))}
          </ol>
        </details>
        <div className="completion-actions">
          <button className="button button--ink" onClick={downloadReflectionNotes}>Download my field notes</button>
          <button className="text-button" onClick={() => { setComplete(false); setCurrent(0); }}>Review my answers</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reflection-shell">
      <div className="reflection-progress" aria-label={`${answered} of ${questions.length} questions answered`}>
        <div className="reflection-progress__meta">
          <span>Question {current + 1} of {questions.length}</span>
          <span>{answered} answered</span>
        </div>
        <div className="reflection-progress__track">
          <span style={{ transform: `scaleX(${(current + 1) / questions.length})` }} />
        </div>
      </div>

      <div className="question-stage">
        <span className="question-number">0{current + 1}</span>
        <label htmlFor="reflection-answer">{questions[current]}</label>
        <textarea
          id="reflection-answer"
          value={answers[current]}
          onChange={(event) => updateAnswer(event.target.value)}
          rows={5}
          placeholder="Start with whatever comes to mind…"
        />
      </div>

      <div className="question-actions">
        <button className="text-button" onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}>
          Back
        </button>
        <span>{answers[current].trim() ? "Saved" : "Skipping is okay"}</span>
        {current < questions.length - 1 ? (
          <button className="button button--sun" onClick={() => setCurrent(current + 1)}>
            Next question <Arrow />
          </button>
        ) : (
          <button className="button button--sun" onClick={() => setComplete(true)}>
            See what’s next <Arrow />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="main-content">
      <a className="skip-link" href="#framework">Skip to the framework</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Life by Design, home">
          <Mark compact />
          <span>Life by Design</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#framework">Learn</a>
          <a href="#dashboard">Take stock</a>
          <a href="#odyssey">Imagine</a>
          <a href="#reflect">Reflect</a>
        </nav>
        <a className="header-cta" href="#reflect"><span>10-minute </span>reflection</a>
      </header>

      <section className="hero" id="top">
        <div className="hero__copy">
          <p className="eyebrow">A field guide for the life you’re living</p>
          <h1>A full life isn’t found.<br /><em>It’s designed.</em></h1>
          <p className="hero__lede">
            Notice what gives you energy, imagine more than one future, and take one small step toward a life that feels like yours.
          </p>
          <div className="hero__actions">
            <a className="button button--sun" href="#reflect">Begin the reflection <Arrow /></a>
            <a className="text-link" href="#framework">Explore the ideas <Arrow direction="down" /></a>
          </div>
          <p className="hero__credit">An independent learning experience inspired by the work of Bill Burnett and Dave Evans.</p>
        </div>
        <Landscape />
      </section>

      <JourneyGuide />

      <section className="section framework" id="framework">
        <div className="section-intro">
          <p className="eyebrow">The five designer mindsets</p>
          <h2>You do not need the answer.<br />You need a better way to explore.</h2>
          <p>
            The book introduces five canonical mindsets for applying design thinking to life: Curiosity, Bias to Action, Reframing, Awareness, and Radical Collaboration.
          </p>
        </div>
        <div className="principles">
          {principles.map((principle, index) => (
            <article key={principle.number} style={{ "--i": index } as React.CSSProperties}>
              <span>{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section dashboard" id="dashboard">
        <div className="section-intro section-intro--split">
          <div>
            <p className="eyebrow">The life design dashboard</p>
            <h2>How full does<br />each part feel?</h2>
          </div>
          <p>
            Picture four simple gas gauges. Mark Health, Work, Play, and Love as empty, one-quarter, half, three-quarters, or full.
          </p>
        </div>
        <LifeDashboard />
      </section>

      <section className="section section--pine" id="views">
        <div className="section-intro section-intro--split">
          <div>
            <p className="eyebrow">Lifeview + Workview</p>
            <h2>Name what you believe.<br />Then look for coherence.</h2>
          </div>
          <p>
            Your Lifeview describes what makes life meaningful. Your Workview describes why work matters. Seeing both on the same page can reveal alignment, friction, and useful questions.
          </p>
        </div>
        <Viewfinder />
      </section>

      <section className="section section--lake" id="energy">
        <div className="section-intro section-intro--split">
          <div>
            <p className="eyebrow">The energy compass</p>
            <h2>Let your days leave clues.</h2>
          </div>
          <p>
            Track engagement and energy—not whether an activity sounds impressive. Over time, the moments that light you up become raw material for better choices.
          </p>
        </div>
        <EnergyCompass />
      </section>

      <section className="section odyssey" id="odyssey">
        <div className="section-intro section-intro--split">
          <div>
            <p className="eyebrow">The Odyssey Plan</p>
            <h2>Imagine three different futures.</h2>
          </div>
          <p>
            Give each life a six-word title and note what you would want to learn about it. You are generating options, not choosing one.
          </p>
        </div>
        <OdysseyStudio />
      </section>

      <section className="section section--night" id="reflect">
        <div className="reflection-intro">
          <p className="eyebrow">A quiet workshop</p>
          <h2>Eight questions.<br />No perfect answers.</h2>
          <p>Give yourself ten unrushed minutes. Your words are saved only in this browser.</p>
        </div>
        <ReflectionJourney />
      </section>

      <section className="closing">
        <div className="closing__dots"><Mark /></div>
        <p className="eyebrow">Keep prototyping</p>
        <h2>What is one conversation your future self would be glad you started?</h2>
        <NextStep />
        <LocalDataControls />
      </section>

      <footer>
        <div className="wordmark"><Mark compact /><span>Life by Design</span></div>
        <p>
          Inspired by <cite>Designing Your Life</cite> by Bill Burnett and Dave Evans. This independent educational experience is not affiliated with the authors or publisher.
        </p>
        <a href="#top">Back to the horizon ↑</a>
      </footer>
    </main>
  );
}
