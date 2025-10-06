import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InitLeadRequest {
  lead_id: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
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

    const { 
      lead_id, 
      user_agent, 
      referrer, 
      utm_source, 
      utm_medium, 
      utm_campaign 
    }: InitLeadRequest = await req.json();

    console.log('🆕 Initializing lead in lead_insights:', lead_id);

    // Create initial lead_insights record with basic info
    const { error: leadError } = await supabase
      .from('lead_insights')
      .upsert({
        lead_id,
        nome: 'Novo Lead', // Will be updated when they provide name
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'lead_id',
        ignoreDuplicates: true
      });

    if (leadError) {
      console.error('❌ Lead init error:', leadError);
      throw leadError;
    }

    console.log('✅ Lead initialized successfully in lead_insights');

    return new Response(
      JSON.stringify({ success: true, lead_id }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in init-lead:', error);
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
