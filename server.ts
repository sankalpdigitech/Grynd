import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { User, Profile, RequestPost, Pitch, Rating } from './src/types.js';

// In-memory data store for MVP
let users: User[] = [
  {
    id: 'u1',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@du.ac.in',
    school: 'Delhi University',
    status: 'VERIFIED',
    role: 'CLIENT'
  },
  {
    id: 'u2',
    name: 'Priya Patel',
    phone: '9876543211',
    email: 'priya@jnu.ac.in',
    school: 'JNU',
    status: 'VERIFIED',
    role: 'FREELANCER'
  }
];

let profiles: Profile[] = [
  {
    id: 'p1',
    userId: 'u2',
    skills: ['Graphic Design', 'Video Editing'],
    portfolioLinks: ['https://behance.net/priya'],
    bio: 'Experienced in making fest posters and aesthetic reels.',
    availability: 'Evenings and Weekends',
    priceRange: '₹500 - ₹2000'
  }
];

let requests: RequestPost[] = [
  {
    id: 'r1',
    clientId: 'u1',
    title: 'Need a reel editor for college fest',
    description: 'Looking for someone to edit a 30s recap reel for our tech fest. Raw footage will be provided.',
    skillCategory: 'Video Editing',
    budget: '₹1000 - ₹1500',
    deadline: 'Next Friday',
    status: 'OPEN',
    createdAt: new Date().toISOString()
  }
];

let pitches: Pitch[] = [];
let ratings: Rating[] = [];

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Auth/User
  app.get('/api/users/me', (req, res) => {
    // Mock authenticated user (would use real auth in production)
    // We'll use a specific user for demonstration purposes, or allow the frontend to specify via header
    const userId = req.headers['x-user-id'] as string || 'u1';
    const user = users.find(u => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, phone, email, school, role } = req.body;
    const newUser: User = {
      id: generateId(),
      name,
      phone,
      email,
      school,
      status: 'PENDING',
      role
    };
    users.push(newUser);
    res.status(201).json(newUser);
  });

  // Profiles
  app.get('/api/profiles', (req, res) => {
    // Join profile with user data
    const enrichedProfiles = profiles.map(p => {
      const user = users.find(u => u.id === p.userId);
      return { ...p, user };
    }).filter(p => p.user?.status === 'VERIFIED');
    res.json(enrichedProfiles);
  });

  app.get('/api/profiles/:userId', (req, res) => {
    const profile = profiles.find(p => p.userId === req.params.userId);
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  });

  app.post('/api/profiles', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const newProfile: Profile = {
      id: generateId(),
      userId,
      ...req.body
    };
    
    // Update or create
    const existingIndex = profiles.findIndex(p => p.userId === userId);
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...req.body };
      res.json(profiles[existingIndex]);
    } else {
      profiles.push(newProfile);
      res.status(201).json(newProfile);
    }
  });

  // Requests
  app.get('/api/requests', (req, res) => {
    // Enrich requests with client info
    const enrichedRequests = requests.map(r => {
      const client = users.find(u => u.id === r.clientId);
      return { ...r, client };
    });
    res.json(enrichedRequests);
  });

  app.post('/api/requests', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const newRequest: RequestPost = {
      id: generateId(),
      clientId: userId,
      ...req.body,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    res.status(201).json(newRequest);
  });
  
  app.patch('/api/requests/:id', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const requestIndex = requests.findIndex(r => r.id === req.params.id);
    if (requestIndex === -1) return res.status(404).json({ error: 'Not found' });
    
    // Authorization check
    if (requests[requestIndex].clientId !== userId) return res.status(403).json({ error: 'Forbidden' });
    
    requests[requestIndex] = { ...requests[requestIndex], ...req.body };
    res.json(requests[requestIndex]);
  });

  // Pitches
  app.get('/api/requests/:id/pitches', (req, res) => {
    const requestPitches = pitches.filter(p => p.requestId === req.params.id);
    
    // Enrich with freelancer profiles and users
    const enriched = requestPitches.map(p => {
      const freelancer = users.find(u => u.id === p.freelancerId);
      const profile = profiles.find(pr => pr.userId === p.freelancerId);
      return { ...p, freelancer, profile };
    });
    
    res.json(enriched);
  });

  app.post('/api/requests/:id/pitches', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const newPitch: Pitch = {
      id: generateId(),
      requestId: req.params.id,
      freelancerId: userId,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    pitches.push(newPitch);
    res.status(201).json(newPitch);
  });

  // Ratings
  app.post('/api/requests/:id/ratings', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const request = requests.find(r => r.id === req.params.id);
    if (!request || request.status !== 'COMPLETED') return res.status(400).json({ error: 'Invalid request' });

    const newRating: Rating = {
      id: generateId(),
      requestId: req.params.id,
      clientId: request.clientId,
      freelancerId: request.selectedFreelancerId!,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    ratings.push(newRating);
    res.status(201).json(newRating);
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
