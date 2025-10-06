// Workaround for environment variable injection issues  
// This file provides fallback values when import.meta.env is not properly populated
// Last updated: 2025-10-06

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || "https://mvzqxxjmdxzghrholygv.supabase.co",
  publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12enF4eGptZHh6Z2hyaG9seWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjU1MjIsImV4cCI6MjA3NTM0MTUyMn0.hDV9Qsbj9Ql7hV_Oa7VE-SsnUbZYLV2Resi_bHj3OAU",
  projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID || "mvzqxxjmdxzghrholygv",
};
