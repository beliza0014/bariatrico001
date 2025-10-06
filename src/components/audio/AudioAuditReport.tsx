import React from 'react';
import { getAudioSourceStatus, type SoundKey, type Origin } from './CompactAudioTestSummary';

type AuditEntry = {
  page: string;
  event: string;
  soundExpected: SoundKey;
  soundPlaying: SoundKey;
  origin: Origin;
  file: string;
  description: string;
};

interface AudioAuditReportProps {
  entries: AuditEntry[];
}

export default function AudioAuditReport({ entries }: AudioAuditReportProps) {
  const clickTransitionPageOpenEntries = entries.filter(e => 
    ['click', 'transition', 'pageOpen'].includes(e.soundExpected)
  );

  const hasWarnings = clickTransitionPageOpenEntries.some(entry => 
    getAudioSourceStatus(entry.soundExpected, entry.origin).status === 'WARNING'
  );

  return (
    <div className="mt-6 p-4 border rounded-lg bg-muted/30">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        🔍 Auditoria de Áudio - Click, Transition & PageOpen
        {hasWarnings ? (
          <span className="text-red-500 text-sm">⚠️ Issues encontrados</span>
        ) : (
          <span className="text-green-500 text-sm">✅ Tudo OK</span>
        )}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="py-2 pr-4 font-medium">Página</th>
              <th className="py-2 pr-4 font-medium">Evento</th>
              <th className="py-2 pr-4 font-medium">Som Esperado</th>
              <th className="py-2 pr-4 font-medium">Som Tocando</th>
              <th className="py-2 pr-4 font-medium">Origem</th>
              <th className="py-2 pr-4 font-medium">Arquivo/Descrição</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clickTransitionPageOpenEntries.map((entry, index) => {
              const status = getAudioSourceStatus(entry.soundExpected, entry.origin);
              const isWarning = status.status === 'WARNING';
              
              return (
                <tr 
                  key={index} 
                  className={`align-middle hover:bg-muted/50 ${isWarning ? 'bg-red-50/30' : ''}`}
                >
                  <td className="py-2 pr-4 font-mono text-foreground">{entry.page}</td>
                  <td className="py-2 pr-4 text-foreground">{entry.event}</td>
                  <td className="py-2 pr-4 font-mono text-foreground">{entry.soundExpected}</td>
                  <td className="py-2 pr-4 font-mono text-foreground">{entry.soundPlaying}</td>
                  <td className="py-2 pr-4">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getOriginColor(entry.origin)}`} />
                    <span className="text-foreground">{entry.origin}</span>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{entry.file}</td>
                  <td className="py-2">
                    <span className={isWarning ? 'text-red-500' : 'text-green-500'}>
                      {isWarning ? '❌' : '✅'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Resumo */}
      <div className="mt-4 p-3 bg-muted/50 rounded">
        <h4 className="font-medium text-foreground mb-2">📊 Resumo da Auditoria</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total de eventos:</span>
            <span className="ml-2 font-mono">{clickTransitionPageOpenEntries.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Usando local/baked:</span>
            <span className="ml-2 font-mono text-green-500">
              {clickTransitionPageOpenEntries.filter(e => e.origin !== 'cdn').length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Usando CDN (problemático):</span>
            <span className="ml-2 font-mono text-red-500">
              {clickTransitionPageOpenEntries.filter(e => e.origin === 'cdn').length}
            </span>
          </div>
        </div>
        
        {!hasWarnings && (
          <div className="mt-3 p-2 bg-green-50/30 border border-green-200/30 rounded text-green-700">
            ✅ <strong>Critério de aceite atingido:</strong> 100% dos sons click, transition e pageOpen estão usando local ou baked (nunca CDN)
          </div>
        )}
      </div>
    </div>
  );
}

function getOriginColor(origin: Origin): string {
  switch (origin) {
    case 'file':
      return 'bg-green-500';
    case 'cdn':
      return 'bg-red-500'; // Vermelho para CDN pois é problemático para click/transition
    case 'baked':
      return 'bg-orange-500';
    case 'missing':
    default:
      return 'bg-gray-500';
  }
}

// Dados mock para demonstrar as páginas que usam click e transition
export const MOCK_AUDIT_DATA: AuditEntry[] = [
  {
    page: 'Page01Landing',
    event: 'button_click',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Botão "Iniciar Quiz"'
  },
  {
    page: 'Page01Landing',
    event: 'page_transition',
    soundExpected: 'transition',
    soundPlaying: 'transition',
    origin: 'baked',
    file: 'transition.mp3 (baked: 500ms sweep, 800→80Hz)',
    description: 'Transição para próxima página'
  },
  {
    page: 'Page02Question1',
    event: 'option_select',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Seleção de opção'
  },
  {
    page: 'Page02Question1',
    event: 'page_transition',
    soundExpected: 'transition',
    soundPlaying: 'transition',
    origin: 'baked',
    file: 'transition.mp3 (baked: 500ms sweep, 800→80Hz)',
    description: 'Transição para próxima página'
  },
  {
    page: 'Page03Question2',
    event: 'option_select',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Seleção de opção'
  },
  {
    page: 'Page04Question3',
    event: 'option_select',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Seleção de opção'
  },
  {
    page: 'Page05BodyMap',
    event: 'body_area_click',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Clique em área do corpo'
  },
  {
    page: 'Page06NameInput',
    event: 'input_submit',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Submit do formulário de nome'
  },
  {
    page: 'Page07BodyType',
    event: 'option_select',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Seleção de tipo corporal'
  },
  {
    page: 'Page18FruitPreferences',
    event: 'fruit_select',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Seleção de fruta'
  },
  {
    page: 'Page19HeightWeight',
    event: 'input_change',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Ajuste de altura/peso'
  },
  {
    page: 'Page20TripleAnalysis',
    event: 'page_transition',
    soundExpected: 'transition',
    soundPlaying: 'transition',
    origin: 'baked',
    file: 'transition.mp3 (baked: 500ms sweep, 800→80Hz)',
    description: 'Transição para análise'
  },
  {
    page: 'Page21BMIResults',
    event: 'page_open',
    soundExpected: 'pageOpen',
    soundPlaying: 'pageOpen',
    origin: 'baked',
    file: 'pageOpen.mp3 (baked: 200ms chime, 880Hz)',
    description: 'Abertura da página de resultados BMI'
  },
  {
    page: 'Page23Checkout',
    event: 'page_open',
    soundExpected: 'pageOpen',
    soundPlaying: 'pageOpen',
    origin: 'baked',
    file: 'pageOpen.mp3 (baked: 200ms chime, 880Hz)',
    description: 'Abertura da página de checkout'
  },
  {
    page: 'Page23Checkout',
    event: 'checkout_button',
    soundExpected: 'click',
    soundPlaying: 'click',
    origin: 'baked',
    file: 'click.mp3 (baked: 90ms burst, 1800Hz)',
    description: 'Botão de finalização'
  }
];

export type { AuditEntry };