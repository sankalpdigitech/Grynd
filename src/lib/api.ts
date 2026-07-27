import { User, Profile, RequestPost, Pitch, Rating } from '../types.js';

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

// Simple mocked headers to simulate logged in user
let currentUser: string | null = localStorage.getItem('mock_user_id') || null;

export const setCurrentUser = (userId: string | null) => {
  currentUser = userId;
  if (userId) {
    localStorage.setItem('mock_user_id', userId);
  } else {
    localStorage.removeItem('mock_user_id');
  }
};

export const getCurrentUser = () => currentUser;

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth / User
  getMe: async (): Promise<User> => {
    await delay();
    if (!currentUser) throw new Error('Unauthorized');
    const user = users.find(u => u.id === currentUser);
    if (!user) throw new Error('User not found');
    return user;
  },
  
  register: async (data: Partial<User>): Promise<User> => {
    await delay();
    const newUser: User = {
      id: generateId(),
      name: data.name!,
      phone: data.phone!,
      email: data.email!,
      school: data.school!,
      status: 'PENDING',
      role: data.role!
    };
    users.push(newUser);
    return newUser;
  },

  // Profiles
  getProfiles: async (): Promise<(Profile & { user?: User })[]> => {
    await delay();
    const enrichedProfiles = profiles.map(p => {
      const user = users.find(u => u.id === p.userId);
      return { ...p, user };
    }).filter(p => p.user?.status === 'VERIFIED');
    return enrichedProfiles;
  },
  
  getProfile: async (userId: string): Promise<Profile> => {
    await delay();
    const profile = profiles.find(p => p.userId === userId);
    if (profile) return profile;
    throw new Error('Profile not found');
  },
  
  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    await delay();
    if (!currentUser) throw new Error('Unauthorized');

    const newProfile: Profile = {
      id: generateId(),
      userId: currentUser,
      ...data as Profile
    };
    
    // Update or create
    const existingIndex = profiles.findIndex(p => p.userId === currentUser);
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...data };
      return profiles[existingIndex];
    } else {
      profiles.push(newProfile);
      return newProfile;
    }
  },

  // Requests
  getRequests: async (): Promise<(RequestPost & { client?: User })[]> => {
    await delay();
    const enrichedRequests = requests.map(r => {
      const client = users.find(u => u.id === r.clientId);
      return { ...r, client };
    });
    return enrichedRequests;
  },
  
  createRequest: async (data: Partial<RequestPost>): Promise<RequestPost> => {
    await delay();
    if (!currentUser) throw new Error('Unauthorized');

    const newRequest: RequestPost = {
      id: generateId(),
      clientId: currentUser,
      ...data as RequestPost,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    return newRequest;
  },
  
  updateRequest: async (id: string, data: Partial<RequestPost>): Promise<RequestPost> => {
    await delay();
    if (!currentUser) throw new Error('Unauthorized');
    
    const requestIndex = requests.findIndex(r => r.id === id);
    if (requestIndex === -1) throw new Error('Not found');
    
    if (requests[requestIndex].clientId !== currentUser) throw new Error('Forbidden');
    
    requests[requestIndex] = { ...requests[requestIndex], ...data };
    return requests[requestIndex];
  },

  // Pitches
  getPitches: async (requestId: string): Promise<(Pitch & { freelancer?: User, profile?: Profile })[]> => {
    await delay();
    const requestPitches = pitches.filter(p => p.requestId === requestId);
    
    const enriched = requestPitches.map(p => {
      const freelancer = users.find(u => u.id === p.freelancerId);
      const profile = profiles.find(pr => pr.userId === p.freelancerId);
      return { ...p, freelancer, profile };
    });
    
    return enriched;
  },
  
  createPitch: async (requestId: string, data: Partial<Pitch>): Promise<Pitch> => {
    await delay();
    if (!currentUser) throw new Error('Unauthorized');

    const newPitch: Pitch = {
      id: generateId(),
      requestId: requestId,
      freelancerId: currentUser,
      ...data as Pitch,
      createdAt: new Date().toISOString()
    };
    pitches.push(newPitch);
    return newPitch;
  }
};
