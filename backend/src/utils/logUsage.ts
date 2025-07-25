import { supabase } from '../lib/supabase.js';

interface LogUsageParams {
  email: string;
  action: string;
  count: number;
  cost: number;
}

export async function logUsage({ email, action, count, cost }: LogUsageParams): Promise<void> {
  try {
    const usageCount = count ?? 1;
    const usageCost = cost ?? 0;
    const { error } = await supabase.from('usage_logs').insert([
      {
        email,
        action,
        count: usageCount,
        cost: usageCost,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.error('❌ Failed to log usage:', error);
    }
  } catch (err) {
    console.error('❌ logUsage error:', err);
  }
} 