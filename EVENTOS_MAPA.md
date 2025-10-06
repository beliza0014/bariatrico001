# Mapa de Eventos - Sistema LeveMe

## 📊 Tabela Completa de Tracking

| Evento | Página | Payload Principal | Tipo |
|---------|---------|-------------------|------|
| `quiz_start` | P01 | `{timestamp, user_agent}` | Inicialização |
| `goal_selected` | P02 | `{goal, timestamp}` | Seleção |
| `gender_selected` | P03 | `{gender, timestamp}` | Seleção |
| `body_map_selected` | P04 | `{areas: array, timestamp}` | Seleção |
| `weight_impact_selected` | P05 | `{impact, timestamp}` | Seleção |
| `triggers_selected` | P06 | `{triggers: array, timestamp}` | Seleção |
| `difficulties_selected` | P07 | `{difficulties: array, timestamp}` | Seleção |
| `barriers_selected` | P08 | `{barriers: array, timestamp}` | Seleção |
| `routine_selected` | P09 | `{routine, timestamp}` | Seleção |
| `water_intake_selected` | P10 | `{intake, timestamp}` | Seleção |
| `fruits_selected` | P11 | `{fruits: array, timestamp}` | Seleção |
| `name_captured` | P12 | `{name, timestamp}` | Captura |
| `vsl_view` | P13 | `{name, page: "authority"}` | Vídeo |
| `vsl_cta_unlocked` | P13 | `{name, delay_seconds, experiment_variant}` | Vídeo + A/B |
| `benefits_selected` | P14 | `{benefits: array, timestamp}` | Seleção |
| `testimonial_view` | P15 | `{testimonial_id, timestamp}` | Visualização |
| `irr_score_view` | P16 | `{score, classification, timestamp}` | Resultado |
| `irr_interpretation_view` | P17 | `{score, interpretation, timestamp}` | Análise |
| `ritual_view` | P18 | `{steps_shown, timestamp}` | Educação |
| `progress_curve_view` | P19 | `{timeline_shown, timestamp}` | Cronograma |
| `objections_view` | P20 | `{comparison_shown, experiment_variant}` | Conversão + A/B |
| `tea_solution_cta_click` | P22 | `{name, timestamp}` | Engajamento |
| `pre_checkout_confidence_view` | P23 | `{confidence_level, timestamp}` | Pré-conversão |
| `pre_checkout_cta_click` | P23 | `{name, confidence, timestamp}` | CTA Principal |
| `checkout_view` | P24 | `{name, discount, timer_remaining}` | Checkout |
| `checkout_start` | P24 | `{name, value, currency, discount_percentage}` | Conversão |
| `purchase` | Kiwify | `{name, value, currency, transaction_id}` | Conversão Final |
| `completion` | P25 | `{name, purchased: boolean, timestamp}` | Finalização |
| `thankyou_secondary_cta_click` | P25 | `{name, action: "return_to_checkout"}` | Recuperação |

---

## 🧪 Eventos Experimentais A/B

### Experimento: VSL Gate Timing
| Evento | Página | Payload Específico |
|---------|---------|-------------------|
| `experiment_assigned` | P13 | `{experiment_name: "vsl_gate_timing", experiment_variant, experiment_config, user_id}` |
| `experiment_exposure` | P13 | `{experiment_name: "vsl_gate_timing", timing, page: "authority"}` |
| `experiment_cta_unlocked` | P13 | `{experiment_name: "vsl_gate_timing", timing, delay_seconds}` |

### Experimento: Sticky CTA Compare  
| Evento | Página | Payload Específico |
|---------|---------|-------------------|
| `experiment_assigned` | P20 | `{experiment_name: "sticky_cta_compare", experiment_variant, experiment_config, user_id}` |
| `experiment_exposure` | P20 | `{experiment_name: "sticky_cta_compare", sticky_enabled, page: "comparison"}` |

---

## 📍 Payload Padrão (Todos Eventos)

### Dados Contextuais Obrigatórios
```typescript
{
  // Identificação
  name: string,              // Nome capturado P12
  timestamp: number,         // Date.now()
  
  // Contexto Quiz
  gender: string,            // P03: "Masculino" | "Feminino"
  barrier: string,           // P08: Principal barreira selecionada
  irr: number,              // P16: Score IRR calculado
  
  // Contexto Experimental (quando aplicável)
  experiment_variant?: string,     // "control" | "variant"
  experiment_name?: string,        // Nome do experimento
  experiment_config?: string       // Label da configuração
}
```

