import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";

const problemCategories = [
  { title: "Personal", items: ["Mental health", "Substance abuse", "Legal support", "Education access", "Discrimination"] },
  { title: "Community", items: ["Neighborhood safety", "Homelessness", "Public transportation", "Water quality"] },
  { title: "Business", items: ["Licensing", "Tax issues", "Workforce development", "Local supply chains"] },
  { title: "Education", items: ["Curriculum issues", "Bullying", "Tuition policy", "Resource equity"] },
  { title: "State", items: ["Healthcare policy", "Environmental regulation", "Unemployment services"] },
  { title: "Federal", items: ["Immigration", "National health", "Civil rights", "Disaster response"] },
  { title: "Global", items: ["Climate change", "Human trafficking", "Digital rights"] }
];

const tiers = [
  "Tier 1 – Individual/Local",
  "Tier 2 – Community/Group",
  "Tier 3 – District/City",
  "Tier 4 – Statewide",
  "Tier 5 – National/Federal",
  "Tier 6 – Global Collaboration"
];

const problems = [
  {
    title: "Local Water Contamination",
    description: "Discolored and unsafe drinking water in the Riverdale area. No action taken yet.",
    votes: 1203
  },
  {
    title: "Unemployment Office Delays",
    description: "Applications pending for over 8 weeks in several counties.",
    votes: 892
  }
];

function getTier(votes) {
  if (votes >= 5000) return 6;
  if (votes >= 3000) return 5;
  if (votes >= 1500) return 4;
  if (votes >= 800) return 3;
  if (votes >= 300) return 2;
  return 1;
}

export default function Home() {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (title) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">🌐 Problem Solver</h1>
        <input type="text" placeholder="Search problems..." className="px-3 py-1 border rounded w-1/3" />
        <div className="flex gap-4 items-center">
          <span className="font-medium">Hi, User</span>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <aside className="col-span-1 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            <ul className="space-y-2">
              {problemCategories.map((cat) => (
                <li key={cat.title}>
                  <button
                    onClick={() => toggleCategory(cat.title)}
                    className="w-full text-left font-medium text-blue-700 hover:underline"
                  >
                    {cat.title}
                  </button>
                  {expandedCategories[cat.title] && (
                    <ul className="ml-4 mt-1 list-disc text-sm text-gray-700">
                      {cat.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <button className="w-full bg-green-500 text-white py-2 rounded">Submit a Problem</button>
          </div>
        </aside>

        {/* Center Feed */}
        <main className="col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Featured Problems</h2>
          {problems.map((problem, idx) => {
            const tier = getTier(problem.votes);
            return (
              <div key={idx} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">{problem.title}</h3>
                <p className="text-gray-600 mb-2">{problem.description}</p>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 px-4 py-2 border rounded">
                    <ThumbsUp size={18} /> Join Problem ({problem.votes})
                  </button>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tiers[tier - 1]}
                  </span>
                </div>
              </div>
            );
          })}
        </main>

        {/* Right Sidebar */}
        <aside className="col-span-1 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Trending Problems</h2>
            <ul className="list-disc list-inside">
              <li>Housing Affordability Crisis</li>
              <li>Education Funding Gap</li>
              <li>Veteran Mental Health</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Tier System</h2>
            <ul className="list-decimal list-inside">
              {tiers.map((tier, i) => (
                <li key={i}>{tier}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
