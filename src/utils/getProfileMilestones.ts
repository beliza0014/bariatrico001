// Função para obter marcos específicos por perfil
export const getProfileMilestones = (
  irrScore: number, 
  mainBarrier: string
) => {
  const milestones = [];
  
  if (irrScore >= 8) {
    milestones.push(
      { title: 'Primeiros sinais', description: 'Menos inchaço e mais disposição', timeframe: '3-5 dias' },
      { title: 'Mudanças visíveis', description: 'Roupas mais folgadas', timeframe: '8-12 dias' },
      { title: 'Consolidação', description: 'Hábito formado e resultados consistentes', timeframe: '15-20 dias' }
    );
  } else if (irrScore >= 6) {
    milestones.push(
      { title: 'Adaptação inicial', description: 'Corpo se ajusta ao ritual', timeframe: '5-7 dias' },
      { title: 'Benefícios evidentes', description: 'Mais energia e menos fome', timeframe: '12-16 dias' },
      { title: 'Transformação visível', description: 'Mudanças na balança e espelho', timeframe: '20-25 dias' }
    );
  } else {
    milestones.push(
      { title: 'Base sólida', description: 'Construindo consistência', timeframe: '7-10 dias' },
      { title: 'Momentum crescente', description: 'Primeiros resultados aparecem', timeframe: '15-20 dias' },
      { title: 'Transformação sustentável', description: 'Mudança de hábitos consolidada', timeframe: '25-30 dias' }
    );
  }
  
  // Add barrier-specific milestone
  if (mainBarrier === 'falta_tempo') {
    milestones[0].description += ' (só 3 min/dia!)';
  } else if (mainBarrier === 'ansiedade') {
    milestones[1].description += ' + redução da ansiedade';
  }
  
  return milestones;
};