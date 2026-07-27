export type UserRole = 'FREELANCER' | 'CLIENT' | 'BOTH';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  school: string;
  status: 'PENDING' | 'VERIFIED';
  role: UserRole;
}

export interface Profile {
  id: string;
  userId: string;
  skills: string[];
  portfolioLinks: string[];
  bio: string;
  availability: string;
  priceRange: string;
}

export interface RequestPost {
  id: string;
  clientId: string;
  title: string;
  description: string;
  skillCategory: string;
  budget: string;
  deadline: string;
  referenceLink?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  selectedFreelancerId?: string;
}

export interface Pitch {
  id: string;
  requestId: string;
  freelancerId: string;
  message: string;
  proposedPrice: string;
  timeline: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  requestId: string;
  clientId: string;
  freelancerId: string;
  score: number;
  review: string;
  createdAt: string;
}
