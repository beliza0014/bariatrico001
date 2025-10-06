import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactCaptureRequest {
  session_id: string;
  contact_type: 'email' | 'whatsapp';
  contact_value: string;
  lead_name: string;
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

    const { session_id, contact_type, contact_value, lead_name }: ContactCaptureRequest = await req.json();

    console.log('📞 Capturing contact:', { session_id, contact_type, lead_name });

    // Insert into contatos_captados table
    const contactData: any = {
      lead_id: session_id,
      nome: lead_name,
    };

    // Set the appropriate contact field
    if (contact_type === 'email') {
      contactData.email = contact_value;
    } else {
      contactData.whatsapp = contact_value;
    }

    const { error: contactError } = await supabase
      .from('contatos_captados')
      .upsert(contactData, {
        onConflict: 'lead_id',
        ignoreDuplicates: false
      });

    if (contactError) {
      console.error('❌ Contact insert error:', contactError);
      throw contactError;
    }

    // Also update lead_insights with contact if exists
    const { error: insightsError } = await supabase
      .from('lead_insights')
      .update({ 
        contato: contact_value,
        nome: lead_name 
      })
      .eq('lead_id', session_id);

    if (insightsError) {
      console.warn('⚠️ Could not update lead_insights (may not exist yet):', insightsError.message);
    }

    console.log('✅ Contact captured successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead_id: session_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Error in capture-contact:', error);
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