### Dados Enriquecidos (Meta Pixel)
```typescript
{
  // E-commerce Enhanced
  value?: number,            // Valor monetário (BRL)
  currency?: "BRL",          // Moeda padrão
  content_name?: string,     // "Chá LeveMe - Receita Personalizada"
  content_category?: string, // "Suplemento Natural"
  
  // Custom Data
  custom_data: {
    gender: string,
    discount_percentage: number,
    original_price: number,
    user_journey_stage: string
  }
}
```

---

## 🎯 Eventos Críticos para Análise

### Funil de Conversão Principal
1. **`quiz_start`** → Início jornada
2. **`name_captured`** → Lead capturado
3. **`vsl_cta_unlocked`** → Engajamento vídeo
4. **`pre_checkout_cta_click`** → Intenção compra
5. **`checkout_start`** → Início processo pagamento
6. **`purchase`** → Conversão final ✅

### KPIs A/B Testing
- **VSL Timing**: `vsl_cta_unlocked` rate por variante
- **Sticky CTA**: `pre_checkout_cta_click` rate por variante
- **Overall**: `purchase` rate por combinação variantes

---

## 🔄 Fluxo de Dados

### Client → Analytics
```typescript
// gtag (Google Analytics + Meta Pixel)
gtag('event', 'event_name', payload);

// Exemplo real:
gtag('event', 'checkout_start', {
  name: 'Maria Silva',
  value: 118.80,
  currency: 'BRL',
  content_name: 'Chá LeveMe - Receita Personalizada',
  content_category: 'Suplemento Natural',
  experiment_variant: 'control',
  custom_data: {
    gender: 'Feminino',
    discount_percentage: 60,
    original_price: 297,
    user_journey_stage: 'checkout'
  }
});
```

### Kiwify → Analytics
```typescript
// Webhook ou redirect com purchase confirmation
{
  event: 'purchase',
  transaction_id: 'kiwify_123456',
  value: 118.80,
  currency: 'BRL',
  name: 'Maria Silva',
  timestamp: 1672531200000
}
```

---

## 📈 Segmentação para Análise

### Por Demografia
- **Gênero**: Masculino vs Feminino
- **Faixa Etária**: 18-25, 26-35, 36-45, 46+
- **Tipo Corporal**: Regular, Sobrepeso, Flácida, Barriga Falsa

### Por Comportamento
- **Barreira Principal**: Ansiedade, Compulsão, Metabolismo, etc.
- **Score IRR**: Alto (>7), Médio (4-7), Baixo (<4)
- **Tempo Sessão**: <5min, 5-15min, >15min

### Por Experimento
- **VSL Timing**: Control (9s) vs Variant (0s)
- **Sticky CTA**: Control (normal) vs Variant (sticky)
- **Combinações**: 4 grupos possíveis

---

## 🛠️ Debug & Monitoramento

### Console Logs (Dev Mode)
```typescript
// Eventos disparados com contexto
console.log('🎯 Event:', eventName, payload);
console.log('🧪 Experiment:', experimentName, variant, config);
console.log('👤 User Context:', {name, gender, barrier, irr});
```

### Validação Real-Time
```javascript
// Google Analytics Debug View
// Meta Events Manager Test Events
// Console.table(events) para debug local
```

### Alertas Recomendados
- **Event Drop**: >50% redução em 1h
- **Experiment Skew**: Alocação <40% ou >60%
- **Conversion Drop**: >20% redução taxa purchase
- **Error Spike**: >10 erros JS/min

---

## 📋 Checklist Implementação

### Tracking Básico
- [x] Todos 25+ eventos implementados
- [x] Payload padrão em todos eventos
- [x] gtag configurado para GA + Meta
- [x] Fallbacks para window.gtag undefined

### A/B Testing
- [x] experiment_assigned no load da página
- [x] experiment_exposure no primeiro uso
- [x] Cohort persistence via localStorage
- [x] Variant data em todos eventos relacionados

### Quality Assurance
- [x] Debug logs em development
- [x] Error boundaries nos tracking calls
- [x] Rate limiting para avoid spam
- [x] GDPR/LGPD compliance consideration

**Status**: ✅ **IMPLEMENTAÇÃO COMPLETA**

Todos os eventos estão mapeados, implementados e testados com payload enriquecido para análise detalhada do funil de conversão e experimentos A/B.