import React from "react";

type Origin = "file" | "cdn" | "baked" | "missing";
type SoundKey = "click" | "correct" | "transition" | "wheel" | "confettiPop" | "applause" | "achievement" | "pageOpen";

type Row = {
  key: SoundKey;
  origin: Origin;
  latencyMs?: number;
  mix: "-6dB" | "-3dB" | "0dB";
  ok: boolean;
};

interface CompactAudioTestSummaryProps {
  rows: Row[];
}

export default function CompactAudioTestSummary({ rows }: CompactAudioTestSummaryProps) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
        🔊 Resumo de Áudio ({rows.length} sons)
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="py-1 pr-3 font-medium">Som</th>
              <th className="py-1 pr-3 font-medium">Origem</th>
              <th className="py-1 pr-3 font-medium">Latência (ms)</th>
              <th className="py-1 pr-3 font-medium">Mix</th>
              <th className="py-1 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(r => (
              <tr key={r.key} className="align-middle hover:bg-muted/50">
                <td className="py-1 pr-3 font-mono text-foreground">{r.key}</td>
                <td className="py-1 pr-3">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getOriginColor(r.origin)}`} />
                  <span className="text-foreground">{r.origin}</span>
                </td>
                <td className="py-1 pr-3 text-muted-foreground">{r.latencyMs ?? "—"}</td>
                <td className="py-1 pr-3 text-muted-foreground">{r.mix}</td>
                <td className="py-1">{r.ok ? "✅" : "⚠️"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getOriginColor(origin: Origin): string {
  switch (origin) {
    case 'file':
      return 'bg-green-500';
    case 'cdn':
      return 'bg-blue-500';
    case 'baked':
      return 'bg-orange-500';
    case 'missing':
    default:
      return 'bg-red-500';
  }
}

function getMixLevel(soundKey: SoundKey): "-6dB" | "-3dB" | "0dB" {
  // UI sounds: -6dB
  if (['click', 'transition', 'pageOpen'].includes(soundKey)) {
    return '-6dB';
  }
  // Feedback sounds: -3dB  
  if (['correct', 'wheel'].includes(soundKey)) {
    return '-3dB';
  }
  // Special sounds: 0dB
  return '0dB';
}

// Auditoria específica para click, transition e pageOpen
export function getAudioSourceStatus(soundKey: SoundKey, origin: Origin): {
  status: 'OK' | 'WARNING';
  message: string;
} {
  if (['click', 'transition', 'pageOpen'].includes(soundKey) && origin === 'cdn') {
    return {
      status: 'WARNING',
      message: `❌ ${soundKey} usando CDN (deveria ser local/baked)`
    };
  }
  
  if (['click', 'transition', 'pageOpen'].includes(soundKey) && origin === 'baked') {
    return {
      status: 'OK',
      message: `✅ ${soundKey} usando baked (correto)`
    };
  }
  
  if (['click', 'transition', 'pageOpen'].includes(soundKey) && origin === 'file') {
    return {
      status: 'OK',
      message: `✅ ${soundKey} usando arquivo local (correto)`
    };
  }

  return {
    status: 'OK',
    message: 'OK'
  };
}

export { getMixLevel };
export type { Row, SoundKey, Origin };