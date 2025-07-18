import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export interface JobApplication {
  id?: string;
  user_id?: string;
  cv_id: string;
  job_title: string;
  company_name: string;
  job_url?: string;
  job_description?: string;
  application_date?: string;
  status: 'draft' | 'applied' | 'interviewed' | 'offered' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  salary_range?: string;
  location?: string;
  job_type?: string;
  notes?: string;
  follow_up_date?: string;
  interview_scheduled?: boolean;
  interview_date?: string;
  interview_notes?: string;
  feedback?: string;
  match_score?: number;
  requirements_met?: any;
  cover_letter?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CVData {
  id: string;
  full_name: string;
  job_title?: string;
  email?: string;
  summary?: string;
  skills?: string;
  experiences?: any[];
  education?: any[];
}

export interface JobData {
  id: string;
  title: string;
  company: string;
  description?: string;
  requirements?: string[];
  salary_range?: any;
  location?: string;
  job_type?: string;
}

export class JobApplicationsService {
  // Get all job applications for a user
  static async getUserApplications(): Promise<JobApplication[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching job applications:', error);
      toast.error('Failed to load job applications');
      return [];
    }
  }

  // Create a new job application (one-button apply)
  static async createApplication(application: JobApplication): Promise<JobApplication | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('job_applications')
        .insert({
          ...application,
          user_id: user.id,
          application_date: new Date().toISOString().split('T')[0],
          status: 'applied'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      return data;
    } catch (error: any) {
      console.error('Error creating job application:', error);
      toast.error('Failed to submit application');
      return null;
    }
  }

  // Update job application status
  static async updateApplicationStatus(id: string, status: JobApplication['status'], notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ 
          status, 
          notes: notes ? notes : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Application status updated');
      return true;
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
      return false;
    }
  }

  // Generate cover letter using AI
  static async generateCoverLetter(cvData: CVData, jobData: JobData): Promise<string> {
    try {
      // TODO: Integrate with OpenAI/Claude API for AI-generated cover letters
      // For now, using a template-based approach
      
      const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobData.title} position at ${jobData.company}. With my background in ${cvData.job_title || 'software development'} and experience in ${cvData.skills || 'various technologies'}, I believe I would be a valuable addition to your team.

${cvData.summary || 'I am a dedicated professional with a passion for delivering high-quality solutions.'}

I am particularly excited about this opportunity because it aligns perfectly with my career goals and would allow me to contribute to ${jobData.company}'s continued success.

Thank you for considering my application. I look forward to discussing how my skills and experience can benefit your team.

Best regards,
${cvData.full_name}`;

      return coverLetter;
    } catch (error: any) {
      console.error('Error generating cover letter:', error);
      toast.error('Failed to generate cover letter');
      return '';
    }
  }

  // Calculate match score between CV and job
  static async calculateMatchScore(cvData: CVData, jobData: JobData): Promise<number> {
    try {
      // Simple keyword matching algorithm
      const cvText = `${cvData.skills || ''} ${cvData.summary || ''} ${cvData.job_title || ''}`.toLowerCase();
      const jobText = `${jobData.description || ''} ${jobData.requirements?.join(' ') || ''}`.toLowerCase();
      
      const cvWords = cvText.split(/\s+/);
      const jobWords = jobText.split(/\s+/);
      
      const commonWords = cvWords.filter(word => jobWords.includes(word));
      const matchScore = Math.min(100, Math.round((commonWords.length / jobWords.length) * 100));
      
      return matchScore;
    } catch (error: any) {
      console.error('Error calculating match score:', error);
      return 50; // Default score
    }
  }

  // Get best CV for a job (auto-selection)
  static async getBestCVForJob(jobData: JobData): Promise<CVData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: cvs, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!cvs || cvs.length === 0) return null;

      // Calculate match scores for all CVs
      const cvScores = await Promise.all(
        cvs.map(async (cv) => ({
          cv,
          score: await this.calculateMatchScore(cv, jobData)
        }))
      );

      // Return CV with highest match score
      const bestCV = cvScores.reduce((prev, current) => 
        current.score > prev.score ? current : prev
      );

      return bestCV.cv;
    } catch (error: any) {
      console.error('Error getting best CV for job:', error);
      return null;
    }
  }

  // Get interview preparation suggestions
  static async getInterviewSuggestions(jobData: JobData): Promise<string[]> {
    try {
      // TODO: Integrate with AI service for interview suggestions
      const suggestions = [
        `Research ${jobData.company}'s recent news and company culture`,
        `Prepare examples of your experience with ${jobData.requirements?.slice(0, 3).join(', ') || 'relevant skills'}`,
        `Practice answering behavioral questions about leadership and problem-solving`,
        `Prepare questions to ask about the role and company growth opportunities`
      ];

      return suggestions;
    } catch (error: any) {
      console.error('Error getting interview suggestions:', error);
      return [];
    }
  }

  // Track application analytics
  static async getApplicationAnalytics(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: applications, error } = await supabase
        .from('job_applications')
        .select('status, created_at')
        .eq('user_id', user.id);

      if (error) throw error;

      const analytics = {
        total: applications?.length || 0,
        applied: applications?.filter(app => app.status === 'applied').length || 0,
        interviewed: applications?.filter(app => app.status === 'interviewed').length || 0,
        offered: applications?.filter(app => app.status === 'offered').length || 0,
        rejected: applications?.filter(app => app.status === 'rejected').length || 0,
        successRate: 0
      };

      if (analytics.total > 0) {
        analytics.successRate = Math.round((analytics.offered / analytics.total) * 100);
      }

      return analytics;
    } catch (error: any) {
      console.error('Error getting application analytics:', error);
      return {
        total: 0,
        applied: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0,
        successRate: 0
      };
    }
  }
}

// Auto-suggestions integration
export class AutoSuggestionsService {
  // Get suggestions for job titles, skills, etc.
  static async getSuggestions(category: string, query: string = ''): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('auto_suggestions')
        .select('value, usage_count')
        .eq('category', category)
        .or(`is_global.eq.true,user_id.eq.${(await supabase.auth.getUser()).data?.user?.id || 'null'}`)
        .ilike('value', `%${query}%`)
        .order('usage_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data?.map(item => item.value) || [];
    } catch (error: any) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }

  // Add new suggestion (user contribution)
  static async addSuggestion(category: string, value: string, isGlobal: boolean = false): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('auto_suggestions')
        .upsert({
          user_id: isGlobal ? null : user.id,
          category,
          value,
          is_global: isGlobal,
          usage_count: 1
        }, {
          onConflict: 'user_id,category,value'
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error adding suggestion:', error);
      return false;
    }
  }
} 