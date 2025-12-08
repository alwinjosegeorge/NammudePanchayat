export type Category = 
  | 'brokenRoad'
  | 'streetlight'
  | 'waterLeak'
  | 'drainage'
  | 'garbage'
  | 'electricity'
  | 'publicProperty'
  | 'other';

export type Urgency = 'normal' | 'high' | 'urgent';

export type Status = 
  | 'submitted'
  | 'received'
  | 'assigned'
  | 'inProgress'
  | 'resolved'
  | 'closed';

export type Team = 
  | 'roads'
  | 'water'
  | 'electricity'
  | 'sanitation'
  | 'general';

export interface TimelineEntry {
  status: Status;
  timestamp: string;
  note?: string;
  actor?: string;
}

export interface Report {
  id: string;
  trackingId: string;
  category: Category;
  title: string;
  description: string;
  panchayat: string;
  address: string;
  lat: number;
  lng: number;
  urgency: Urgency;
  photos: string[];
  contact?: {
    phone?: string;
    email?: string;
  };
  anonymous: boolean;
  status: Status;
  assignedTeam?: Team;
  createdAt: string;
  updatedAt: string;
  history: TimelineEntry[];
  internalNotes?: string[];
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  panchayat: string;
  possiblePanchayats?: string[];
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'staff';
}

export const categoryToTeam: Record<Category, Team> = {
  brokenRoad: 'roads',
  streetlight: 'electricity',
  waterLeak: 'water',
  drainage: 'sanitation',
  garbage: 'sanitation',
  electricity: 'electricity',
  publicProperty: 'general',
  other: 'general',
};

export const categoryIcons: Record<Category, string> = {
  brokenRoad: '🛣️',
  streetlight: '💡',
  waterLeak: '💧',
  drainage: '🌊',
  garbage: '🗑️',
  electricity: '⚡',
  publicProperty: '🏛️',
  other: '📋',
};
