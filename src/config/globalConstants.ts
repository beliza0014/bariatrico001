// Constantes globais do funil LeveMe - IAPA Standards
export const GLOBAL_CONSTANTS = {
  // Claims e promessas padronizadas
  RESULT_CLAIM: "até 4 kg em 30 dias",
  GUARANTEE_DAYS: "30 dias",
  SOCIAL_COUNT: "+10.000 pessoas",
  PRICE: "R$ 37,90",
  
  // Prova social e disclaimers
  DISCLAIMERS: {
    RESULTS_VARY: "Resultados variam conforme rotina e adesão.",
    AUTHENTIC_TESTIMONIALS: "Imagens e depoimentos autorizados; exemplos reais.",
    RATING: "Avaliação 4,9/5 baseada em +10.000 transformadas.",
    EDUCATIONAL: "Conteúdo educativo; não substitui orientação profissional. Resultados variam conforme rotina e adesão.",
    TESTIMONIALS: "Depoimentos reais de clientes. Resultados individuais podem variar.",
    GUARANTEE: "Garantia de 7 dias ou seu dinheiro de volta."
  },
  
// Padrões de CTA (usar exatamente como especificado)
  CTA_PATTERNS: {
    DISCOVERY: "PERSONALIZAR MINHA RECEITA",
    TRANSFORMATION: "QUERO ESSA TRANSFORMAÇÃO", 
    GUARANTEE: "GARANTIR MINHA RECEITA",
    FINAL: "QUERO MINHA RECEITA AGORA",
    PRIMARY: "VER MEU RESULTADO AGORA",
    CONTINUE: "CONTINUAR"
  },

  // CTAs com subtexto padronizado
  CTA_PRIMARY: "QUERO MINHA RECEITA AGORA",
  CTA_SUBTEXT: "Comece sua transformação ainda hoje — sem risco com nossa garantia de 7 dias.",
  
  // Copy padronizada para elementos comuns
  COMMON_COPY: {
    PIX_GUARANTEE: "Pix aprovado na hora • Garantia 7 dias",
    RATING_FULL: "Avaliação 4,9/5 — +10.000 transformadas",
    SECURE_PURCHASE: "Compra 100% Segura • Acesso Imediato • Garantia 7 dias",
    TRUST_STRIP: "PIX aprovado na hora • Garantia 7 dias • Acesso imediato",
    CTA_MICROCOPY: "Grátis • leva ~60s • sem compromisso"
  },

  // Delays padrão por tipo de página
  DEFAULT_READ_DELAY: {
    VSL: 9000,          // 9s para vídeos
    ANALYSIS: 9000,     // 9s para análises 
    INTERPRETATION: 9000, // 9s para interpretações
    RITUAL: 9000,       // 9s para explicações de ritual
    CURVE: 9000,        // 9s para cronogramas
    GENERAL: 8000       // 8s para páginas gerais
  }
};

// Tokens de personalização ativa
export const PERSONALIZATION_TOKENS = {
  FIRST_NAME: "{{firstName}}",
  GENDER: "{{gender}}",
  MAIN_BARRIER: "{{mainBarrier}}", 
  WATER_INTAKE: "{{waterIntake}}",
  GOALS: "{{goals}}"
};

// A/B Test flags com valores default
export const AB_TEST_FLAGS = {
  VSL_GATE: "vsl_gate", // 9s vs 0s - timing do CTA nos vídeos
  SHOW_PRICE_PRE_VIDEO: "show_price_prevideo", // on/off - exibir preço antes do vídeo
  ALLOW_SKIP_NAME: "allow_skip_name", // on/off - opção pular nome
  ALLOW_SKIP_VSL: "allow_skip_vsl", // on/off - botão "ver resultado" sem ver todo vídeo
  TESTIMONIAL_STYLE: "testimonial_style", // card/quote - estilo dos depoimentos
  STICKY_CTA_COMPARE: "sticky_cta_compare", // on/off - CTA sticky na comparação
  INTERPRET_AUTO_ADVANCE: "interpret_auto_advance", // on/off - auto-advance interpretação IRR
  P11_CTA_VARIANT: "p11_cta_variant" // personalizar vs confirmar - CTA P11 sabores
};

// Configuração experimental A/B (onda 1 - ATIVA)
export const AB_EXPERIMENTS = {
  WAVE_1: {
    // Experimento 1: VSL Gate timing (9s vs 0s)
    VSL_GATE_TIMING: {
      name: "vsl_gate_timing",
      active: true,
      allocation: 50, // 50/50 split
      variants: {
        control: { timing: 9000, label: "9s_gate" },
        variant: { timing: 0, label: "0s_gate" }
      }
    },
    // Experimento 2: Sticky CTA na comparação
    STICKY_CTA_COMPARE: {
      name: "sticky_cta_compare", 
      active: true,
      allocation: 50, // 50/50 split
      variants: {
        control: { sticky: false, label: "normal_cta" },
        variant: { sticky: true, label: "sticky_cta" }
      }
    },
    // Experimento 3: P01 Headline Wave rápida
    P01_HEADLINE_VARIANT: {
      name: "p01_headline_variant",
      active: true,
      allocation: 50, // 50/50 split
      variants: {
        control: { 
          h1: "Ritual de chá de 3 minutos que tem ajudado mulheres a secar até 4 kg em até 30 dias",
          label: "secar_4kg" 
        },
        variant: { 
          h1: "Ritual de chá de 3 minutos que tem ajudado mulheres a reduzir medidas em até 30 dias",
          label: "reduzir_medidas" 
        }
      }
    },
    // Experimento 4: P01 CTA Wave rápida
    P01_CTA_COPY: {
      name: "p01_cta_copy",
      active: true,
      allocation: 50, // 50/50 split
      variants: {
        control: { 
          cta: "VER MINHA RECEITA AGORA",
          label: "ver_receita_cta" 
        },
        variant: { 
          cta: "COMEÇAR QUIZ (60s)",
          label: "comecar_quiz_cta" 
        }
      }
    },
    // Experimento 5: P11 CTA Sabores
    P11_CTA_VARIANT: {
      name: "p11_cta_variant",
      active: true,
      allocation: 50, // 50/50 split
      variants: {
        control: { 
          cta: "PERSONALIZAR SABORES",
          label: "control" 
        },
        variant: { 
          cta: "CONFIRMAR SABORES",
          label: "confirmar" 
        }
      }
    }
  },
  // WAVE_2 (preparado, mas DESATIVADO)
  WAVE_2: {
    // Experimento 3: Preço antes do vídeo (preparado)
    SHOW_PRICE_PRE_VIDEO: {
      name: "show_price_prevideo",
      active: false, // DESATIVADO até wave 1 terminar
      allocation: 50,
      variants: {
        control: { show: false, label: "hide_price" },
        variant: { show: true, label: "show_price" }
      }
    },
    // Experimento 4: Estilo dos depoimentos (preparado)
    TESTIMONIAL_STYLE: {
      name: "testimonial_style",
      active: false, // DESATIVADO até wave 1 terminar
      allocation: 50,
      variants: {
        control: { style: "card", label: "card_style" },
        variant: { style: "quote", label: "quote_style" }
      }
    }
  }
};

