// Quiz structure configuration - New reorganized flow
export interface QuizPageConfig {
  id: string;
  type: 'question' | 'info' | 'video' | 'loading' | 'offer' | 'capture';
  component: string;
  headline: string;
  subheadline?: string;
  inputType: 'single' | 'multi' | 'slider' | 'text' | 'none';
  variables: {
    sets: string[];
    reads: string[];
  };
  trackingEvents: string[];
  nextDefault: string | null;
  archived?: boolean;
}

// New quiz order - 31 total pages (added corpo_dos_sonhos, gerando_plano and comparacao)
export const QUIZ_ORDER = [
  "landing", "objetivo_principal", "genero", "mapa_corporal", "idade",
  "meta_peso", "prova_social", "tipo_de_corpo", "corpo_dos_sonhos", "gerando_plano", "comparacao", "rotina_diaria", "barreiras", 
  "gatilhos", "dificuldades_fisicas", "transformacoes", 
  "nome", "vsl_autoridade", "altura_peso", "peso_desejado", "face_transformation", "score_irr",
  "interpretacao_irr", "ritual_3_passos", "consumo_de_agua", "preferencias_de_frutas",
  "beneficios", "objecoes_condicionais", "analise_tripla", 
  "pre_checkout", "checkout", "obrigado"
];

// Archived pages (kept for reference)
export const ARCHIVED_PAGES = [
  "tentativas_anteriores", "solucao_do_cha", "curva_2_4_semanas", "old_page27_checkout"  // Page27Checkout archived after consolidation
];

