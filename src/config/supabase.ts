// Workaround for environment variable injection issues  
// This file provides fallback values when import.meta.env is not properly populated
// Last updated: 2025-10-06

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || "https://vwbucznzpejenheyilue.supabase.co",
  publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3YnVjem56cGVqZW5oZXlpbHVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjMwNTEsImV4cCI6MjA3NTMzOTA1MX0.6m57BF0gQwk5FUbDKaBUmJN_-qw4sqRKl1SKkLOFx4A",
  projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID || "vwbucznzpejenheyilue",
};
