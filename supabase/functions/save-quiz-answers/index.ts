import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuizAnswer {
  question: string;
  answer: string | string[];
  pageNumber: number;
  timestamp: number;
}

interface SaveAnswersRequest {
  lead_id: string;
  answers: QuizAnswer[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { lead_id, answers }: SaveAnswersRequest = await req.json();

    console.log('💾 Saving quiz answers to lead_insights:', { lead_id, count: answers.length });

    // Extract insights from answers
    const insights = extractInsights(answers);
    
    // Upsert to lead_insights table
    const { error: insightsError } = await supabase
      .from('lead_insights')
      .upsert({
        lead_id,
        nome: insights.nome || 'Cliente',
        ...insights,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'lead_id',
        ignoreDuplicates: false
      });

    if (insightsError) {
      console.error('❌ Insights upsert error:', insightsError);
      throw insightsError;
    }

    console.log('✅ Quiz answers saved successfully to lead_insights');

    return new Response(
      JSON.stringify({ success: true, lead_id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in save-quiz-answers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Extract key insights from quiz answers for lead_insights table
function extractInsights(answers: QuizAnswer[]) {
  const insights: any = {
    nome: 'Cliente'
  };

  answers.forEach(a => {
    const answer = a.answer;
    
    // Switch usando APENAS chaves canônicas que correspondem às colunas do banco
    switch (a.question) {
      // Identificação
      case 'nome':
        insights.nome = String(answer);
        break;
      case 'contato':
        insights.contato = String(answer);
        break;
      
      // Perfil básico
      case 'objetivo_principal':
        insights.objetivo_principal = String(answer);
        break;
      case 'genero':
        insights.genero = String(answer);
        break;
      case 'mapa_corporal':
        insights.mapa_corporal = Array.isArray(answer) ? answer.join(', ') : String(answer);
        break;
      case 'idade':
        insights.idade = String(answer);
        break;
      case 'meta_peso':
        insights.meta_peso = String(answer);
        break;
      
      // Corpo e aparência
      case 'tipo_de_corpo':
        insights.tipo_de_corpo = String(answer);
        break;
      case 'corpo_dos_sonhos':
        insights.corpo_dos_sonhos = String(answer);
        break;
      
      // Dificuldades e barreiras (arrays)
      case 'dificuldades_fisicas':
        insights.dificuldades_fisicas = Array.isArray(answer) ? answer : [answer];
        break;
      case 'barreiras':
        insights.barreiras = Array.isArray(answer) ? answer : [answer];
        break;
      case 'gatilhos':
        insights.gatilhos = String(answer);
        break;
      
      // Rotina e hábitos
      case 'rotina_diaria':
        insights.rotina_diaria = String(answer);
        break;
      case 'consumo_de_agua':
        insights.consumo_de_agua = String(answer);
        break;
      case 'preferencias_de_frutas':
        insights.preferencias_de_frutas = Array.isArray(answer) ? answer : [answer];
        break;
      
      // Medidas (numeric)
      case 'altura':
        insights.altura = parseFloat(String(answer));
        break;
      case 'peso':
        insights.peso = parseFloat(String(answer));
        break;
      case 'peso_desejado':
        insights.peso_desejado = parseFloat(String(answer));
        break;
      
      // Benefícios e análise
      case 'beneficios':
        insights.beneficios = Array.isArray(answer) ? answer : [answer];
        break;
      case 'irr_score':
        insights.irr_score = parseInt(String(answer), 10);
        break;
      
      // Casos legados para retrocompatibilidade (podem ser removidos após migração completa)
      case 'name':
        insights.nome = String(answer);
        break;
      case 'whatsapp_contact':
      case 'email_contact':
        insights.contato = String(answer);
        break;
    }
  });

  return insights;
}
