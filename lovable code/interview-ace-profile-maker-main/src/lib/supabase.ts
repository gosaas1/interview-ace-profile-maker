import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tlddkfkoizeubctqjraf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsZGRrZmtvaXpldWJjdHFqcmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTA3NzMsImV4cCI6MjA2NjI4Njc3M30.PF7q5znPXOecZzn7L0Vf05NnaOY2vVzQ4ltNWUL0Na0';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// OAuth Configuration - Environment variables for production
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';
export const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '';
export const LINKEDIN_CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'applyace-auth',
    storage: {
      getItem: (key) => {
        try {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        } catch {
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error('Failed to store auth session:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Failed to remove auth session:', error);
        }
      },
    },
  },
});

// CV Types
export interface CVData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa: string;
  }>;
  skills: string;
  certifications: string;
  template_id?: string;
  is_primary?: boolean;
  ats_score?: number;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  content_type?: string;
  created_at: string;
  updated_at: string;
}

// Interview Types
export interface InterviewSession {
  id: string;
  user_id: string;
  session_type: 'practice' | 'mock' | 'simulation' | 'assessment';
  industry?: string;
  job_role?: string;
  difficulty_level: number;
  questions_total: number;
  questions_answered: number;
  confidence_score: number;
  overall_rating: number;
  duration_minutes: number;
  session_status: 'active' | 'completed' | 'paused' | 'abandoned';
  ai_feedback: any;
  improvement_areas: string[];
  strengths: string[];
  recommendations: string[];
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  category: string;
  subcategory?: string;
  industry?: string;
  job_role?: string;
  difficulty: number;
  question_type: 'behavioral' | 'technical' | 'situational' | 'case-study' | 'general';
  question_text: string;
  question_context?: string;
  sample_answer?: string;
  sample_keywords: string[];
  evaluation_criteria: any;
  tags: string[];
  is_active: boolean;
  usage_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: string;
  session_id: string;
  question_id: string;
  user_id: string;
  response_text?: string;
  response_audio_url?: string;
  response_video_url?: string;
  response_duration_seconds: number;
  confidence_score: number;
  clarity_score: number;
  relevance_score: number;
  structure_score: number;
  overall_score: number;
  ai_feedback: any;
  improvement_suggestions: string[];
  keywords_used: string[];
  keywords_missing: string[];
  response_status: 'started' | 'completed' | 'skipped' | 'timeout';
  created_at: string;
}

// CV Database Operations
export const cvOperations = {
  async createCV(cvData: Omit<CVData, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .insert([
        {
          ...cvData,
          user_id: user.id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCV(id: string, cvData: Partial<CVData>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .update(cvData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCV(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async getAllCVs() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteCV(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  }
};

// Interview Database Operations
export const interviewOperations = {
  async createSession(sessionData: Omit<InterviewSession, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('interview_sessions')
      .insert([
        {
          ...sessionData,
          user_id: user.id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSession(id: string, sessionData: Partial<InterviewSession>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('interview_sessions')
      .update(sessionData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserSessions() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getQuestions(filters?: { category?: string; industry?: string; difficulty?: number; limit?: number }) {
    let query = supabase
      .from('questions')
      .select('*')
      .eq('is_active', true);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.industry) query = query.eq('industry', filters.industry);
    if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);
    if (filters?.limit) query = query.limit(filters.limit);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createResponse(responseData: Omit<UserResponse, 'id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_responses')
      .insert([
        {
          ...responseData,
          user_id: user.id,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Test Supabase connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}; 