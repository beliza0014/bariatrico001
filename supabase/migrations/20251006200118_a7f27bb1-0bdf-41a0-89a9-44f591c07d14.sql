-- ============================================
-- MIGRATION: Create lead_insights and contatos_captados tables
-- ============================================

-- 1. LEAD_INSIGHTS TABLE - Todas as respostas do quiz em uma linha
CREATE TABLE IF NOT EXISTS public.lead_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid UNIQUE NOT NULL,
  nome text NOT NULL,
  contato text,
  
  -- Respostas do Quiz
  objetivo_principal text,
  genero text,
  mapa_corporal text,
  idade text,
  meta_peso text,
  gatilhos text,
  dificuldades_fisicas text[],
  barreiras text[],
  tipo_de_corpo text,
  corpo_dos_sonhos text,
  rotina_diaria text,
  consumo_de_agua text,
  preferencias_de_frutas text[],
  altura numeric,
  peso numeric,
  peso_desejado numeric,
  beneficios text[],
  irr_score integer,
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. CONTATOS_CAPTADOS TABLE - Dados básicos para remarketing
CREATE TABLE IF NOT EXISTS public.contatos_captados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid UNIQUE NOT NULL,
  nome text NOT NULL,
  whatsapp text,
  email text,
  created_at timestamptz DEFAULT now(),
  
  -- Pelo menos um contato deve estar preenchido
  CONSTRAINT check_has_contact CHECK (whatsapp IS NOT NULL OR email IS NOT NULL)
);

-- 3. INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_lead_insights_lead_id ON public.lead_insights(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_insights_created ON public.lead_insights(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_insights_genero ON public.lead_insights(genero);
CREATE INDEX IF NOT EXISTS idx_lead_insights_objetivo ON public.lead_insights(objetivo_principal);
CREATE INDEX IF NOT EXISTS idx_contatos_lead_id ON public.contatos_captados(lead_id);
CREATE INDEX IF NOT EXISTS idx_contatos_email ON public.contatos_captados(email);
CREATE INDEX IF NOT EXISTS idx_contatos_whatsapp ON public.contatos_captados(whatsapp);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.lead_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos_captados ENABLE ROW LEVEL SECURITY;

-- Service role tem acesso total (para edge functions)
DROP POLICY IF EXISTS "Service role full access to lead_insights" ON public.lead_insights;
CREATE POLICY "Service role full access to lead_insights"
  ON public.lead_insights FOR ALL
  USING (true);

DROP POLICY IF EXISTS "Service role full access to contatos" ON public.contatos_captados;
CREATE POLICY "Service role full access to contatos"
  ON public.contatos_captados FOR ALL
  USING (true);

-- 5. FUNCTION for auto-updates
CREATE OR REPLACE FUNCTION public.update_lead_insights_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER for automatic timestamp updates
DROP TRIGGER IF EXISTS update_lead_insights_updated_at ON public.lead_insights;
CREATE TRIGGER update_lead_insights_updated_at
  BEFORE UPDATE ON public.lead_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_insights_timestamp();

-- 7. COMMENTS
COMMENT ON TABLE public.lead_insights IS 'Todas as respostas do quiz de cada lead em uma única linha';
COMMENT ON TABLE public.contatos_captados IS 'Dados de contato dos leads para remarketing';
COMMENT ON COLUMN public.lead_insights.lead_id IS 'Identificador único do lead (UUID)';
COMMENT ON COLUMN public.contatos_captados.lead_id IS 'Referência ao lead_id da tabela lead_insights';