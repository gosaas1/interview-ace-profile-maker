import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

interface TierLimits {
  cv_parses_per_month: number;
  ai_rewrites_per_month: number;
  job_applications_per_month: number;
  interview_sessions_per_month: number;
  max_tokens_per_request: number;
  cost_per_token: number;
}

interface TierUsage {
  cv_parses: number;
  ai_rewrites: number;
  job_applications: number;
  interview_sessions: number;
}

interface TierInfo {
  currentTier: string;
  tierStartDate: string;
  monthlyUsageResetDate: string;
  limits: TierLimits;
  usage: TierUsage;
}

export function useTier() {
  const { user } = useAuth();
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTierInfo();
    } else {
      setTierInfo(null);
      setIsLoading(false);
    }
  }, [user]);

  const fetchTierInfo = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get the session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch('/api/tier/info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tier information');
      }

      const data = await response.json();
      setTierInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tier info');
      // Set default tier info for fallback
      setTierInfo({
        currentTier: 'free',
        tierStartDate: new Date().toISOString(),
        monthlyUsageResetDate: new Date().toISOString(),
        limits: {
          cv_parses_per_month: 5,
          ai_rewrites_per_month: 3,
          job_applications_per_month: 2,
          interview_sessions_per_month: 1,
          max_tokens_per_request: 1000,
          cost_per_token: 0.0001
        },
        usage: {
          cv_parses: 0,
          ai_rewrites: 0,
          job_applications: 0,
          interview_sessions: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canPerformAction = (actionType: 'cv_parse' | 'ai_rewrite' | 'job_apply' | 'interview_practice'): boolean => {
    if (!tierInfo) return false;

    const usageMap = {
      cv_parse: tierInfo.usage.cv_parses,
      ai_rewrite: tierInfo.usage.ai_rewrites,
      job_apply: tierInfo.usage.job_applications,
      interview_practice: tierInfo.usage.interview_sessions
    };

    const limitMap = {
      cv_parse: tierInfo.limits.cv_parses_per_month,
      ai_rewrite: tierInfo.limits.ai_rewrites_per_month,
      job_apply: tierInfo.limits.job_applications_per_month,
      interview_practice: tierInfo.limits.interview_sessions_per_month
    };

    const currentUsage = usageMap[actionType];
    const limit = limitMap[actionType];

    return currentUsage < limit;
  };

  const getRemainingUsage = (actionType: 'cv_parse' | 'ai_rewrite' | 'job_apply' | 'interview_practice'): number => {
    if (!tierInfo) return 0;

    const usageMap = {
      cv_parse: tierInfo.usage.cv_parses,
      ai_rewrite: tierInfo.usage.ai_rewrites,
      job_apply: tierInfo.usage.job_applications,
      interview_practice: tierInfo.usage.interview_sessions
    };

    const limitMap = {
      cv_parse: tierInfo.limits.cv_parses_per_month,
      ai_rewrite: tierInfo.limits.ai_rewrites_per_month,
      job_apply: tierInfo.limits.job_applications_per_month,
      interview_practice: tierInfo.limits.interview_sessions_per_month
    };

    const currentUsage = usageMap[actionType];
    const limit = limitMap[actionType];

    return Math.max(0, limit - currentUsage);
  };

  return {
    tierInfo,
    isLoading,
    error,
    canPerformAction,
    getRemainingUsage,
    refetch: fetchTierInfo
  };
} 
 
 