// Page configurations
export const QUIZ_PAGES: Record<string, QuizPageConfig> = {
  // Existing pages mapped to new structure
  "landing": {
    id: "landing",
    type: "video",
    component: "Page01Landing",
    headline: "Descubra o chá que acelera seu metabolismo",
    inputType: "none",
    variables: { sets: [], reads: [] },
    trackingEvents: ["quiz_start", "video_start"],
    nextDefault: "objetivo_principal"
  },
  "objetivo_principal": {
    id: "objetivo_principal",
    type: "question",
    component: "Page02Question1",
    headline: "Qual o seu objetivo principal?",
    inputType: "single",
    variables: { sets: ["goal"], reads: [] },
    trackingEvents: ["goal_selected"],
    nextDefault: "genero"
  },
  "genero": {
    id: "genero",
    type: "question",
    component: "Page03Question2",
    headline: "Qual é o seu sexo?",
    inputType: "single",
    variables: { sets: ["gender"], reads: [] },
    trackingEvents: ["gender_selected"],
    nextDefault: "mapa_corporal"
  },
  "mapa_corporal": {
    id: "mapa_corporal",
    type: "question",
    component: "Page05BodyMap",
    headline: "Onde você mais acumula gordura?",
    inputType: "single",
    variables: { sets: ["body_map"], reads: ["gender"] },
    trackingEvents: ["body_map_selected"],
    nextDefault: "idade"
  },
  "idade": {
    id: "idade", 
    type: "question",
    component: "Page04Age",
    headline: "Qual sua faixa etária?",
    inputType: "single",
    variables: { sets: ["age"], reads: ["gender"] },
    trackingEvents: ["age_selected"],
    nextDefault: "meta_peso"
  },
  "meta_peso": {
    id: "meta_peso",
    type: "question",
    component: "Page05WeightGoal",
    headline: "Quantos quilos deseja perder?",
    inputType: "single",
    variables: { sets: ["weight_goal"], reads: [] },
    trackingEvents: ["weight_goal_selected"],
    nextDefault: "prova_social"
  },
  "prova_social": {
    id: "prova_social",
    type: "info",
    component: "Page07SocialProof",
    headline: "Veja o Resultado dos Chás Bariátricos",
    inputType: "none",
    variables: { sets: [], reads: [] },
    trackingEvents: ["social_proof_view"],
    nextDefault: "gatilhos"
  },
  "gatilhos": {
    id: "gatilhos",
    type: "question",
    component: "Page07WeightTriggers",
    headline: "O que mais te incomoda atualmente?",
    inputType: "single",
    variables: { sets: ["weight_triggers"], reads: ["gender"] },
    trackingEvents: ["triggers_selected"],
    nextDefault: "dificuldades_fisicas"
  },
  "dificuldades_fisicas": {
    id: "dificuldades_fisicas",
    type: "question",
    component: "Page11PhysicalDifficulties",
    headline: "Quais dificuldades você enfrenta no dia a dia?",
    inputType: "multi",
    variables: { sets: ["physical_difficulties"], reads: ["gender"] },
    trackingEvents: ["difficulties_selected"],
    nextDefault: "transformacoes"
  },
  "transformacoes": {
    id: "transformacoes",
    type: "info",
    component: "Page19TestimonialNew",
    headline: "Transformações que inspiram mudanças",
    inputType: "none",
    variables: { sets: [], reads: ["gender"] },
    trackingEvents: ["transformations_view"],
    nextDefault: "consumo_de_agua"
  },
  "barreiras": {
    id: "barreiras",
    type: "question",
    component: "Page09WeightLossBarriers",
    headline: "O que mais te sabota na hora H de emagrecer?",
    inputType: "multi",
    variables: { sets: ["barreiras"], reads: ["gender"] },
    trackingEvents: ["barriers_selected"],
    nextDefault: "tipo_de_corpo"
  },
  "tipo_de_corpo": {
    id: "tipo_de_corpo",
    type: "question", 
    component: "Page10BodyType",
    headline: "Qual seu tipo de corpo?",
    inputType: "single",
    variables: { sets: ["body_type"], reads: ["gender"] },
    trackingEvents: ["body_type_selected"],
    nextDefault: "corpo_dos_sonhos"
  },
  "corpo_dos_sonhos": {
    id: "corpo_dos_sonhos",
    type: "question",
    component: "Page09DreamBody",
    headline: "Qual é o seu corpo de sonho?",
    inputType: "single",
    variables: { sets: ["dream_body"], reads: ["gender"] },
    trackingEvents: ["dream_body_selected"],
    nextDefault: "gerando_plano"
  },
  "gerando_plano": {
    id: "gerando_plano",
    type: "loading",
    component: "Page09LoadingPersonalizedPlan",
    headline: "Gerando seu Plano Personalizado",
    inputType: "none",
    variables: { sets: [], reads: [] },
    trackingEvents: ["generating_plan"],
    nextDefault: "comparacao"
  },
  "comparacao": {
    id: "comparacao",
    type: "info",
    component: "Page24Comparison",
    headline: "Seu plano foi gerado com base no seu perfil",
    inputType: "none",
    variables: { sets: [], reads: ["name", "gender", "body_type", "dream_body"] },
    trackingEvents: ["comparison_view"],
    nextDefault: "rotina_diaria"
  },
  "rotina_diaria": {
    id: "rotina_diaria",
    type: "question",
    component: "Page08DailyRoutine",
    headline: "Como é sua rotina diária?",
    inputType: "single",
    variables: { sets: ["daily_routine"], reads: ["gender"] },
    trackingEvents: ["routine_selected"],
    nextDefault: "consumo_de_agua"
  },
  "consumo_de_agua": {
    id: "consumo_de_agua",
    type: "question",
    component: "Page12WaterIntake",
    headline: "Quantos copos de água você bebe por dia?",
    inputType: "single",
    variables: { sets: ["water_intake"], reads: ["gender"] },
    trackingEvents: ["water_intake_selected"],
    nextDefault: "preferencias_de_frutas"
  },
  "preferencias_de_frutas": {
    id: "preferencias_de_frutas",
    type: "question",
    component: "Page13FruitPreferences",
    headline: "Quais sabores vão deixar sua jornada mais gostosa?",
    inputType: "multi",
    variables: { sets: ["fruit_preferences"], reads: [] },
    trackingEvents: ["fruits_selected"],
    nextDefault: "beneficios"
  },
  "nome": {
    id: "nome",
    type: "capture",
    component: "Page14NameInput",
    headline: "Qual é o seu nome?",
    inputType: "text",
    variables: { sets: ["name"], reads: [] },
    trackingEvents: ["name_captured"],
    nextDefault: "vsl_autoridade"
  },
  "vsl_autoridade": {
    id: "vsl_autoridade",
    type: "video",
    component: "Page15VSLNutritionistAuthority",
    headline: "Mensagem da nossa nutricionista",
    inputType: "none",
    variables: { sets: [], reads: ["name", "gender"] },
    trackingEvents: ["vsl_view", "video_start"],
    nextDefault: "altura_peso"
  },
  "altura_peso": {
    id: "altura_peso",
    type: "capture", 
    component: "Page19HeightWeight",
    headline: "Qual sua altura e peso atual?",
    inputType: "none",
    variables: { sets: ["height", "weight"], reads: [] },
    trackingEvents: ["height_weight_captured"],
    nextDefault: "peso_desejado"
  },
  "peso_desejado": {
    id: "peso_desejado",
    type: "capture",
    component: "Page20DesiredWeight", 
    headline: "Qual é o seu peso desejado?",
    inputType: "text",
    variables: { sets: ["desired_weight"], reads: [] },
    trackingEvents: ["desired_weight_captured"],
    nextDefault: "analise_tripla"
  },
  "analise_tripla": {
    id: "analise_tripla",
    type: "loading",
    component: "Page17TripleAnalysis", 
    headline: "Processando seus dados...",
    inputType: "none",
    variables: { sets: [], reads: ["height", "weight", "age", "body_type"] },
    trackingEvents: ["analysis_complete"],
    nextDefault: "beneficios"
  },
  "beneficios": {
    id: "beneficios",
    type: "question",
    component: "Page18DesiredBenefits",
    headline: "Quais benefícios você mais deseja?",
    inputType: "multi",
    variables: { sets: ["desired_benefits"], reads: ["gender"] },
    trackingEvents: ["benefits_selected"],
    nextDefault: "objecoes_condicionais"
  },
  "depoimento": {
    id: "depoimento",
    type: "info",
    component: "Page19Testimonial",
    headline: "Veja o resultado da Deyse",
    inputType: "none",
    variables: { sets: [], reads: ["gender"] },
    trackingEvents: ["testimonial_view"],
    nextDefault: "score_irr",
    archived: true
  },
  "score_irr": {
    id: "score_irr",
    type: "loading",
    component: "Page20ScoreIRR",
    headline: "Calculando seu Índice de Resistência à Insulina",
    inputType: "none",
    variables: { sets: ["irr_score"], reads: ["age", "body_type", "daily_routine", "physical_difficulties"] },
    trackingEvents: ["irr_calculated"],
    nextDefault: "interpretacao_irr"
  },
  "interpretacao_irr": {
    id: "interpretacao_irr",
    type: "info",
    component: "Page21InterpretacaoIRR",
    headline: "Interpretação do seu IRR",
    inputType: "none",
    variables: { sets: [], reads: ["irr_score", "name", "gender"] },
    trackingEvents: ["irr_interpretation_view"],
    nextDefault: "ritual_3_passos"
  },
  "ritual_3_passos": {
    id: "ritual_3_passos",
    type: "info",
    component: "Page22Ritual3Passos",
    headline: "Seu Ritual Personalizado em 3 Passos",
    inputType: "none",
    variables: { sets: [], reads: ["name", "daily_routine", "fruit_preferences"] },
    trackingEvents: ["ritual_view"],
    nextDefault: "consumo_de_agua"
  },
  "objecoes_condicionais": {
    id: "objecoes_condicionais",
    type: "info",
    component: "Page23ObjecoesCondicionais",
    headline: "Sua solução personalizada",
    subheadline: "Resolvendo sua principal barreira",
    inputType: "none",
    variables: { sets: [], reads: ["barreiras", "name", "gender"] },
    trackingEvents: ["objections_unified_view"],
    nextDefault: "face_transformation"
  },
  "face_transformation": {
    id: "face_transformation",
    type: "info",
    component: "Page24FaceTransformation",
    headline: "Veja como a perda de peso pode mudar o seu rosto",
    inputType: "none",
    variables: { sets: [], reads: ["name", "gender"] },
    trackingEvents: ["face_transformation_view"],
    nextDefault: "pre_checkout"
  },
  "pre_checkout": {
    id: "pre_checkout",
    type: "info",
    component: "Page25PreCheckout",
    headline: "Sua receita personalizada está pronta",
    inputType: "none",
    variables: { sets: [], reads: ["name", "desired_benefits", "barreiras", "fruit_preferences", "goal"] },
    trackingEvents: ["precheckout_view"],
    nextDefault: "checkout"
  },
  "checkout": {
    id: "checkout",
    type: "offer",
    component: "Page26Checkout",
    headline: "Oferta Exclusiva - Página Consolidada",
    inputType: "none",
    variables: { sets: [], reads: ["name", "gender", "barreiras"] },
    trackingEvents: ["checkout_consolidated_view"],
    nextDefault: "obrigado"
  },
  "obrigado": {
    id: "obrigado",
    type: "info",
    component: "Page27ThankYou",
    headline: "Obrigado!",
    inputType: "none",
    variables: { sets: [], reads: ["name"] },
    trackingEvents: ["completion"],
    nextDefault: null
  }
};

// Helper function to get page index in new order
export const getPageIndex = (pageId: string): number => {
  return QUIZ_ORDER.indexOf(pageId) + 1;
};

// Helper function to get page by index
export const getPageById = (pageId: string): QuizPageConfig | undefined => {
  return QUIZ_PAGES[pageId];
};

// Helper function to get next page
export const getNextPageId = (currentPageId: string): string | null => {
  const currentIndex = QUIZ_ORDER.indexOf(currentPageId);
  if (currentIndex === -1 || currentIndex === QUIZ_ORDER.length - 1) {
    return null;
  }
  return QUIZ_ORDER[currentIndex + 1];
};

// Total steps in new flow  
export const TOTAL_STEPS = QUIZ_ORDER.length; // 31 steps (with corpo_dos_sonhos, gerando_plano and comparacao)
