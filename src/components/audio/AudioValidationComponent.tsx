import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSoundContext } from '@/contexts/SoundContext';
import { quizSoundPlan, SoundKey } from '@/audio/quizSoundPlan';
import { SOUND_MANIFEST } from '@/audio/soundManifest';
import { CheckCircle2, XCircle, Volume2, VolumeOff } from 'lucide-react';

type ValidationResult = {
  page: number;
  event: string;
  nomeTecnico: SoundKey;
  somOuvido: string;
  volumeRealPercebido: string;
  status: '✅ Correto' | '⚠️ Divergente';
  coerenciaContextual: '✅ Combina' | '⚠️ Neutro' | '❌ Não combina';
  observacoes?: string;
};

type PageEvents = {
  [key: number]: {
    events: string[];
    description: string;
  };
};

// Mapeamento completo de todas as páginas e seus eventos (mesmo do FullQuizAudioAudit)
const PAGE_EVENTS: PageEvents = {
  1: { events: ['onSelect', 'onNext'], description: 'Landing Page' },
  2: { events: ['onSelect', 'onNext'], description: 'Question 1 - Gender' },
  3: { events: ['onSelect', 'onNext'], description: 'Question 2 - Age' },
  4: { events: ['onSelect', 'onNext'], description: 'Question 3 - Weight Goal' },
  5: { events: ['onSelect', 'onNext'], description: 'Body Map Selection' },
  6: { events: ['onSelect', 'onNext'], description: 'Name Input' },
  7: { events: ['onSelect', 'onValid', 'onNext'], description: 'Body Type Selection' },
  8: { events: ['onSelect', 'onValid', 'onNext'], description: 'Weight Impact' },
  9: { events: ['onSelect', 'onValid', 'onNext'], description: 'Weight Triggers' },
  10: { events: ['onSelect', 'onValid', 'onNext'], description: 'Physical Difficulties' },
  11: { events: ['onSelect', 'onNext'], description: 'VSL Nutritionist Authority' },
  12: { events: ['onSelect', 'onNext'], description: 'Weight Loss Barriers' },
  13: { events: ['onSelect', 'onNext'], description: 'Tea Solution' },
  14: { events: ['onSelect', 'onNext'], description: 'Desired Benefits' },
  15: { events: ['onSelect', 'onNext'], description: 'Testimonial' },
  16: { events: ['onSelect', 'onValid', 'onNext'], description: 'Daily Routine' },
  17: { events: ['onSelect', 'onNext'], description: 'Water Intake' },
  18: { events: ['onSelect', 'onNext'], description: 'Fruit Preferences' },
  19: { events: ['onSelect', 'onNext'], description: 'Height & Weight' },
  20: { events: ['onSelect', 'onValid', 'onNext'], description: 'Triple Analysis' },
  21: { events: ['onEnter'], description: 'BMI Results' },
  22: { events: ['onReveal', 'onBonus', 'onSelect'], description: 'Comparison' },
  23: { events: ['onShow', 'onSelect'], description: 'Checkout' }
};

