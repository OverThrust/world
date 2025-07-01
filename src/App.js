import React from "react";
import { ThumbsUp } from "lucide-react";

const problemCategories = [
  {
    title: "Personal",
    items: ["Mental health", "Substance abuse", "Legal support", "Education access", "Discrimination"]
  },
  {
    title: "Community",
    items: ["Neighborhood safety", "Homelessness", "Public transportation", "Water quality"]
  },
  {
    title: "Business",
    items: ["Licensing", "Tax issues", "Workforce development", "Local supply chains"]
  },
  {
    title: "Education",
    items: ["Curriculum issues", "Bullying", "Tuition policy", "Resource equity"]
  },
  {
    title: "State",
    items: ["Healthcare policy", "Environmental regulation", "Unemployment services"]
  },
  {
    title: "Federal",
    items: ["Immigration", "National health", "Civil rights", "Disaster response"]
  },
  {
    title: "Global",
    items: ["Climate change", "Human trafficking", "Digital rights"]
  }
];

const tiers = [
  "Tier 1 – Individual/Local",
  "Tier 2 – Community/Group",
  "Tier 3 – District/City",
  "Tier 4 – Statewide",
  "Tier 5 – National/Federal",
  "Tier 6 – Global Collaboration"
];

function App() {
  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
        🌐 Society Problem Solver
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        A platform to submit, categorize, and escalate problems from personal to global level. Join a problem to show it matters.
      </p>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem" }}>🗂️ Categories</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
          {problemCategories.map((cat) => (
            <div key={cat.title} style={{ border: "1px solid #dee2e6", padding: "1rem", borderRadius: "0.5rem", background: "#fff" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>{cat.title}</h3>
              <ul>
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem" }}>📊 Problem Tier System</h2>
        <ul>
          {tiers.map((tier, i) => (
            <li key={i}>{tier}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1rem" }}>🔥 Featured Problem</h2>
        <div style={{ border: "1px solid #dee2e6", padding: "1rem", borderRadius: "0.5rem", background: "#fff" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Local Water Contamination</h3>
          <p style={{ marginBottom: "1rem" }}>
            Residents have reported discolored and unsafe drinking water in the Riverdale area. No action taken yet by the local council.
          </p>
          <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #333", padding: "0.5rem 1rem", borderRadius: "0.25rem", background: "#f1f3f5" }}>
            <ThumbsUp size={18} /> Join Problem (1,203)
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
