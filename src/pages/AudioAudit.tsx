import React, { useState } from 'react';
import { FullQuizAudioAudit } from '@/components/audio/FullQuizAudioAudit';
import { AudioValidationComponent } from '@/components/audio/AudioValidationComponent';
import { SoundProvider } from '@/contexts/SoundContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AudioAudit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'technical' | 'auditive'>('auditive');

  return (
    <SoundProvider>
      <div className="min-h-screen bg-background">
        {/* Header com Navegação */}
        <div className="p-6 border-b bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">🔍 Sistema de Auditoria de Áudio</h1>
            <div className="flex gap-4">
              <Button
                onClick={() => setActiveTab('auditive')}
                variant={activeTab === 'auditive' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                🎧 Validação Auditiva Final
                <Badge variant="secondary">RECOMENDADO</Badge>
              </Button>
              <Button
                onClick={() => setActiveTab('technical')}
                variant={activeTab === 'technical' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                🔧 Auditoria Técnica Completa
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo baseado na aba ativa */}
        <div className="p-6">
          {activeTab === 'auditive' && (
            <div>
              <div className="max-w-7xl mx-auto mb-6">
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <CardTitle className="text-blue-800">🎯 VALIDAÇÃO AUDITIVA FINAL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700 mb-4">
                      Este é o teste final recomendado para confirmar que a experiência auditiva do usuário está 100% correta.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">✅ O que será validado:</h4>
                        <ul className="space-y-1 text-blue-600">
                          <li>• Correspondência sonora (som real vs esperado)</li>
                          <li>• Volume percebido conforme categoria</li>
                          <li>• Qualidade e origem do áudio (baked)</li>
                          <li>• Sequência completa de 52 eventos</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🎧 Como usar:</h4>
                        <ul className="space-y-1 text-blue-600">
                          <li>• Reprodução sequencial automática</li>
                          <li>• Confirme cada som como ✅ Correto ou ⚠️ Divergente</li>
                          <li>• Use "Repetir Som" para ouvir novamente</li>
                          <li>• Meta: 52/52 eventos corretos para aprovação</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <AudioValidationComponent />
            </div>
          )}

          {activeTab === 'technical' && (
            <div>
              <div className="max-w-7xl mx-auto mb-6">
                <Card className="border-gray-200 bg-gray-50/30">
                  <CardHeader>
                    <CardTitle className="text-gray-800">🔧 AUDITORIA TÉCNICA COMPLETA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Análise técnica detalhada do sistema de áudio, incluindo buffers, origens e configurações.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">🔍 Análise técnica:</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Verificação de buffers carregados</li>
                          <li>• Análise de origens (baked/local/cdn)</li>
                          <li>• Configurações de volume por categoria</li>
                          <li>• Relatório técnico detalhado</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">📊 Útil para:</h4>
                        <ul className="space-y-1 text-gray-600">
                          <li>• Debugging técnico</li>
                          <li>• Verificação de configurações</li>
                          <li>• Análise de performance</li>
                          <li>• Documentação técnica</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <FullQuizAudioAudit />
            </div>
          )}
        </div>
      </div>
    </SoundProvider>
  );
};