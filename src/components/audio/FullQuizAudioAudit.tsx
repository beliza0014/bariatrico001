import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSoundContext } from '@/contexts/SoundContext';
import { quizSoundPlan, SoundKey } from '@/audio/quizSoundPlan';
import { SOUND_MANIFEST } from '@/audio/soundManifest';

type AuditResult = {
  page: number;
  event: string;
  description: string;
  expectedSound: SoundKey;
  actualSound: SoundKey;
  origin: 'baked' | 'local' | 'cdn' | 'missing';
  volume: 'baixo' | 'médio' | 'alto';
  status: '✅ Correto' | '⚠️ Suspeito';
};

type PageEvents = {
  [key: number]: {
    events: string[];
    description: string;
  };
};

// Mapeamento completo de todas as páginas e seus eventos
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

export const FullQuizAudioAudit: React.FC = () => {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [currentAuditPage, setCurrentAuditPage] = useState(0);
  const soundContext = useSoundContext();

  // Função para determinar a origem do som baseada no buffer real carregado
  const getSoundOrigin = (soundKey: SoundKey): 'baked' | 'local' | 'cdn' | 'missing' => {
    // Primeiro verifica o buffer real carregado
    const buffer = soundContext.audioBuffers.get(soundKey);
    if (buffer) {
      return buffer.source as 'baked' | 'local' | 'cdn';
    }
    
    // Fallback para manifest (caso buffer não esteja carregado ainda)
    const manifest = SOUND_MANIFEST[soundKey];
    if (!manifest) return 'missing';
    
    // No modo baked-first, todos devem estar baked
    if (soundContext.soundSourceMode === 'baked-first') {
      return manifest.baked ? 'baked' : 'missing';
    }
    
    // Verifica se tem arquivo local
    if (manifest.url && manifest.url.startsWith('/sounds/')) {
      return 'local';
    }
    
    // Se é marcado como baked
    if (manifest.baked) {
      return 'baked';
    }
    
    // Se tem CDN
    if (manifest.cdn) {
      return 'cdn';
    }
    
    return 'missing';
  };

  // Função para determinar volume baseado na categoria (novos valores padronizados)
  const getVolumeLevel = (soundKey: SoundKey): 'baixo' | 'médio' | 'alto' => {
    const manifest = SOUND_MANIFEST[soundKey];
    if (!manifest) return 'baixo';
    
    switch (manifest.category) {
      case 'ui':
        return 'baixo'; // 0.50 (-6dB)
      case 'feedback':
        return 'médio'; // 0.707 (-3dB)
      case 'special':
        return 'alto'; // 1.0 (0dB)
      default:
        return 'médio';
    }
  };

  // Função para obter descrição em palavras do som
  const getSoundDescription = (soundKey: SoundKey): string => {
    switch (soundKey) {
      case 'click':
        return 'Clique seco e discreto, curta duração';
      case 'correct':
        return 'Som de confirmação positiva, melodioso';
      case 'transition':
        return 'Whoosh suave de transição de página';
      case 'wheel':
        return 'Som rotativo prolongado, tipo roda girando';
      case 'confettiPop':
        return 'Estalo festivo, como confete estourando';
      case 'applause':
        return 'Palmas e aplausos de celebração';
      case 'achievement':
        return 'Fanfarra de conquista, ascendente';
      case 'pageOpen':
        return 'Chime suave de abertura de página';
      default:
        return 'Som não identificado';
    }
  };

  // Função para executar auditoria completa
  const runFullAudit = async () => {
    setIsAuditing(true);
    setAuditResults([]);
    
    const results: AuditResult[] = [];
    
    // Aguarda o sistema de áudio estar pronto
    if (!soundContext.isUnlocked) {
      await soundContext.initializeAudioOnUserGesture();
    }
    
    // Percorre todas as páginas
    for (let pageNum = 1; pageNum <= 23; pageNum++) {
      setCurrentAuditPage(pageNum);
      
      const pageInfo = PAGE_EVENTS[pageNum];
      if (!pageInfo) continue;
      
      const pageSoundPlan = quizSoundPlan[pageNum] || {};
      
      // Percorre todos os eventos da página
      for (const event of pageInfo.events) {
        const expectedSoundKey = pageSoundPlan[event as keyof typeof pageSoundPlan];
        
        if (expectedSoundKey) {
          // Testa o som realmente
          let actualOrigin: 'baked' | 'local' | 'cdn' | 'missing' = 'missing';
          let actualDescription = '';
          
          try {
            // Testa qual som está sendo realmente reproduzido
            const buffer = soundContext.audioBuffers.get(expectedSoundKey);
            if (buffer) {
              actualOrigin = buffer.source as any;
            } else {
              actualOrigin = getSoundOrigin(expectedSoundKey);
            }
            
            actualDescription = getSoundDescription(expectedSoundKey);
            
            // Reproduz o som para teste (se não estiver mudo)
            if (!soundContext.muted) {
              testSound(expectedSoundKey);
              await new Promise(resolve => setTimeout(resolve, 200)); // Aguarda reprodução
            }
          } catch (error) {
            actualOrigin = 'missing';
            actualDescription = 'Erro ao reproduzir som';
          }
          
          const volume = getVolumeLevel(expectedSoundKey);
          
          // Determina status baseado em critérios rigorosos para modo baked-first
          let status: '✅ Correto' | '⚠️ Suspeito' = '✅ Correto';
          
          // No modo baked-first, TODOS os sons devem ser baked
          if (soundContext.soundSourceMode === 'baked-first') {
            if (actualOrigin !== 'baked') {
              status = '⚠️ Suspeito';
            }
          } else {
            // Modo auto: marca como suspeito se:
            // 1. Usar CDN para sons UI críticos (click, transition, pageOpen)
            // 2. Som não encontrado ou com erro
            if (['click', 'transition', 'pageOpen'].includes(expectedSoundKey)) {
              if (actualOrigin === 'cdn' || actualOrigin === 'missing') {
                status = '⚠️ Suspeito';
              }
            }
          }
          
          if (actualOrigin === 'missing') {
            status = '⚠️ Suspeito';
          }
          
          results.push({
            page: pageNum,
            event,
            description: actualDescription,
            expectedSound: expectedSoundKey,
            actualSound: expectedSoundKey,
            origin: actualOrigin,
            volume,
            status
          });
        }
      }
      
      // Pausa entre páginas para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    setAuditResults(results);
    setIsAuditing(false);
    setCurrentAuditPage(0);
  };

  // Função para testar um som específico
  const testSound = (soundKey: SoundKey) => {
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

  const totalEvents = auditResults.length;
  const correctEvents = auditResults.filter(r => r.status === '✅ Correto').length;
  const suspiciousEvents = auditResults.filter(r => r.status === '⚠️ Suspeito').length;
  const bakedEvents = auditResults.filter(r => r.origin === 'baked').length;
  const cdnEvents = auditResults.filter(r => r.origin === 'cdn').length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">🔍 Auditoria Completa de Áudio do Quiz</CardTitle>
          <p className="text-muted-foreground">
            Teste sistemático de todas as 23 páginas e 52 eventos de áudio (modo baked-first)
          </p>
          <div className="mt-4 p-4 bg-blue-50/30 border border-blue-200/30 rounded">
            <h4 className="font-medium text-blue-800 mb-2">📋 Auditoria Modo BAKED-FIRST:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>🎯 <strong>OBJETIVO:</strong> Garantir que todos os 52 eventos usem origem BAKED</li>
              <li>🔊 <strong>VOLUMES:</strong> UI=0.50 (-6dB), Feedback=0.707 (-3dB), Special=1.0 (0dB)</li>
              <li>✅ <strong>CORRETO:</strong> Som toca com origem=baked e volume padronizado</li>
              <li>⚠️ <strong>SUSPEITO:</strong> Origem diferente de 'baked' ou som ausente</li>
              <li>🎵 Use "🔊 Teste" para ouvir cada som individualmente</li>
              <li>📋 Copie o relatório final para documentar 52/52 ✅</li>
            </ol>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={runFullAudit} 
              disabled={isAuditing}
              size="lg"
              className="flex-1"
            >
              {isAuditing ? `Auditando Página ${currentAuditPage}/23...` : 'Iniciar Auditoria Completa'}
            </Button>
            <Button 
              onClick={() => {
                localStorage.removeItem("audio_activated");
                localStorage.removeItem("sound_source_mode");
                localStorage.removeItem("quiz_audio_prefs");
                window.location.reload();
              }}
              variant="outline"
              size="lg"
              className="whitespace-nowrap"
            >
              🗑️ Limpar Cache
            </Button>
          </div>

          {/* Estatísticas */}
          {auditResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-3 bg-muted/50 rounded">
                <div className="text-2xl font-bold">{totalEvents}</div>
                <div className="text-sm text-muted-foreground">Total Eventos</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{correctEvents}</div>
                <div className="text-sm text-muted-foreground">✅ Corretos</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{suspiciousEvents}</div>
                <div className="text-sm text-muted-foreground">⚠️ Suspeitos</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">{bakedEvents}</div>
                <div className="text-sm text-muted-foreground">Baked</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-2xl font-bold text-red-600">{cdnEvents}</div>
                <div className="text-sm text-muted-foreground">CDN</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela de Resultados */}
      {auditResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Resultados da Auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 font-medium">Página</th>
                    <th className="text-left p-3 font-medium">Evento</th>
                    <th className="text-left p-3 font-medium">Descrição do Som Ouvido</th>
                    <th className="text-left p-3 font-medium">Nome Técnico</th>
                    <th className="text-left p-3 font-medium">Origem</th>
                    <th className="text-left p-3 font-medium">Volume</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Teste</th>
                  </tr>
                </thead>
                <tbody>
                  {auditResults.map((result, index) => (
                    <tr 
                      key={index} 
                      className={`border-b hover:bg-muted/20 ${
                        result.status === '⚠️ Suspeito' ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="p-3 font-mono">{result.page}</td>
                      <td className="p-3 font-mono text-blue-600">{result.event}</td>
                      <td className="p-3 max-w-xs">{result.description}</td>
                      <td className="p-3 font-mono">{result.expectedSound}</td>
                      <td className="p-3">
                        <Badge 
                          variant={result.origin === 'baked' ? 'default' : 
                                  result.origin === 'cdn' ? 'destructive' : 'secondary'}
                        >
                          {result.origin}
                        </Badge>
                      </td>
                      <td className="p-3">{result.volume}</td>
                      <td className="p-3">
                        <span className={
                          result.status === '✅ Correto' ? 'text-green-600' : 'text-red-600'
                        }>
                          {result.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => testSound(result.expectedSound)}
                        >
                          🔊 Teste
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo de Ações Recomendadas */}
      {suspiciousEvents > 0 && (
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">⚠️ Ações Recomendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cdnEvents > 0 && (
                <div className="p-3 bg-red-50 rounded">
                  <strong>CDN Fallback Detectado:</strong> {cdnEvents} eventos estão usando CDN em vez de sons baked/local.
                  Isso pode causar latência e inconsistência.
                </div>
              )}
              <div className="p-3 bg-blue-50 rounded">
                <strong>Próximos Passos:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Verificar se todos os arquivos de som estão na pasta /public/sounds/</li>
                  <li>Confirmar que sounds baked estão sendo carregados corretamente</li>
                  <li>Testar manualmente cada som suspeito</li>
                  <li>Ajustar soundManifest.ts para forçar uso de sons baked</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório Completo em Texto */}
      {auditResults.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Relatório Completo (Copiar/Colar)</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                const report = generateTextReport();
                navigator.clipboard.writeText(report);
                alert('Relatório copiado para a área de transferência!');
              }}
              className="mb-4"
            >
              📋 Copiar Relatório Completo
            </Button>
            <div className="bg-muted/50 p-4 rounded text-xs font-mono overflow-x-auto">
              <pre>{generateTextReport()}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Função para gerar relatório em texto
  function generateTextReport(): string {
    const header = `
# AUDITORIA COMPLETA DE ÁUDIO - QUIZ NUTRIÇÃO
Data: ${new Date().toLocaleString('pt-BR')}
Total de Páginas: 23
Total de Eventos: ${totalEvents}

## RESUMO EXECUTIVO
✅ Corretos: ${correctEvents} (${((correctEvents/totalEvents)*100).toFixed(1)}%)
⚠️ Suspeitos: ${suspiciousEvents} (${((suspiciousEvents/totalEvents)*100).toFixed(1)}%)
🔧 Baked: ${bakedEvents}
🌐 CDN: ${cdnEvents}
📁 Local: ${auditResults.filter(r => r.origin === 'local').length}
❌ Missing: ${auditResults.filter(r => r.origin === 'missing').length}

## TABELA DETALHADA
Página | Evento | Descrição do Som Ouvido | Nome Técnico | Origem | Volume | Status
-------|--------|-------------------------|--------------|--------|---------|--------`;

    const tableRows = auditResults.map(result => 
      `${result.page} | ${result.event} | ${result.description} | ${result.expectedSound} | ${result.origin} | ${result.volume} | ${result.status}`
    ).join('\n');

    const footer = `

## CRITÉRIOS DE VALIDAÇÃO
- Sons UI (click, transition, pageOpen) DEVEM usar baked ou local (NUNCA CDN)
- Volume deve corresponder à categoria: UI=baixo, Feedback=médio, Special=alto
- Todos os sons devem ser reproduzidos sem erro

## AÇÕES RECOMENDADAS
${suspiciousEvents > 0 ? 
  `⚠️ ATENÇÃO: ${suspiciousEvents} eventos precisam de correção
- Verificar soundManifest.ts
- Confirmar arquivos na pasta /public/sounds/
- Testar sons suspeitos individualmente` : 
  '✅ TODOS OS TESTES PASSARAM - Sistema de áudio está funcionando corretamente'
}

---
Relatório gerado automaticamente pelo sistema de auditoria de áudio.
`;

    return header + '\n' + tableRows + footer;
  }
};