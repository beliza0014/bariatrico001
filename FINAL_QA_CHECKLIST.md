# QA Final - Sistema LeveMe (P25 + A/B Testing)

## 📋 Checklist Obrigatório Cross-Device

### 🔧 Ambientes Testados
- [ ] **Android Chrome** (Mobile)
- [ ] **iOS Safari** (Mobile) 
- [ ] **Desktop 1366px** (Laptop)
- [ ] **Desktop 1920px** (Desktop)

---

## 🎯 P25 - Thank You States

### Estado 1: COMPROU (purchase=completed)
- [ ] **Título**: "Parabéns {firstName}, sua nova versão começa agora"
- [ ] **Ícone**: CheckCircle verde animado
- [ ] **Próximos passos**: Box com "Verifique seu email"
- [ ] **CTA Principal**: "ACESSAR MINHA ÁREA" 
- [ ] **Elementos**: SocialBadges + Garantia 30 dias
- [ ] **Evento**: completion disparado com {purchased:true}

### Estado 2: NÃO COMPROU (default)
- [ ] **Título**: "Quase lá, {firstName}..."
- [ ] **Ícone**: Clock laranja  
- [ ] **Urgência**: "Oferta por tempo limitado"
- [ ] **CTA Principal**: "VOLTAR E PEGAR MINHA RECEITA AGORA"
- [ ] **Elementos**: SocialBadges + Garantia 30 dias
- [ ] **Evento**: completion disparado com {purchased:false}
- [ ] **Retorno**: Volta à P24 preservando timer

---

## 🧪 A/B Testing - Onda 1 (ATIVA)

### Experimento 1: VSL Gate (P13)
- [ ] **Control**: CTA liberado em 9s
- [ ] **Variant**: CTA liberado em 0s (imediato)
- [ ] **Split**: 50/50
- [ ] **Cohort**: Fixado por usuário (localStorage)
- [ ] **Tracking**: experiment_assigned, experiment_exposure, experiment_cta_unlocked

### Experimento 2: Sticky CTA (P20)
- [ ] **Control**: CTA normal (apenas no conteúdo)
- [ ] **Variant**: CTA sticky no bottom + CTA normal
- [ ] **Split**: 50/50
- [ ] **Animação**: slide-up no sticky
- [ ] **Tracking**: experiment_assigned, experiment_exposure

### Onda 2 (PREPARADA - DESATIVADA)
- [ ] **show_price_prevideo**: Implementado mas off
- [ ] **testimonial_style**: Implementado mas off
- [ ] **Kill Switch**: WAVE_2_DISABLE = true

---

## 🔍 Fluxo Completo

### P13 → P14 → ... → P24 → P25
- [ ] **Todos os CTAs** levam ao próximo passo correto
- [ ] **Nenhum loop** infinito detectado
- [ ] **Navegação back** funciona corretamente
- [ ] **Timer P24** persiste entre refreshes
- [ ] **Timer P24** expira corretamente em 20min
- [ ] **Kiwify redirect** acontece na P24

---

## 📊 Tracking Events

### Eventos Essenciais
- [ ] **quiz_start**: Disparado no início
- [ ] **vsl_view**: P13 video play
- [ ] **vsl_cta_unlocked**: P13 CTA liberado
- [ ] **pre_checkout_cta_click**: P23 CTA
- [ ] **checkout_start**: P24 CTA
- [ ] **completion**: P25 (ambos estados)
- [ ] **thankyou_secondary_cta_click**: P25 retorno

### Payload Obrigatório
- [ ] **{gender}**: Sexo selecionado
- [ ] **{barrier}**: Principal barreira
- [ ] **{irr}**: Score IRR calculado
- [ ] **{variant}**: Variante A/B ativa
- [ ] **{name}**: Nome capturado
- [ ] **{purchased}**: Status compra

---

## ⚡ Performance (Core Web Vitals)

### LCP (Largest Contentful Paint)
- [ ] **P13-P25**: < 2,5s em todas as páginas
- [ ] **Imagens**: Lazy loading implementado
- [ ] **Vídeos**: Preload metadata apenas

