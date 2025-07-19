import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { validateRequest, schemas } from '../middleware/validation.js';

const router = Router();

// Register a new user
router.post('/register', validateRequest(schemas.auth.register), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, role } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          email,
          full_name,
          role,
        },
      ])
      .select()
      .single();

    if (profileError) {
      // If profile creation fails, delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
});

// Login user
router.post('/login', validateRequest(schemas.auth.login), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Login failed');
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    res.json({
      message: 'Login successful',
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
      },
      session: data.session,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Login failed',
      error: error.message,
    });
  }
});

// Logout user
router.post('/logout', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(400).json({
      message: 'Logout failed',
      error: error.message,
    });
  }
});

// Get current user
router.get('/me', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    res.json({
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Error fetching user',
      error: error.message,
    });
  }
});

export default router; 