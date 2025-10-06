-- ============================================
-- MIGRATION: Lead Capture System for Quiz
-- Execute este SQL no Cloud SQL Editor
-- ============================================

-- 1. LEADS TABLE (Main lead information)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid UNIQUE NOT NULL,
  name text NOT NULL,
  gender text,
  age_range text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_page_visited integer DEFAULT 1,
  completion_status text DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed', 'abandoned')),
  session_id uuid,
  has_email boolean DEFAULT false,
  has_whatsapp boolean DEFAULT false,
  user_agent text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text
);

-- 2. CONTACTS TABLE (Email/WhatsApp)
CREATE TABLE IF NOT EXISTS public.lead_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(lead_id) ON DELETE CASCADE,
  name text NOT NULL,
  contact_type text NOT NULL CHECK (contact_type IN ('email', 'whatsapp')),
  contact_value text NOT NULL,
  captured_at timestamptz DEFAULT now(),
  UNIQUE(lead_id, contact_type)
);

-- 3. QUIZ ANSWERS TABLE (Individual answers)
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(lead_id) ON DELETE CASCADE,
  name text NOT NULL,
  question text NOT NULL,
  answer jsonb NOT NULL,
  page_number integer,
  answered_at timestamptz DEFAULT now(),
  UNIQUE(lead_id, question)
);

-- 4. KEY QUIZ INSIGHTS (Principais respostas)
CREATE TABLE IF NOT EXISTS public.lead_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid UNIQUE REFERENCES public.leads(lead_id) ON DELETE CASCADE,
  name text NOT NULL,
  objetivo_principal text,
  barreiras text[],
  rotina_diaria text,
  tipo_corpo text,
  peso_atual numeric,
  peso_desejado numeric,
  altura numeric,
  dificuldades_fisicas text[],
  preferencias_frutas text[],
  irr_score integer,
  difficulty_score integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON public.leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_completion ON public.leads(completion_status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_lead_id ON public.lead_contacts(lead_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON public.lead_contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_answers_lead_id ON public.quiz_answers(lead_id);
CREATE INDEX IF NOT EXISTS idx_insights_lead_id ON public.lead_insights(lead_id);

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to leads" ON public.leads;
CREATE POLICY "Service role full access to leads"
  ON public.leads FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Service role full access to contacts" ON public.lead_contacts;
CREATE POLICY "Service role full access to contacts"
  ON public.lead_contacts FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Service role full access to answers" ON public.quiz_answers;
CREATE POLICY "Service role full access to answers"
  ON public.quiz_answers FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Service role full access to insights" ON public.lead_insights;
CREATE POLICY "Service role full access to insights"
  ON public.lead_insights FOR ALL
  USING (true);

-- 7. FUNCTIONS for auto-updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_insights_updated_at ON public.lead_insights;
CREATE TRIGGER update_insights_updated_at
  BEFORE UPDATE ON public.lead_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. VIEW for Remarketing Dashboard
CREATE OR REPLACE VIEW public.remarketing_leads AS
SELECT 
  l.lead_id,
  l.name,
  l.gender,
  l.age_range,
  l.created_at,
  l.completion_status,
  l.last_page_visited,
  lc.contact_type,
  lc.contact_value,
  li.objetivo_principal,
  li.barreiras,
  li.peso_atual,
  li.peso_desejado,
  li.irr_score
FROM public.leads l
LEFT JOIN public.lead_contacts lc ON l.lead_id = lc.lead_id
LEFT JOIN public.lead_insights li ON l.lead_id = li.lead_id
WHERE l.has_email = true OR l.has_whatsapp = true
ORDER BY l.created_at DESC;

-- Comments
COMMENT ON TABLE public.leads IS 'Main leads table for quiz remarketing';
COMMENT ON TABLE public.lead_contacts IS 'Email and WhatsApp contacts for leads';
COMMENT ON TABLE public.quiz_answers IS 'Individual quiz answers for each lead';
COMMENT ON TABLE public.lead_insights IS 'Key insights from quiz for remarketing segmentation';
