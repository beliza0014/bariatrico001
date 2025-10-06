import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Volume2, VolumeX, Play, Zap, Trophy, Sparkles, Target, Bug, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useSoundContext } from '@/contexts/SoundContext';
import { SoundKey } from '@/audio/types';
import { useAudioHealthcheck } from '@/hooks/useAudioHealthcheck';
import CompactAudioTestSummary, { getMixLevel, Row } from '@/components/audio/CompactAudioTestSummary';

interface AdvancedSpatialSoundControlProps {
  className?: string;
  showTestButtons?: boolean;
  compact?: boolean;
}

export const AdvancedSpatialSoundControl: React.FC<AdvancedSpatialSoundControlProps> = ({
  className = '',
  showTestButtons = true,
  compact = false
}) => {
  const {
    enabled,
    muted,
    spatial,
    masterVolume,
    isUnlocked,
    bufferLoadProgress,
    toggleSound,
    setVolume,
    setSoundSourceMode,
    initializeAudioOnUserGesture,
    playButtonClick,
    playPageTransition,
    playCorrectAnswer,
    playEnhancedConfettiCelebration,
    playVictorySequence,
    playEnhancedWheelSpin,
    deviceCapabilities,
    soundSourceMode,
    audioBuffers
  } = useSoundContext();

  const [showHealthcheck, setShowHealthcheck] = useState(false);

  // Initialize healthcheck hook
  const {
    healthcheckState,
    runFullHealthcheck,
    getProductionReadiness
  } = useAudioHealthcheck(
    audioBuffers,
    masterVolume,
    muted,
    soundSourceMode,
    isUnlocked,
    (soundKey, options) => {
      // Map soundKey to appropriate play function
      switch (soundKey) {
        case 'click':
          playButtonClick();
          break;
        case 'correct':
          playCorrectAnswer();
          break;
        case 'transition':
          playPageTransition();
          break;
        case 'achievement':
          playVictorySequence();
          break;
        case 'confettiPop':
          playEnhancedConfettiCelebration();
          break;
        case 'wheel':
          playEnhancedWheelSpin(1000);
          break;
        case 'applause':
          playVictorySequence();
          break;
      }
    }
  );

  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };

  const handleActivateAudio = async () => {
    await initializeAudioOnUserGesture();
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSound}
          className="h-8 w-8 p-0"
        >
          {enabled && !muted ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
        
        {enabled && !muted && (
          <Slider
            value={[masterVolume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={5}
            className="w-16"
          />
        )}

        {deviceCapabilities.isIOS && !isUnlocked && (
          <Button
            onClick={handleActivateAudio}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            🔓 Ativar
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Controles de Áudio
        </CardTitle>
        <CardDescription>
          Sistema de áudio espacial com feedback gamificado
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* iOS Activation */}
        {deviceCapabilities.isIOS && !isUnlocked && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
              Para ativar o áudio no iOS, toque no botão abaixo:
            </p>
            <Button
              onClick={handleActivateAudio}
              variant="outline"
              className="w-full"
            >
              🔓 Ativar Áudio iOS
            </Button>
          </div>
        )}

        {/* Load Progress */}
        {bufferLoadProgress < 100 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Carregando sons...</span>
              <span>{Math.round(bufferLoadProgress)}%</span>
            </div>
            <Progress value={bufferLoadProgress} className="w-full" />
          </div>
        )}

        {/* Main Controls */}
        <div className="grid grid-cols-2 gap-4">
          {/* Sound Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Som Ativado</label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={enabled}
                onCheckedChange={toggleSound}
              />
              {enabled ? (
                <Volume2 className="h-4 w-4 text-green-500" />
              ) : (
                <VolumeX className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>

          {/* Mute Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Silenciado</label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={muted}
                onCheckedChange={(checked) => {
                  // This would need to be implemented in the context
                }}
                disabled={!enabled}
              />
              {muted ? (
                <VolumeX className="h-4 w-4 text-red-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>
        </div>

        {/* Volume Slider */}
        {enabled && !muted && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Volume Principal</label>
              <span className="text-sm text-muted-foreground">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
            <Slider
              value={[masterVolume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Spatial Audio Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Áudio Espacial</label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={spatial}
              disabled // Always enabled for now
            />
            <span className="text-sm text-muted-foreground">
              {deviceCapabilities.hasHRTF ? 'HRTF Suportado' : 'Stereo Pan'}
            </span>
          </div>
        </div>

        {/* Test Buttons */}
        {showTestButtons && enabled && !muted && isUnlocked && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Testar Sons</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={playButtonClick}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Play className="h-3 w-3" />
                Click
              </Button>
              
              <Button
                onClick={playPageTransition}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Zap className="h-3 w-3" />
                Transição
              </Button>
              
              <Button
                onClick={playCorrectAnswer}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Target className="h-3 w-3" />
                Correto
              </Button>
              
              <Button
                onClick={playEnhancedConfettiCelebration}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-3 w-3" />
                Celebração
              </Button>
            </div>
            
            <Button
              onClick={playVictorySequence}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Sequência de Vitória
            </Button>
          </div>
        )}

        {/* Status Info */}
        <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
          <div>Status: {isUnlocked ? '🔓 Desbloqueado' : '🔒 Bloqueado'}</div>
          <div>Dispositivo: {deviceCapabilities.isIOS ? 'iOS' : 'Outros'}</div>
          <div>Sample Rate: {deviceCapabilities.sampleRate}Hz</div>
        </div>

        {/* Sound Diagnostics (dev only) */}
        {process.env.NODE_ENV !== 'production' && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                <span className="font-medium text-sm">Sound Diagnostics (Dev)</span>
              </div>

              {/* Sound Source Mode Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sound Source Mode</label>
                <Select
                  value={soundSourceMode}
                  onValueChange={(value: 'auto' | 'baked-first') => setSoundSourceMode(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baked-first">Baked First (Immediate Audio)</SelectItem>
                    <SelectItem value="auto">Auto (File → CDN → Baked)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Compact Audio Summary */}
              <CompactAudioTestSummary 
                rows={(['click', 'correct', 'transition', 'wheel', 'confettiPop', 'applause', 'achievement'] as SoundKey[]).map((key) => {
                  const buffer = audioBuffers.get(key);
                  const source = (buffer?.source || 'missing') as 'file' | 'cdn' | 'baked' | 'missing';
                  const testResult = healthcheckState.selfTestResults.find(r => r.soundKey === key);
                  
                  return {
                    key,
                    origin: source,
                    latencyMs: undefined, // Could be enhanced with actual latency measurement
                    mix: getMixLevel(key),
                    ok: testResult?.status === 'OK' || (buffer && testResult?.status !== 'ERROR')
                  } as Row;
                })}
              />

              {/* Detailed Sound Status Table - Dev only or with debugAudio=1 */}
              {(process.env.NODE_ENV !== "production" || new URLSearchParams(window.location.search).get("debugAudio") === "1") && (
                <details className="mt-3">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Ver detalhes técnicos</summary>
                  <div className="mt-3 space-y-2">
                    <h4 className="font-medium text-sm">Sound Buffer Status (Detalhado)</h4>
                    <div className="space-y-1">
                      {(['click', 'correct', 'transition', 'wheel', 'confettiPop', 'applause', 'achievement'] as SoundKey[]).map((key) => {
                        const buffer = audioBuffers.get(key);
                        const source = buffer?.source || 'missing';
                        const sourceColor = source === 'file' ? 'bg-green-500' : 
                                          source === 'cdn' ? 'bg-blue-500' : 
                                          source === 'baked' ? 'bg-orange-500' : 'bg-red-500';
                        
                        return (
                          <div key={key} className="flex items-center justify-between p-2 border rounded text-xs">
                            <span className="font-mono">{key}</span>
                            <div className="flex items-center gap-2">
                              <Badge className={`${sourceColor} text-white`} style={{ fontSize: '10px' }}>
                                {source.toUpperCase()}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={() => {
                                  switch (key) {
                                    case 'click':
                                      playButtonClick();
                                      break;
                                    case 'correct':
                                      playCorrectAnswer();
                                      break;
                                    case 'transition':
                                      playPageTransition();
                                      break;
                                    case 'achievement':
                                      playVictorySequence();
                                      break;
                                    case 'confettiPop':
                                      playEnhancedConfettiCelebration();
                                      break;
                                    case 'wheel':
                                      playEnhancedWheelSpin(1000);
                                      break;
                                    case 'applause':
                                      playVictorySequence();
                                      break;
                                  }
                                }}
                              >
                                Test
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </details>
              )}

              {/* Audio Healthcheck Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Audio Healthcheck</h4>
                  <Button
                    onClick={() => runFullHealthcheck()}
                    disabled={healthcheckState.isRunning}
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Activity className="h-3 w-3" />
                    {healthcheckState.isRunning ? 'Executando...' : 'Executar Healthcheck'}
                  </Button>
                </div>
                
                {healthcheckState.selfTestResults.length > 0 && (
                  <>
                    {/* Summary */}
                    <div className="p-3 bg-muted rounded-lg">
                       <div className="text-xs font-medium mb-1">
                         [SOUND SELFTEST] {`{total:${healthcheckState.summary.total}, ok:${healthcheckState.summary.ok}, fallback:${healthcheckState.summary.fallback}, error:${healthcheckState.summary.error}}`}
                       </div>
                      <div className="text-xs font-medium">
                        {getProductionReadiness()}
                      </div>
                    </div>

                    {/* Detailed Results Table - Dev only or with debugAudio=1 */}
                    {(process.env.NODE_ENV !== "production" || new URLSearchParams(window.location.search).get("debugAudio") === "1") && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Ver tabela completa de healthcheck</summary>
                        <div className="mt-3 border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">SoundKey</TableHead>
                                <TableHead className="text-xs">Origem</TableHead>
                                <TableHead className="text-xs">Duração(ms)</TableHead>
                                <TableHead className="text-xs">Frames</TableHead>
                                <TableHead className="text-xs">Status(selftest)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {healthcheckState.snapshot.map((item, index) => {
                                const testResult = healthcheckState.selfTestResults.find(r => r.soundKey === item.soundKey);
                                const statusIcon = testResult?.status === 'OK' ? 
                                  <CheckCircle className="h-3 w-3 text-green-500" /> :
                                  testResult?.status === 'FALLBACK' ? 
                                  <AlertTriangle className="h-3 w-3 text-yellow-500" /> :
                                  <XCircle className="h-3 w-3 text-red-500" />;
                                
                                const statusColor = testResult?.status === 'OK' ? 'text-green-600' :
                                                  testResult?.status === 'FALLBACK' ? 'text-yellow-600' :
                                                  'text-red-600';

                                return (
                                  <TableRow key={item.soundKey}>
                                    <TableCell className="text-xs font-mono">{item.soundKey}</TableCell>
                                    <TableCell className="text-xs">
                                      <Badge 
                                        className={`${item.source === 'file' ? 'bg-green-500' : 
                                                  item.source === 'cdn' ? 'bg-blue-500' : 
                                                  item.source === 'baked' ? 'bg-orange-500' : 'bg-red-500'} text-white`}
                                        style={{ fontSize: '9px' }}
                                      >
                                        {item.source.toUpperCase()}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">{item.duration}</TableCell>
                                    <TableCell className="text-xs">{item.frames.toLocaleString()}</TableCell>
                                    <TableCell className="text-xs">
                                      <div className="flex items-center gap-1">
                                        {statusIcon}
                                        <span className={statusColor}>
                                          {testResult?.status || 'NOT_TESTED'}
                                        </span>
                                      </div>
                                      {testResult?.message && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                          {testResult.message}
                                        </div>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </details>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};