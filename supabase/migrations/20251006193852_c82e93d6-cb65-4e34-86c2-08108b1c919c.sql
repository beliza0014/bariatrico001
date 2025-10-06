-- ============================================
-- SECURITY FIX: Corrige avisos de segurança
-- ============================================

-- 1. FIX: Function Search Path - Adiciona search_path à função
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. FIX: Security Definer View - Recria view com SECURITY INVOKER
DROP VIEW IF EXISTS public.remarketing_leads;
CREATE VIEW public.remarketing_leads 
WITH (security_invoker = true)
AS
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