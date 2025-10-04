// Toggle this to hit your real backend via the Vite proxy (/api/*)
const REAL_API = false

const BASE = REAL_API ? '/api' : null

const delay = (ms) => new Promise(r => setTimeout(r, ms))

// ------- REAL endpoints -------
async function realGet(url, options){
  const r = await fetch(url, options)
  if(!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

// ------- MOCK data (frontend-only demo) -------
const mockEvents = [
  { _id:'1', title:'AI Seminar', description:'Intro to ML & GenAI', date:new Date(Date.now()+86400000).toISOString(), venue:'Auditorium A', category:'Seminar', tags:['ai','ml'] },
  { _id:'2', title:'Frontend Fest', description:'Vite + Tailwind crash course', date:new Date(Date.now()+2*86400000).toISOString(), venue:'Main Lawn', category:'Fest', tags:['frontend','tailwind'] },
  { _id:'3', title:'Node Workshop', description:'Express APIs from zero to hero', date:new Date(Date.now()+3*86400000).toISOString(), venue:'Lab 2', category:'Workshop', tags:['node','api'] },
  { _id:'4', title:'Marketing 101', description:'Branding & growth tactics', date:new Date(Date.now()+5*86400000).toISOString(), venue:'Hall C', category:'Seminar', tags:['marketing'] },
  { _id:'5', title:'Hack Night', description:'Build, pizza, demos', date:new Date(Date.now()+7*86400000).toISOString(), venue:'Innovation Hub', category:'Networking', tags:['hack','startup'] },
]

export async function listEvents(){
  if(REAL_API) return realGet(`${BASE}/events`)
  await delay(300)
  return mockEvents
}

export async function getEvent(id){
  if(REAL_API) return realGet(`${BASE}/events/${id}`)
  await delay(200)
  const ev = mockEvents.find(e => e._id === id)
  if(!ev) throw new Error('Event not found')
  return ev
}

export async function registerUser(payload){
  if(REAL_API){
    return realGet(`${BASE}/registrations`, {
      method:'POST', headers:{'content-type':'application/json'},
      body: JSON.stringify(payload)
    })
  }
  await delay(400)
  return { registrationId: crypto.randomUUID(), userId: payload.email || 'user123' }
}

export async function getParticipants(eventId){
  if(REAL_API) return realGet(`${BASE}/admin/participants/${eventId}`)
  await delay(250)
  return [
    { _id:'p1', user:{ name:'Aarav', email:'aarav@example.com', interests:['ai','ml'] }, createdAt:new Date().toISOString() },
    { _id:'p2', user:{ name:'Isha', email:'isha@example.com', interests:['frontend'] }, createdAt:new Date().toISOString() },
  ]
}

export async function getRecommendations(userId){
  if(REAL_API) return realGet(`${BASE}/events/recommend/${userId}`)
  await delay(350)
  return mockEvents.slice(1, 4)
}
