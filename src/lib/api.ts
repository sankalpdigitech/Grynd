import { User, Profile, RequestPost, Pitch, Rating } from '../types.js';

// Simple mocked headers to simulate logged in user
// We'll expose a way to change this for testing
let currentUser: string | null = localStorage.getItem('mock_user_id');

export const setCurrentUser = (userId: string | null) => {
  currentUser = userId;
  if (userId) {
    localStorage.setItem('mock_user_id', userId);
  } else {
    localStorage.removeItem('mock_user_id');
  }
};

export const getCurrentUser = () => currentUser;

const headers = () => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (currentUser) {
    h['x-user-id'] = currentUser;
  }
  return h;
};

export const api = {
  // Auth / User
  getMe: async (): Promise<User> => {
    const res = await fetch('/api/users/me', { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },
  
  register: async (data: Partial<User>): Promise<User> => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to register');
    return res.json();
  },

  // Profiles
  getProfiles: async (): Promise<(Profile & { user?: User })[]> => {
    const res = await fetch('/api/profiles', { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch profiles');
    return res.json();
  },
  
  getProfile: async (userId: string): Promise<Profile> => {
    const res = await fetch(`/api/profiles/${userId}`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
  
  updateProfile: async (data: Partial<Profile>): Promise<Profile> => {
    const res = await fetch('/api/profiles', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Requests
  getRequests: async (): Promise<(RequestPost & { client?: User })[]> => {
    const res = await fetch('/api/requests', { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },
  
  createRequest: async (data: Partial<RequestPost>): Promise<RequestPost> => {
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create request');
    return res.json();
  },
  
  updateRequest: async (id: string, data: Partial<RequestPost>): Promise<RequestPost> => {
    const res = await fetch(`/api/requests/${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update request');
    return res.json();
  },

  // Pitches
  getPitches: async (requestId: string): Promise<(Pitch & { freelancer?: User, profile?: Profile })[]> => {
    const res = await fetch(`/api/requests/${requestId}/pitches`, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch pitches');
    return res.json();
  },
  
  createPitch: async (requestId: string, data: Partial<Pitch>): Promise<Pitch> => {
    const res = await fetch(`/api/requests/${requestId}/pitches`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit pitch');
    return res.json();
  }
};