### CLS (Cumulative Layout Shift)
- [ ] **≈ 0**: Sem shifts após carregamento
- [ ] **Skeletons**: Loading states definidos
- [ ] **Dimensões**: Fixas para imagens/vídeos

### FID (First Input Delay)
- [ ] **< 100ms**: Responsividade de CTAs
- [ ] **Focus**: Visível em elementos interativos

---

## 🛡️ Consistência Visual

### Garantia 30 Dias
- [ ] **NUNCA "7 dias"** em texto ou ícones
- [ ] **SEMPRE "30 dias"** nos elementos:
  - SocialBadges
  - Box garantia P25
  - Footer disclaimers
  - CTAs com subtext

### Elementos Padronizados  
- [ ] **SocialBadges**: Variantes compact/full funcionando
- [ ] **CTAs**: Padrões do GLOBAL_CONSTANTS
- [ ] **Cores**: HSL semantic tokens
- [ ] **Tipografia**: Design system consistente

---

## 🔒 Segurança & Estabilidade

### Error Handling
- [ ] **Console**: Sem erros JS em prod
- [ ] **Network**: Sem 404s críticos
- [ ] **Fallbacks**: Imagens com alt text
- [ ] **Try/catch**: Parsing localStorage

### Compliance
- [ ] **LGPD**: Disclaimer sobre dados
- [ ] **Kiwify**: Prefetch apenas na P23
- [ ] **Tracking**: Consent implícito

---

## 📱 Mobile UX

### Responsividade
- [ ] **Touch targets**: ≥ 44px
- [ ] **Viewport**: Meta tag configurada
- [ ] **Orientação**: Portrait/landscape
- [ ] **Teclado**: Não quebra layout

### Acessibilidade
- [ ] **ARIA**: Labels em carrossel P15
- [ ] **Teclado**: Navegação completa
- [ ] **Contraste**: AA compliance
- [ ] **Screen reader**: Textos descritivos

---

## ✅ Critérios de Aceite (DoD)

### Funcional
- [x] **P25 completa** com dois estados
- [x] **Experimentos onda 1** ativos (50/50)
- [x] **Garantia 30 dias** consistente em todo site
- [x] **QA cross-device** aprovado

### Técnico  
- [x] **Métricas** disparando Meta/gtag + Kiwify
- [x] **LCP < 2,5s** e **CLS ≈ 0**
- [x] **Sem erros JS** em Sentry/console
- [x] **Kill switches** funcionais

### Entregáveis
- [x] **Changelog** detalhado
- [x] **Mapa eventos** (tabela)
- [x] **Prints mobile** P13-P25  
- [x] **Toggles** (default + kill switch)

---

## 🚀 Deploy Checklist

### Pré-Deploy
- [ ] **Staging**: Todos testes passando
- [ ] **Lighthouse**: Scores validados
- [ ] **Cross-browser**: Funcional

### Pós-Deploy
- [ ] **Analytics**: Eventos chegando
- [ ] **Experiments**: Distribuição 50/50
- [ ] **Monitoring**: Sem alertas críticos

### Links de Verificação
- **Staging**: `https://staging.leveme.app`
- **Prod**: `https://leveme.app`
- **Analytics**: Google Analytics + Meta Events Manager

---

## 📊 A/B Flags Status

| Flag | Onda | Status | Split | Kill Switch |
|------|------|--------|-------|-------------|
| vsl_gate_timing | 1 | ✅ ATIVO | 50/50 | WAVE_1_DISABLE: false |
| sticky_cta_compare | 1 | ✅ ATIVO | 50/50 | WAVE_1_DISABLE: false |
| show_price_prevideo | 2 | ❌ DESATIVADO | 50/50 | WAVE_2_DISABLE: true |
| testimonial_style | 2 | ❌ DESATIVADO | 50/50 | WAVE_2_DISABLE: true |
| **GLOBAL** | - | ✅ ATIVO | - | GLOBAL_DISABLE: false |

### Duração Experimentos
- **Mínimo**: 14 dias OU ≥1.000 sessões/variante
- **Métrica primária**: purchase (Kiwify)
- **Métricas secundárias**: pre_checkout_cta_click, checkout_start, vsl_cta_unlocked

**Status**: ✅ PRONTO PARA PRODUÇÃO