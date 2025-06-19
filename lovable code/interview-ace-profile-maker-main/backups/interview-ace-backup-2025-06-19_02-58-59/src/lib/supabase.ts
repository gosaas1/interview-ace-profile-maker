import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iqikeltdqmpdsczakril.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtlbHRkcW1wZHNjemFrcmlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1ODExODksImV4cCI6MjA2NTE1NzE4OX0.o_c4yk6tKYM17uTXtdepkRWR4PUp71lflaciAcLB6i4';

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = '1094821547409-2k8q8q8q8q8q8q8q8q8q8q8q8q8q8q8q.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = 'GOCSPX-2k8q8q8q8q8q8q8q8q8q8q8q8q8q8q8q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'interview-ace-auth',
    storage: {
      getItem: (key) => {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      },
      setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      removeItem: (key) => {
        localStorage.removeItem(key);
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
  // File upload fields
  file_url?: string;
  file_name?: string;
  file_size?: number;
  type?: 'file' | 'text';
  content?: string;
  created_at: string;
  updated_at: string;
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
    return data;
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