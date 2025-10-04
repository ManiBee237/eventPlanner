// src/api.js
// Mock API with 100 sample events

import { faker } from '@faker-js/faker';

// toggle this when backend is ready
const REAL_API = false;

let mockEvents = [];

// Generate 100 mock events
function generateMockEvents(n = 100) {
  const categories = ["Tech", "Education", "Music", "Art", "Health", "Sports", "Business", "AI", "Community"];
  const tagsList = ["AI", "Machine Learning", "Networking", "Workshop", "Concert", "Webinar", "Conference", "Hackathon"];

  let events = [];
  for (let i = 0; i < n; i++) {
    events.push({
      id: i + 1,
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      date: faker.date.future().toISOString(),
      location: faker.location.city(),
      organizer: faker.company.name(),
      category: faker.helpers.arrayElement(categories),
      tags: faker.helpers.arrayElements(tagsList, faker.number.int({ min: 2, max: 4 })),
      participants: Array.from({ length: faker.number.int({ min: 10, max: 100 }) }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
      })),
    });
  }
  return events;
}

// Initialize data
mockEvents = generateMockEvents(100);

// ---------------------------- API FUNCTIONS ----------------------------

export async function listEvents() {
  try {
    const res = await fetch(`${API}/api/events`, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // ensure each event has an id
    return (Array.isArray(data) ? data : []).map((e, i) => ({
      ...e,
      _id: e._id || e.id || String(i + 1),
    }));
  } catch (err) {
    console.warn("listEvents() failed, using MOCK_EVENTS:", err?.message || err);
    return MOCK_EVENTS;
  }
}

export async function getEvent(id) {
  if (!id) return undefined;
  const all = await listEvents();
  return all.find(e => (e._id || e.id) === id);
}

export async function createEvent(data) {
  if (REAL_API) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  const newEvent = { id: mockEvents.length + 1, ...data };
  mockEvents.push(newEvent);
  return newEvent;
}

export async function getRecommendations() {
  if (REAL_API) {
    const res = await fetch("/api/recommendations");
    return res.json();
  }
  return faker.helpers.shuffle(mockEvents).slice(0, 5);
}

export async function getParticipants(eventId) {
  // Optional; keep if Dashboard/Admin uses it. Provide safe fallback.
  try {
    const res = await fetch(`${API}/api/events/${eventId}/participants`, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return [];
  }
}

export const MOCK_EVENTS = [
  {
    _id: "e1",
    title: "GenAI for Product Managers",
    description: "Hands-on strategies to ship AI features responsibly.",
    date: new Date(Date.now() + 86400000).toISOString(), // +1 day
    venue: "Auditorium A",
    category: "Seminar",
    tags: ["AI", "PM", "Strategy"],
  },
  {
    _id: "e2",
    title: "Full-Stack Workshop: React + Node",
    description: "Build a production-ready stack with best practices.",
    date: new Date(Date.now() + 2 * 86400000).toISOString(),
    venue: "Lab 2",
    category: "Workshop",
    tags: ["React", "Node", "API"],
  },
  {
    _id: "e3",
    title: "UX Micro-Interactions Fest",
    description: "Design delightful, subtle interactions that sing.",
    date: new Date(Date.now() + 3 * 86400000).toISOString(),
    venue: "Design Hall",
    category: "Fest",
    tags: ["UX", "Motion", "Figma"],
  },
  {
    _id: "e4",
    title: "Data Viz Night",
    description: "Tell better stories with charts and dashboards.",
    date: new Date(Date.now() + 4 * 86400000).toISOString(),
    venue: "Studio 4",
    category: "Seminar",
    tags: ["D3", "Charts", "Story"],
  },
  {
    _id: "e5",
    title: "Startup Networking",
    description: "Founders, builders, and investors meet & mingle.",
    date: new Date(Date.now() + 5 * 86400000).toISOString(),
    venue: "Cafe Commons",
    category: "Networking",
    tags: ["Founders", "Pitch", "VC"],
  },
  {
    _id: "e6",
    title: "Prompt Engineering 101",
    description: "Level up your prompts for reliable outcomes.",
    date: new Date(Date.now() + 6 * 86400000).toISOString(),
    venue: "Room 12",
    category: "Workshop",
    tags: ["AI", "Prompts", "LLM"],
  },
];


let mockUsers = [];

/**
 * Mock register API - always succeeds
 */
export async function registerUser(data) {
  // create fake user
  const newUser = {
    id: mockUsers.length + 1,
    name: data.name || "Guest User",
    email: data.email || `user${mockUsers.length + 1}@example.com`,
  };

  mockUsers.push(newUser);

  return {
    success: true,
    message: "Registration successful 🎉",
    user: newUser,
  };
}
