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
  if (REAL_API) {
    const res = await fetch("/api/events");
    return res.json();
  }
  return mockEvents;
}

export async function getEvent(id) {
  if (REAL_API) {
    const res = await fetch(`/api/events/${id}`);
    return res.json();
  }
  return mockEvents.find(e => e.id === Number(id));
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
  const event = mockEvents.find(e => e.id === Number(eventId));
  return event ? event.participants : [];
}


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
