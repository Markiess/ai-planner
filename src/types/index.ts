// Task category types
export type TaskCategory = 'homework' | 'work' | 'sports' | 'shopping' | 'transport' | 'daily';

// Task/Homework type definition
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  
  // Common fields
  startTime?: Date;
  dueDate: Date;
  estimatedTime?: number; // in minutes
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  
  // Category-specific fields
  // Homework
  subject?: string;
  difficulty?: number; // 1-5
  attachments?: string[];
  
  // Work
  projectName?: string;
  meetingLink?: string;
  location?: string;
  relatedPeople?: string[];
  checklist?: string[];
  urgency?: 'critical' | 'high' | 'normal';
  
  // Sports
  sportType?: string;
  targetDuration?: number;
  intensity?: number; // 1-5
  equipmentNeeded?: string[];
  targetHeartRate?: number;
  calorieGoal?: number;
  
  // Shopping
  shoppingList?: string[]; // tags
  targetStore?: string;
  budgetLimit?: number;
  isRecurring?: boolean;
  
  // Transport
  departureLocation?: string;
  arrivalLocation?: string;
  transportType?: string;
  bufferTime?: number; // in minutes
  ticketInfo?: string;
  
  // Daily
  habitName?: string;
  reminderFrequency?: string;
  moodTracking?: boolean;
  
  tags?: string[];
}

// AI Recommendation type
export interface AIRecommendation {
  suggestedOrder: string[]; // Task IDs in recommended order
  reasoning: string;
  focusTask?: string;
  tips?: string[];
  dailyBrief?: string; // One-sentence summary of the day
  conflicts?: TimeConflict[];
}

// Time conflict detection
export interface TimeConflict {
  taskId1: string;
  taskId2: string;
  overlapStart: Date;
  overlapEnd: Date;
}

// AI Task Breakdown
export interface AITaskBreakdown {
  steps: string[];
  icebreaker?: string; // Suggestion for getting started
  estimatedStepsTime?: number[]; // Time for each step in minutes
}

// User preferences
export interface UserPreferences {
  preferredWorkTime?: {
    start: string; // "09:00"
    end: string; // "22:00"
  };
  breakInterval?: number; // minutes
  dailyGoal?: number;
  defaultCategory?: TaskCategory;
}

// For backward compatibility
export type Homework = Task;
