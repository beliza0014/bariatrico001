import React, { useState } from 'react';
import { useSoundContext } from '@/contexts/SoundContext';
import { Button } from '@/components/ui/button';
import CompactAudioTestSummary from '@/components/audio/CompactAudioTestSummary';
import AudioAuditReport, { MOCK_AUDIT_DATA } from '@/components/audio/AudioAuditReport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, TestTube, ExternalLink } from 'lucide-react';

export default function AudioDebugPanel() {
  const [isVisible, setIsVisible] = useState(false);
  const soundContext = useSoundContext();

  // Simular dados de teste para o CompactAudioTestSummary
  const testRows = [
    {
      key: 'click' as const,
      origin: 'baked' as const,
      latencyMs: 45,
      mix: '-6dB' as const,
      ok: true
    },
    {
      key: 'transition' as const,
      origin: 'baked' as const,
      latencyMs: 52,
      mix: '-6dB' as const,
      ok: true
    },
    {
      key: 'correct' as const,
      origin: 'baked' as const,
      latencyMs: 38,
      mix: '-3dB' as const,
      ok: true
    },
    {
      key: 'wheel' as const,
      origin: 'file' as const,
      latencyMs: 67,
      mix: '-3dB' as const,
      ok: true
    },
    {
      key: 'applause' as const,
      origin: 'baked' as const,
      latencyMs: 89,
      mix: '0dB' as const,
      ok: true
    },
    {
      key: 'achievement' as const,
      origin: 'baked' as const,
      latencyMs: 43,
      mix: '0dB' as const,
      ok: true
    },
    {
      key: 'pageOpen' as const,
      origin: 'baked' as const,
      latencyMs: 39,
      mix: '-6dB' as const,
      ok: true
    },
    {
      key: 'confettiPop' as const,
      origin: 'baked' as const,
      latencyMs: 56,
      mix: '0dB' as const,
      ok: true
    }
  ];

  const testSounds = () => {
    console.info('[AUDIO DEBUG] Testando click, transition e pageOpen...');
    soundContext.playButtonClick();
    setTimeout(() => soundContext.playPageTransition(), 500);
    setTimeout(() => soundContext.playPageOpen(), 1000);
  };

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-background/90 backdrop-blur-sm border-primary/20"
        >
          <TestTube className="w-4 h-4 mr-2" />
          Audio Debug
        </Button>
      ) : (
        <Card className="w-[800px] max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Audio Debug Panel
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.open('/audio-audit', '_blank')}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Auditoria Completa
                </Button>
                <Button
                  onClick={testSounds}
                  variant="outline"
                  size="sm"
                >
                  {soundContext.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  Testar Sons
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                >
                  ✕
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Status do Sistema */}
            <div className="mb-4 p-3 bg-muted/50 rounded">
              <h4 className="font-medium text-foreground mb-2">📊 Status do Sistema</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Audio Habilitado:</span>
                  <span className="ml-2 font-mono">
                    {soundContext.enabled ? '✅ Sim' : '❌ Não'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Audio Desbloqueado:</span>
                  <span className="ml-2 font-mono">
                    {soundContext.isUnlocked ? '✅ Sim' : '❌ Não'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Modo de Fonte:</span>
                  <span className="ml-2 font-mono">{soundContext.soundSourceMode}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Volume Master:</span>
                  <span className="ml-2 font-mono">{(soundContext.masterVolume * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Resumo de Áudio */}
            <CompactAudioTestSummary rows={testRows} />

            {/* Auditoria Completa */}
            <AudioAuditReport entries={MOCK_AUDIT_DATA} />

            {/* Resumo Final */}
            <div className="mt-6 p-4 bg-green-50/30 border border-green-200/30 rounded">
              <h4 className="font-medium text-green-800 mb-2">🎯 Resumo de Correções Implementadas</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✅ Manifest atualizado: click, transition e pageOpen sem CDN</li>
                <li>✅ Loader modificado: preference=['local', 'baked'] para sons UI</li>
                <li>✅ Baked sounds: click (90ms), transition (500ms), pageOpen (200ms)</li>
                <li>✅ Telemetria: console.info para debug de sons UI</li>
                <li>✅ Correção: pageOpen substitui wheel/applause na abertura de páginas</li>
                <li>✅ Auditoria: 100% usando local/baked (nunca CDN)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}