// Valores default das flags A/B (para desenvolvimento e fallback)
export const AB_TEST_DEFAULTS = {
  [AB_TEST_FLAGS.VSL_GATE]: true,                    // CTA liberado em 9s (control)
  [AB_TEST_FLAGS.SHOW_PRICE_PRE_VIDEO]: false,       // Preço oculto até CTA (control)
  [AB_TEST_FLAGS.ALLOW_SKIP_NAME]: false,            // Nome obrigatório
  [AB_TEST_FLAGS.ALLOW_SKIP_VSL]: false,             // VSL obrigatório
  [AB_TEST_FLAGS.TESTIMONIAL_STYLE]: "card",         // Estilo card (control)
  [AB_TEST_FLAGS.STICKY_CTA_COMPARE]: false,         // CTA normal (control)
  [AB_TEST_FLAGS.INTERPRET_AUTO_ADVANCE]: true,      // Auto-advance ativo
  [AB_TEST_FLAGS.P11_CTA_VARIANT]: "control",        // P11 CTA personalizar (control)
  p01_headline_variant: "original_headline",         // P01 headline default
  p01_cta_copy: "discovery_cta"                      // P01 CTA default
};

// Sistema de alocação experimental
export const getExperimentVariant = (experimentName: string, userId?: string): string => {
  const storedCohort = localStorage.getItem(`experiment_cohort_${experimentName}`);
  if (storedCohort) return storedCohort;
  
  // Determinar cohort baseado no timestamp + userId (para consistência)
  const seed = userId || Date.now().toString();
  const hash = seed.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const variant = Math.abs(hash) % 100 < 50 ? 'control' : 'variant';
  localStorage.setItem(`experiment_cohort_${experimentName}`, variant);
  
  return variant;
};

// Kill switch global para experimentos
export const AB_KILL_SWITCH = {
  GLOBAL_DISABLE: false, // true = desativa TODOS os experimentos
  WAVE_1_DISABLE: false, // true = desativa apenas experimentos da onda 1
  WAVE_2_DISABLE: true   // true = desativa apenas experimentos da onda 2 (default)
};

// Eventos de tracking (Meta/GA)
export const TRACKING_EVENTS = {
  QUIZ_START: "quiz_start",
  HERO_CTA_CLICK: "hero_cta_click",
  SCROLL_DEPTH_25: "scroll_depth_25",
  GOAL_SELECTED: "goal_selected",
  GENDER_SELECTED: "gender_selected", 
  BODY_MAP_SELECTED: "body_map_selected",
  WEIGHT_IMPACT_SELECTED: "weight_impact_selected",
  TRIGGERS_SELECTED: "triggers_selected",
  DIFFICULTIES_SELECTED: "difficulties_selected",
  BARRIERS_SELECTED: "barriers_selected",
  ROUTINE_SELECTED: "routine_selected",
  WATER_INTAKE_SELECTED: "water_intake_selected",
  FRUITS_SELECT: "fruits_select",
  FRUITS_DESELECT: "fruits_deselect",
  FRUITS_SUBMIT: "fruits_submit",
  FRUITS_SELECTED: "fruits_selected", // legacy - manter para compatibilidade
  NAME_CAPTURED: "name_captured",
  VSL_VIEW: "vsl_view",
  VSL_CTA_UNLOCKED: "vsl_cta_unlocked",
  BENEFITS_SELECTED: "benefits_selected",
  TESTIMONIAL_VIEW: "testimonial_view",
  IRR_SCORE_VIEW: "irr_score_view",
  IRR_INTERPRETATION_VIEW: "irr_interpretation_view",
  RITUAL_VIEW: "ritual_view",
  PROGRESS_CURVE_VIEW: "progress_curve_view",
  OBJECTIONS_VIEW: "objections_view",
  TEA_SOLUTION_CTA_CLICK: "tea_solution_cta_click",
  PRE_CHECKOUT_CONFIDENCE_VIEW: "pre_checkout_confidence_view",
  PRE_CHECKOUT_CTA_CLICK: "pre_checkout_cta_click",
  CHECKOUT_VIEW: "checkout_view",
  CHECKOUT_START: "checkout_start",
  PURCHASE: "purchase",
  COMPLETION: "completion",
  THANKYOU_SECONDARY_CTA_CLICK: "thankyou_secondary_cta_click"
};