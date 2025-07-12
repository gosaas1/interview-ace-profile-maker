import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Backend Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://iqikeltdqmpdsczakril.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceKey) {
  console.warn('⚠️  Supabase service role key not found. Database operations will be limited.');
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// CV Types (matching frontend)
export interface CVData {
  id: string;
  user_id: string;
  title: string;
  content: {
    full_name: string;
    job_title?: string;
    email: string;
    phone: string;
    location: string;
    linkedin_url?: string;
    portfolio_url?: string;
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
    projects?: Array<{
      name: string;
      description: string;
      technologies: string;
      url: string;
    }>;
    skills: string;
    languages?: Array<{
      language: string;
      proficiency: string;
    }>;
    certifications: string;
    references?: Array<{
      name: string;
      title: string;
      company: string;
      email: string;
      phone: string;
    }>;
  };
  template_id?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// CV Database Operations
export const cvOperations = {
  async createCV(userId: string, cvData: { title: string; content: any; is_public?: boolean; template_id?: string }) {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .insert({
          user_id: userId,
          title: cvData.title,
          content: cvData.content,
          template_id: cvData.template_id || 'basic-modern',
          is_public: cvData.is_public || false
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating CV:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating CV:', error);
      return { data: null, error: error.message };
    }
  },

  async getCVs(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error fetching CVs:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching CVs:', error);
      return { data: null, error: error.message };
    }
  },

  async getCV(cvId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', cvId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Database error fetching CV:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching CV:', error);
      return { data: null, error: error.message };
    }
  },

  async updateCV(cvId: string, userId: string, updates: { title?: string; content?: any; is_public?: boolean; template_id?: string }) {
    try {
      const { data, error } = await supabase
        .from('cvs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', cvId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Database error updating CV:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating CV:', error);
      return { data: null, error: error.message };
    }
  },

  async deleteCV(cvId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('cvs')
        .delete()
        .eq('id', cvId)
        .eq('user_id', userId);

      if (error) {
        console.error('Database error deleting CV:', error);
        throw new Error(error.message);
      }

      return { data: null, error: null };
    } catch (error: any) {
      console.error('Error deleting CV:', error);
      return { data: null, error: error.message };
    }
  }
};

// User Operations
export const userOperations = {
  async getUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Database error fetching user:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching user:', error);
      return { data: null, error: error.message };
    }
  },

  async createUser(userId: string, userData: { email: string; full_name?: string }) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email,
          full_name: userData.full_name
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating user:', error);
        throw new Error(error.message);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating user:', error);
      return { data: null, error: error.message };
    }
  }
};

// Authentication helper
export async function verifyAuthToken(token: string) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Auth error:', error);
      return { user: null, error: error.message };
    }

    return { user, error: null };
  } catch (error: any) {
    console.error('Error verifying auth token:', error);
    return { user: null, error: error.message };
  }
}

// Test database connection
export async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('cvs')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Database connection test successful');
    return { success: true, data };
  } catch (err) {
    console.error('Database connection test error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
} 