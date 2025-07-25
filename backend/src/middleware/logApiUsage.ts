import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

export const logApiUsage = (routeName: string, model = 'unknown') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      const user = req.user;
      if (!user) return;
      const usage = {
        user_id: user.id,
        route: routeName,
        method: req.method,
        cost: res.locals.cost || 0.002, // or estimate from Cohere/OpenAI usage
        tokens: res.locals.tokens || 0,
        model,
      };
      try {
        await supabase.from('api_usage').insert([usage]);
      } catch (err) {
        console.error('Failed to log API usage:', err);
      }
    });
    next();
  };
}; 