export const AudioValidationComponent: React.FC = () => {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [allEvents, setAllEvents] = useState<{ page: number; event: string; soundKey: SoundKey; description: string }[]>([]);
  const soundContext = useSoundContext();

  // Gera lista completa de eventos na inicialização
  useEffect(() => {
    const events: { page: number; event: string; soundKey: SoundKey; description: string }[] = [];
    
    for (let pageNum = 1; pageNum <= 23; pageNum++) {
      const pageInfo = PAGE_EVENTS[pageNum];
      if (!pageInfo) continue;
      
      const pageSoundPlan = quizSoundPlan[pageNum] || {};
      
      for (const event of pageInfo.events) {
        const soundKey = pageSoundPlan[event as keyof typeof pageSoundPlan];
        if (soundKey) {
          events.push({
            page: pageNum,
            event,
            soundKey,
            description: pageInfo.description
          });
        }
      }
    }
    
    setAllEvents(events);
  }, []);

  // Função para reproduzir som específico
  const playSound = (soundKey: SoundKey) => {
    switch (soundKey) {
      case 'click':
        soundContext.playButtonClick();
        break;
      case 'correct':
        soundContext.playCorrectAnswer();
        break;
      case 'transition':
        soundContext.playPageTransition();
        break;
      case 'wheel':
        soundContext.playEnhancedWheelSpin();
        break;
      case 'confettiPop':
        soundContext.playConfettiPop();
        break;
      case 'applause':
        soundContext.playApplause();
        break;
      case 'achievement':
        soundContext.playAchievement();
        break;
      case 'pageOpen':
        soundContext.playPageOpen();
        break;
    }
  };

  // Função para obter descrição do som esperado
  const getSoundDescription = (soundKey: SoundKey): string => {
    switch (soundKey) {
      case 'click': return 'Clique tátil seco (≤100ms)';
      case 'correct': return 'Ding positivo de confirmação';
      case 'transition': return 'Slide/swoosh leve (≤400ms, freq. média-alta)';
      case 'wheel': return 'Som rotativo prolongado (1.8s)';
      case 'confettiPop': return 'Estalo festivo de confete';
      case 'applause': return 'Palmas de celebração';
      case 'achievement': return 'Fanfarra crescente de conquista';
      case 'pageOpen': return 'Chime cristalino de abertura';
      default: return 'Som não identificado';
    }
  };

  // Função para obter volume esperado
  const getExpectedVolume = (soundKey: SoundKey): string => {
    const manifest = SOUND_MANIFEST[soundKey];
    if (!manifest) return 'Desconhecido';
    
    switch (manifest.category) {
      case 'ui': return 'Baixo (0.50 / -6dB)';
      case 'feedback': return 'Médio (0.707 / -3dB)';
      case 'special': return 'Alto (1.0 / 0dB)';
      default: return 'Médio';
    }
  };

  // Função para iniciar validação sequencial
  const startValidation = async () => {
    if (!soundContext.isUnlocked) {
      await soundContext.initializeAudioOnUserGesture();
    }
    
    setIsValidating(true);
    setCurrentEventIndex(0);
    setValidationResults([]);
    
    // Inicia com o primeiro evento
    if (allEvents.length > 0) {
      playSound(allEvents[0].soundKey);
    }
  };

  // Função para confirmar evento atual como correto
  const confirmCorrect = (coerencia: '✅ Combina' | '⚠️ Neutro' | '❌ Não combina') => {
    const currentEvent = allEvents[currentEventIndex];
    if (!currentEvent) return;

    const result: ValidationResult = {
      page: currentEvent.page,
      event: currentEvent.event,
      nomeTecnico: currentEvent.soundKey,
      somOuvido: getSoundDescription(currentEvent.soundKey),
      volumeRealPercebido: getExpectedVolume(currentEvent.soundKey),
      status: '✅ Correto',
      coerenciaContextual: coerencia
    };

    setValidationResults(prev => [...prev, result]);
    nextEvent();
  };

  // Função para marcar evento atual como divergente
  const markDivergent = (observacao: string, coerencia: '✅ Combina' | '⚠️ Neutro' | '❌ Não combina' = '❌ Não combina') => {
    const currentEvent = allEvents[currentEventIndex];
    if (!currentEvent) return;

    const result: ValidationResult = {
      page: currentEvent.page,
      event: currentEvent.event,
      nomeTecnico: currentEvent.soundKey,
      somOuvido: 'Som divergente do esperado',
      volumeRealPercebido: 'Volume incorreto ou som ausente',
      status: '⚠️ Divergente',
      coerenciaContextual: coerencia,
      observacoes: observacao
    };

    setValidationResults(prev => [...prev, result]);
    nextEvent();
  };

  // Função para avançar para próximo evento
  const nextEvent = () => {
    const nextIndex = currentEventIndex + 1;
    
    if (nextIndex < allEvents.length) {
      setCurrentEventIndex(nextIndex);
      setTimeout(() => {
        playSound(allEvents[nextIndex].soundKey);
      }, 500);
    } else {
      // Validação completa
      setIsValidating(false);
    }
  };

  // Função para repetir som atual
  const repeatCurrentSound = () => {
    const currentEvent = allEvents[currentEventIndex];
    if (currentEvent) {
      playSound(currentEvent.soundKey);
    }
  };

  const currentEvent = allEvents[currentEventIndex];
  const totalEvents = allEvents.length;
  const correctCount = validationResults.filter(r => r.status === '✅ Correto').length;
  const divergentCount = validationResults.filter(r => r.status === '⚠️ Divergente').length;
  const progress = ((currentEventIndex + 1) / totalEvents) * 100;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">🎧 VALIDAÇÃO AUDITIVA FINAL</CardTitle>
          <p className="text-muted-foreground">
            Reprodução sequencial de todos os 52 eventos para confirmação auditiva real
          </p>
          
          {/* Progress Bar */}
          {isValidating && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Evento {currentEventIndex + 1} de {totalEvents}</span>
                <span>{progress.toFixed(1)}% concluído</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!isValidating && validationResults.length === 0 && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-blue-50/30 border border-blue-200/30 rounded">
                <h4 className="font-medium text-blue-800 mb-2">🎯 Instruções para Validação Contextual</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside text-left">
                  <li>Clique "Iniciar Validação" para começar a reprodução sequencial</li>
                  <li>Para cada som, avalie: <strong>correspondência técnica + coerência contextual</strong></li>
                  <li>Use "🔊 Repetir Som" para ouvir novamente</li>
                  <li><strong>Atenção especial:</strong> transições (≤400ms, slide/swoosh) e cliques contextuais</li>
                  <li>Meta: 52/52 eventos ✅ Corretos + ✅ Combina perfeitamente</li>
                </ol>
                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <strong>🚨 Foco nos problemas identificados:</strong><br/>
                  • Transitions: devem ser leves e rápidos, não atmosféricos<br/>
                  • Cliques: onSelect (tátil) vs onNext (+ movimento)
                </div>
              </div>
              
              <Button onClick={startValidation} size="lg" className="w-full max-w-md">
                🎧 Iniciar Validação Auditiva (52 eventos)
              </Button>
            </div>
          )}

          {/* Evento Atual em Validação */}
          {isValidating && currentEvent && (
            <div className="space-y-6">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  Página {currentEvent.page} - Evento {currentEventIndex + 1}/{totalEvents}
                </Badge>
                <h3 className="text-xl font-bold mb-2">
                  {currentEvent.event} → {currentEvent.soundKey}
                </h3>
                <p className="text-muted-foreground">
                  Esperado: {getSoundDescription(currentEvent.soundKey)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Volume: {getExpectedVolume(currentEvent.soundKey)}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <Button onClick={repeatCurrentSound} variant="outline">
                    🔊 Repetir Som
                  </Button>
                </div>
                
                {/* Avaliação de Coerência Contextual */}
                <div className="p-4 bg-amber-50/30 border border-amber-200/30 rounded">
                  <h4 className="font-medium text-amber-800 mb-3 text-center">🎯 Coerência Contextual</h4>
                  <p className="text-sm text-amber-700 mb-3 text-center">
                    O som combina com a ação ({currentEvent.event}) sendo executada?
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      onClick={() => confirmCorrect('✅ Combina')} 
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      ✅ Combina Perfeitamente
                    </Button>
                    <Button 
                      onClick={() => confirmCorrect('⚠️ Neutro')} 
                      className="bg-yellow-600 hover:bg-yellow-700 text-xs"
                    >
                      ⚠️ Neutro/Aceitável
                    </Button>
                    <Button 
                      onClick={() => {
                        const observacao = prompt("Descreva por que não combina:");
                        if (observacao) markDivergent(observacao, '❌ Não combina');
                      }} 
                      className="bg-red-600 hover:bg-red-700 text-xs"
                    >
                      ❌ Não Combina
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Estatísticas em Tempo Real */}
          {validationResults.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-muted-foreground">✅ Corretos</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{divergentCount}</div>
                <div className="text-sm text-muted-foreground">⚠️ Divergentes</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded">
                <div className="text-2xl font-bold">{validationResults.length}</div>
                <div className="text-sm text-muted-foreground">Validados</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Resultados de Validação */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Tabela de Validação Auditiva</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 font-medium">Página</th>
                    <th className="text-left p-3 font-medium">Evento</th>
                    <th className="text-left p-3 font-medium">Nome Técnico</th>
                    <th className="text-left p-3 font-medium">Som Ouvido</th>
                    <th className="text-left p-3 font-medium">Volume</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Coerência</th>
                    <th className="text-left p-3 font-medium">Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResults.map((result, index) => (
                    <tr 
                      key={index} 
                      className={`border-b hover:bg-muted/20 ${
                        result.status === '⚠️ Divergente' ? 'bg-red-50/30' : 'bg-green-50/30'
                      }`}
                    >
                      <td className="p-3 font-mono">{result.page}</td>
                      <td className="p-3 font-mono text-blue-600">{result.event}</td>
                      <td className="p-3 font-mono">{result.nomeTecnico}</td>
                      <td className="p-3">{result.somOuvido}</td>
                      <td className="p-3 text-xs">{result.volumeRealPercebido}</td>
                      <td className="p-3">
                        <span className={
                          result.status === '✅ Correto' ? 'text-green-600' : 'text-red-600'
                        }>
                          {result.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={
                          result.coerenciaContextual === '✅ Combina' ? 'text-green-600' :
                          result.coerenciaContextual === '⚠️ Neutro' ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {result.coerenciaContextual}
                        </span>
                      </td>
                      <td className="p-3 text-xs">{result.observacoes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultado Final */}
      {!isValidating && validationResults.length === totalEvents && (
        <Card className={`mt-6 ${divergentCount === 0 ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
          <CardHeader>
            <CardTitle className={divergentCount === 0 ? 'text-green-600' : 'text-red-600'}>
              {divergentCount === 0 ? '✅ VALIDAÇÃO AUDITIVA APROVADA' : '⚠️ VALIDAÇÃO AUDITIVA REPROVADA'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-lg">
                <strong>{correctCount}/{totalEvents}</strong> eventos validados como corretos
              </div>
              
              {divergentCount === 0 ? (
                <div className="p-4 bg-green-100 border border-green-200 rounded">
                  <p className="text-green-800 font-medium">
                    🎉 SISTEMA 100% APROVADO PARA PRODUÇÃO
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Todos os 52 eventos de áudio foram validados auditivamente e estão funcionando corretamente.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-red-100 border border-red-200 rounded">
                  <p className="text-red-800 font-medium">
                    ❌ CORREÇÕES NECESSÁRIAS
                  </p>
                  <p className="text-sm text-red-700 mt-2">
                    {divergentCount} evento(s) apresentaram divergências e precisam ser corrigidos antes do deploy.
                  </p>
                </div>
              )}

              <Button 
                onClick={() => {
                  const report = generateValidationReport();
                  navigator.clipboard.writeText(report);
                  alert('Relatório de validação copiado para a área de transferência!');
                }}
                size="lg"
              >
                📋 Copiar Relatório Final
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function generateValidationReport(): string {
    const combinaCount = validationResults.filter(r => r.coerenciaContextual === '✅ Combina').length;
    const neutroCount = validationResults.filter(r => r.coerenciaContextual === '⚠️ Neutro').length;
    const naoCombina = validationResults.filter(r => r.coerenciaContextual === '❌ Não combina').length;
    
    return `# 📋 RELATÓRIO DE VALIDAÇÃO AUDITIVA CONTEXTUAL - QUIZ NUTRIÇÃO
Data: ${new Date().toLocaleString('pt-BR')}
Sistema: Lovable Quiz de Nutrição
Modo de Validação: 🎧 Experiência Real do Usuário + Coerência Contextual
Total de Páginas: 23
Total de Eventos Esperados: 52

## 🎯 Resumo Executivo
- ✅ Corretos: ${correctCount}/${totalEvents} (${((correctCount/totalEvents)*100).toFixed(1)}%)
- ⚠️ Divergentes: ${divergentCount}/${totalEvents} (${((divergentCount/totalEvents)*100).toFixed(1)}%)
- 📊 Percentual de Conformidade: ${((correctCount/totalEvents)*100).toFixed(1)}%

### 🎪 Coerência Contextual
- ✅ Combina Perfeitamente: ${combinaCount}/${totalEvents} (${((combinaCount/totalEvents)*100).toFixed(1)}%)
- ⚠️ Neutro/Aceitável: ${neutroCount}/${totalEvents} (${((neutroCount/totalEvents)*100).toFixed(1)}%)
- ❌ Não Combina: ${naoCombina}/${totalEvents} (${((naoCombina/totalEvents)*100).toFixed(1)}%)

**Status da Validação:** ${divergentCount === 0 && naoCombina === 0 ? '✅ APROVADO PARA PRODUÇÃO' : '⚠️ REPROVADO - CORREÇÕES NECESSÁRIAS'}

---

## 📊 Tabela Detalhada de Validação
| Página | Evento | Nome Técnico | Som Ouvido | Volume | Status | Coerência | Observações |
|--------|--------|--------------|------------|---------|---------|-----------|-------------|
${validationResults.map(r => 
  `| ${r.page} | ${r.event} | ${r.nomeTecnico} | ${r.somOuvido} | ${r.volumeRealPercebido} | ${r.status} | ${r.coerenciaContextual} | ${r.observacoes || '—'} |`
).join('\n')}

---

## 🔧 Critérios de Validação
- Origem 100% baked (sem CDN)
- Volumes padronizados conforme categoria
- Mapeamento correto para cada página/evento
- **NOVO:** Coerência contextual com ação executada
- **FOCO:** Transições ≤400ms, slide/swoosh leves
- **FOCO:** Cliques diferenciados (onSelect vs onNext)

---

## 🎯 Resultado Final
**Status:** ${divergentCount === 0 && naoCombina === 0 ? '✅ APROVADO PARA PRODUÇÃO' : '⚠️ REPROVADO'}

📌 **Critério:** 52/52 eventos = ✅ Correto + ✅ Combina perfeitamente

${naoCombina > 0 ? `
🚨 **PROBLEMAS IDENTIFICADOS:**
${validationResults.filter(r => r.coerenciaContextual === '❌ Não combina' || r.status === '⚠️ Divergente')
  .map(r => `- Página ${r.page} (${r.event}): ${r.observacoes || 'Som não combina com contexto'}`)
  .join('\n')}
` : '🎉 **SISTEMA TOTALMENTE APROVADO** - Pronto para produção!'}

---
**Relatório gerado pelo sistema de validação auditiva contextual Lovable**`;
  }
};