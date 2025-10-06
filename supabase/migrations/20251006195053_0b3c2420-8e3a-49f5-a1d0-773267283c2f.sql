-- ============================================
-- MIGRATION: Remove leads system tables
-- ============================================

-- 1. Drop the remarketing view first
DROP VIEW IF EXISTS public.remarketing_leads CASCADE;

-- 2. Drop quiz_answers table
DROP TABLE IF EXISTS public.quiz_answers CASCADE;

-- 3. Drop dependent tables (will be cascaded from leads, but explicit is better)
DROP TABLE IF EXISTS public.lead_insights CASCADE;
DROP TABLE IF EXISTS public.lead_contacts CASCADE;

-- 4. Drop the main leads table
DROP TABLE IF EXISTS public.leads CASCADE;

-- Drop the update trigger function if no longer needed
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;