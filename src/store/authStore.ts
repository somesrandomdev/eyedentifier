import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../utils/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: true,

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            return { success: false, error: error.message };
          }

          if (data.user) {
            set({
              isAuthenticated: true,
              user: data.user,
              loading: false
            });
            return { success: true };
          }

          return { success: false, error: 'Login failed' };
        } catch (error) {
          return { success: false, error: 'An unexpected error occurred' };
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          isAuthenticated: false,
          user: null,
          loading: false
        });
      },

      initialize: () => {
        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            set({
              isAuthenticated: true,
              user: session.user,
              loading: false
            });
          } else {
            set({ loading: false });
          }
        });

        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            set({
              isAuthenticated: true,
              user: session.user,
              loading: false
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              loading: false
            });
          }
        });
      },
    }),
    {
      name: 'eyedentify-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user
      }),
    }
  )
);