// DETECÇÃO ROBUSTA DO FLUXO DO USUÁRIO
// Analisa múltiplas fontes para otimizar preload de imagens

export type UserFlow = 'male' | 'female' | 'unknown';

export const detectUserFlow = (): UserFlow => {
  try {
    // 1. Verificar localStorage 'lm_gender' primeiro (mais confiável)
    const lmGender = localStorage.getItem('lm_gender');
    if (lmGender) {
      const parsed = JSON.parse(lmGender);
      if (parsed.gender_id === 'M') return 'male';
      if (parsed.gender_id === 'F') return 'female';
    }

    // 2. Verificar 'nutrition-quiz-data' com múltiplas chaves
    const savedData = localStorage.getItem('nutrition-quiz-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const answers = parsed.answers || [];
      
      // Procurar tanto "Qual é o seu gênero?" quanto "Qual é o seu sexo?"
      const genderAnswer = answers.find((a: any) => 
        a.question === 'Qual é o seu gênero?' || a.question === 'Qual é o seu sexo?'
      );
      
      if (genderAnswer) {
        const answer = genderAnswer.answer;
        if (answer === 'Masculino' || answer === 'Homem') return 'male';
        if (answer === 'Feminino' || answer === 'Mulher') return 'female';
      }
    }
  } catch (error) {
    console.warn('Erro ao detectar fluxo do usuário:', error);
  }
  
  // Se não conseguiu detectar, retorna 'unknown' em vez de assumir
  return 'unknown';
};

export const isGenderKnown = (): boolean => {
  return detectUserFlow() !== 'unknown';
};

export const getFlowSpecificImages = (images: readonly string[], flow: UserFlow): string[] => {
  // Se gênero desconhecido, retorna todas as imagens (não filtra)
  if (flow === 'unknown') {
    return Array.from(images);
  }

  return images.filter((src: string) => {
    // Tags mais robustas baseadas em IDs conhecidos
    if (flow === 'male') {
      // Remove imagens femininas específicas com IDs atualizados
      return !src.includes('female') && 
             !src.includes('99bfc5d4') && // female body map atual
             !src.includes('29d7889c') && // female water atual
             !src.includes('9ea5f56b') && // female idade 18-29
             !src.includes('b06d4142') && // female idade 30-39
             !src.includes('734b1843') && // female idade 40-49
             !src.includes('ad141648') && // female idade 50+
             !src.includes('c24837e6') && // female body type regular
             !src.includes('57837bef') && // female body type barriga falsa
             !src.includes('377a8cff') && // female body type flacida
             !src.includes('40f7afd4');   // female body type sobrepeso
    } else {
      // Remove imagens masculinas específicas com IDs atualizados
      return !src.includes('male') && 
             !src.includes('6c3a3325') && // male body map atual
             !src.includes('f18afb48') && // male water atual
             !src.includes('7573e5f7') && // male idade 18-29
             !src.includes('aa599f6b') && // male idade 30-39
             !src.includes('ff6e48ac') && // male idade 40-49
             !src.includes('5368c3f8') && // male idade 50+
             !src.includes('9d6020ae') && // male body type regular
             !src.includes('d6dd4652') && // male body type barriga falsa
             !src.includes('96f23253') && // male body type flacida
             !src.includes('a3fb2acc');   // male body type sobrepeso
    }
  });
};