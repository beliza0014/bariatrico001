// Utility function to normalize barriers for consistent tracking and persona determination
export function normalizeBarrier(barrier: string): string {
  if (!barrier) return "falta_constancia";
  
  if (barrier.includes("ansiedade") || barrier.includes("autocontrole")) return "ansiedade";
  if (barrier === "falta_tempo") return "tempo";
  if (barrier === "orcamento_curto") return "financeiro";
  if (barrier === "falta_constancia") return "autocontrole";
  if (barrier === "falta_apoio") return "apoio_social";
  if (barrier.startsWith("outro")) return "outro";
  
  return barrier;
}

// Helper to determine persona from barriers
export function getPersonaFromBarriers(barriers: string[]): string {
  if (!barriers?.length) return 'geral';
  
  const mainBarrier = normalizeBarrier(barriers[0]);
  
  // Time-pressed persona
  if (mainBarrier === 'tempo') {
    return 'tempo_apertado';
  }
  
  // Impulse control issues
  if (mainBarrier === 'ansiedade' || mainBarrier === 'autocontrole') {
    return 'controle_impulso';
  }
  
  return 'geral';
}

// Helper to get persona display label
export function getPersonaLabel(normalizedBarrier: string): string {
  const labels = {
    tempo: "Tempo apertado",
    ansiedade: "Ansiedade/Compulsão", 
    financeiro: "Orçamento curto",
    autocontrole: "Falta de constância",
    apoio_social: "Falta de apoio",
    outro: "Personalizado"
  };
  
  return labels[normalizedBarrier as keyof typeof labels] || "Personalizado";
}