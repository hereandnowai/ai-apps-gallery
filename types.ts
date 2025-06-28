
export interface AppInfo {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  appUrl: string;
  tags: string[];
  version?: string;
  lastUpdated?: string; // e.g., "YYYY-MM-DD"
  status?: 'alpha' | 'beta' | 'live' | 'deprecated' | 'coming soon';
  category?: string;
  developer?: string;
  ai_engineer?: string | string[]; // Can be a single name or an array of names
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string; // Optional: Google profile picture URL
}

export interface EngineerInfo {
  id: string;
  name: string;
  photoUrl: string;
  role: string;
  bio: string;
  githubUrl?: string;
  isEngineerOfTheMonth?: boolean;
}