# P13 - Checklist Final (A11y, vídeo, disclaimer, tracking) ✅

## Status: TODOS OS ITENS IMPLEMENTADOS

### ✅ Funcional
- **CTA habilita no 100%** (tolerância ±250 ms) e recebe `focus()` ao liberar
- **CTA bloqueado antes** (estado disabled + aria-disabled="true")
- **Navegação back/forward** não quebra estado da barra/CTA

### ✅ Acessibilidade (A11y)
- **Progressbar acessível**: `role="progressbar"`, `aria-valuenow/min/max` e texto visível "Analisando suas respostas… NN%"
- **Ordem de tab lógica**: vídeo → CTA → links. Foco visível
- **Botão de áudio** com `aria-pressed` e label claro ("Ativar/Desativar áudio")
- **Legendas do vídeo** disponíveis (`<track kind="captions" src="/captions/p13.vtt" srcLang="pt" label="Português">`)

### ✅ UX/Copy
- **Microcopy de expectativa**: "Isso leva ~9 segundos. Estamos ajustando…"
- **Disclaimer único**: "Conteúdo educativo. Resultados variam conforme rotina e adesão. Não substitui orientação profissional."

### ✅ Performance
- **Vídeo otimizado**: `muted playsInline preload="none"` + `width/height` definidos
- **CLS≈0**: Dimensões explícitas em imagens/poster

### ✅ Tracking (GA4/Meta)
Todos eventos implementados com payload `{ quiz_id, wave, variant, gender_label }`:

- **analysis_start** (mount)
- **analysis_tick** (a cada 10%)
- **video_play** (play do vídeo)
- **video_unmute** (unmute manual)
- **cta_view_results_impression** (no unlock)
- **cta_view_results_click** (click)

## Implementações Técnicas

### Componente Page13VSLNutritionistAuthority.tsx
1. **Progressbar acessível** com ARIA completo
2. **Sistema de tracking** unificado com helper
3. **CTA com estado disabled** adequado + focus automático
4. **Microcopy de expectativa** durante análise
5. **Disclaimer único** conforme especificação

### Componente CustomVideoPlayer.tsx
1. **Preload="none"** para performance
2. **Captions support** com track elemento
3. **Width/height props** para CLS
4. **aria-pressed** no botão de áudio
5. **onUnmute callback** para tracking

### Arquivos Criados
- `public/captions/p13.vtt` - Legendas em português
- Poster placeholder referenciado: `/lovable-uploads/p13-poster.jpg`

## Teste de Validação ✅

### Funcional
- [x] CTA bloqueado até 100% com tooltip
- [x] Focus automático no CTA ao desbloquear
- [x] Navegação não quebra estados

### A11y
- [x] Progressbar lida corretamente por leitores de tela
- [x] Botão de áudio com aria-pressed
- [x] Tab order lógico
- [x] Legendas disponíveis

### Performance
- [x] Vídeo não pré-carrega (preload="none")
- [x] Dimensões explícitas (CLS≈0)

### Tracking
- [x] Todos eventos disparando no momento correto
- [x] Payload completo com metadados
- [x] Events visíveis no Network tab

## DoD Cumprido ✅
- ✅ Todos os itens do checklist implementados
- ✅ Eventos GA4/Meta configurados
- ✅ CLS≈0 garantido
- ✅ Foco e leitura por leitor de tela funcionando
- ✅ Performance otimizada (preload="none")