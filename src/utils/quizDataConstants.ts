// Constantes canônicas para padronizar acesso aos dados do quiz
// Estas chaves DEVEM corresponder EXATAMENTE às colunas do banco lead_insights
export const QUIZ_DATA_KEYS = {
  // Identificação
  NAME: 'nome',
  CONTACT: 'contato',
  
  // Perfil básico
  GENDER: 'genero',
  AGE: 'idade',
  BODY_MAP: 'mapa_corporal',
  
  // Objetivos e metas
  GOAL_PRIMARY: 'objetivo_principal',
  WEIGHT_GOAL: 'meta_peso',
  
  // Corpo e aparência
  BODY_TYPE: 'tipo_de_corpo',
  DREAM_BODY: 'corpo_dos_sonhos',
  
  // Dificuldades e barreiras (arrays)
  PHYSICAL_DIFFICULTIES: 'dificuldades_fisicas',
  BARRIERS: 'barreiras',
  TRIGGERS: 'gatilhos',
  
  // Rotina e hábitos
  DAILY_ROUTINE: 'rotina_diaria',
  WATER_INTAKE: 'consumo_de_agua',
  FRUIT_PREFERENCES: 'preferencias_de_frutas',
  
  // Medidas (numeric)
  HEIGHT: 'altura',
  WEIGHT: 'peso',
  DESIRED_WEIGHT: 'peso_desejado',
  
  // Benefícios e análise
  DESIRED_BENEFITS: 'beneficios',
  IRR_SCORE: 'irr_score'
} as const;

export const WATER_INTAKE_LABELS = {
  '0_2_copos': '0-2 copos/dia',
  '3_4_copos': '3-4 copos/dia', 
  '5_6_copos': '5-6 copos/dia',
  '7_mais_copos': '7+ copos/dia',
  'nao_sei_varia': 'quantidade variada'
} as const;

export const ROUTINE_LABELS = {
  'morning_rush': 'manhã corrida',
  'afternoon_free': 'tarde livre', 
  'night_free': 'noite livre',
  'shift_work': 'turno variado',
  'weekend_focus': 'foco no fim de semana',
  'trabalho_fora_agitada': 'trabalho fora com rotina agitada',
  'trabalho_casa_flexivel': 'trabalho em casa com rotina flexível',
  'casa_cuidando_familia': 'em casa cuidando da família',
  'outro': 'outra situação'
} as const;

export const SLEEP_HOURS_LABELS = {
  'menos_5_horas': 'menos de 5 horas',
  'entre_5_7_horas': 'entre 5 e 7 horas',
  'entre_7_9_horas': 'entre 7 e 9 horas',
  'mais_9_horas': 'mais de 9 horas'
} as const;

export const BARRIER_LABELS = {
  'falta_tempo': 'falta de tempo',
  'ansiedade': 'ansiedade',
  'falta_constancia': 'falta de constância',
  'falta_apoio': 'falta de apoio',
  'orcamento_curto': 'orçamento curto'
} as const;

// Utilitário para obter dados do quiz de forma consistente
export const getQuizData = (getAnswer: Function, key: string) => {
  const answer = getAnswer(key);
  const value = Array.isArray(answer?.answer) ? answer?.answer[0] : answer?.answer;
  return { raw: answer, value, array: Array.isArray(answer?.answer) ? answer?.answer : [value] };
};