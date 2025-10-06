export type SoundKey =
  | "click"
  | "correct"
  | "transition"
  | "wheel"
  | "confettiPop"
  | "applause"
  | "achievement"
  | "pageOpen";

type PlanEntry = Partial<{
  onSelect: SoundKey;
  onNext: SoundKey;
  onValid: SoundKey;
  onInvalid: SoundKey;
  onEnter: SoundKey;
  onReveal: SoundKey;
  onBonus: SoundKey;
  onShow: SoundKey;
}>;

export type QuizSoundPlan = Record<number, PlanEntry>;

/**
 * Plano de sons para cada uma das 29 páginas.
 * Mantém o mesmo motor, volumes e throttling já existentes.
 */
export const quizSoundPlan: QuizSoundPlan = {
  1:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // landing
  2:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // objetivo_principal
  3:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // genero
  4:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // idade (NEW)
  5:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // mapa_corporal
  6:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // impacto_do_peso
  7:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // gatilhos
  8:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // dificuldades_fisicas
  9:  { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // barreiras
  10: { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // tipo_de_corpo (NEW)
  11: { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // rotina_diaria
  12: { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // consumo_de_agua
  13: { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // preferencias_de_frutas
  14: { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // nome
  15: { onEnter:  "pageOpen", onSelect: "click",    onNext: "transition" }, // vsl_autoridade (video)
  16: { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // altura_peso
  17: { onEnter:  "pageOpen", onReveal: "achievement" },                     // analise_tripla
  18: { onSelect: "click",     onValid: "correct",   onNext: "transition" }, // beneficios
  19: { onSelect: "click",     onNext: "transition" },                       // depoimento
  20: { onEnter:  "pageOpen", onReveal: "achievement" },                     // score_irr
  21: { onSelect: "click",     onNext: "transition" },                       // interpretacao_irr
  22: { onSelect: "click",     onNext: "transition" },                       // ritual_3_passos
  23: { onSelect: "click",     onNext: "transition" },                       // curva_2_4_semanas
  24: { onSelect: "click",     onNext: "transition" },                       // comparacao
  25: { onEnter:  "pageOpen", onSelect: "click",    onNext: "transition" }, // objecoes_condicionais
  26: { onEnter:  "pageOpen", onSelect: "click",    onNext: "transition" }, // pre_checkout
  27: { onEnter:  "pageOpen", onSelect: "click",    onNext: "transition" }, // checkout
  28: { onEnter:  "pageOpen" },                                              // checkout (video)
  29: { onReveal: "confettiPop", onBonus: "achievement", onSelect: "click" } // obrigado
};