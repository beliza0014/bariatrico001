# 📊 Sistema de Captação de Leads e Remarketing

## 📝 Visão Geral

Sistema completo para captar contatos (WhatsApp/Email) e respostas do quiz para remarketing certeiro.

## 🗄️ Estrutura do Banco de Dados

### 1. **leads** - Tabela Principal de Leads
Armazena informações básicas de cada lead.

**Colunas principais:**
- `lead_id` (uuid) - ID único do lead
- `name` (text) - Nome do lead
- `gender` (text) - Gênero
- `age_range` (text) - Faixa etária
- `completion_status` - Status: 'in_progress', 'completed', 'abandoned'
- `has_email` / `has_whatsapp` - Flags para remarketing
- UTM tracking (source, medium, campaign)

### 2. **lead_contacts** - Contatos (Email/WhatsApp)
Armazena os contatos fornecidos pelos leads.

**Colunas principais:**
- `lead_id` - Referência ao lead
- `name` - Nome do usuário
- `contact_type` - 'email' ou 'whatsapp'
- `contact_value` - Valor do contato
- `captured_at` - Timestamp da captura

### 3. **quiz_answers** - Respostas Individuais
Todas as respostas do quiz, questão por questão.

**Colunas principais:**
- `lead_id` - Referência ao lead
- `name` - Nome do usuário
- `question` - Texto da pergunta
- `answer` - Resposta (JSON - pode ser string ou array)
- `page_number` - Número da página
- `answered_at` - Timestamp da resposta

### 4. **lead_insights** - Insights Principais
Principais respostas extraídas e estruturadas para remarketing.

**Colunas principais:**
- `lead_id` - Referência ao lead
- `name` - Nome do usuário
- `objetivo_principal` - Objetivo principal do lead
- `barreiras` - Array de barreiras relatadas
- `rotina_diaria` - Rotina diária
- `tipo_corpo` - Tipo de corpo
- `peso_atual` / `peso_desejado` / `altura` - Dados físicos
- `dificuldades_fisicas` - Array de dificuldades
- `preferencias_frutas` - Array de preferências
- `irr_score` - Score IRR calculado
- `difficulty_score` - Score de dificuldade

### 5. **remarketing_leads** - View para Dashboard
View SQL que junta todas as informações para remarketing.

## 🔧 Edge Functions

### 1. **init-lead**
Inicializa um novo lead quando ele começa o quiz.

**Payload:**
```json
{
  "lead_id": "uuid",
  "user_agent": "string",
  "referrer": "string",
  "utm_source": "string",
  "utm_medium": "string",
  "utm_campaign": "string"
}
```

### 2. **capture-contact**
Captura email ou WhatsApp do lead.

**Payload:**
```json
{
  "session_id": "uuid",
  "contact_type": "email" | "whatsapp",
  "contact_value": "contato@exemplo.com",
  "lead_name": "Nome do Lead"
}
```

### 3. **save-quiz-answers**
Salva respostas do quiz e extrai insights automaticamente.

**Payload:**
```json
{
  "lead_id": "uuid",
  "answers": [
    {
      "question": "string",
      "answer": "string | string[]",
      "pageNumber": 1,
      "timestamp": 1234567890
    }
  ]
}
```

## 📊 Como Usar para Remarketing

### 1. **Leads Qualificados**
```sql
SELECT * FROM public.remarketing_leads
WHERE completion_status = 'completed'
  AND (has_email = true OR has_whatsapp = true)
ORDER BY created_at DESC;
```

### 2. **Leads Abandonados**
```sql
SELECT * FROM public.remarketing_leads
WHERE completion_status = 'abandoned'
  AND last_page_visited >= 20
  AND (has_email = true OR has_whatsapp = true)
ORDER BY created_at DESC;
```

### 3. **Segmentação por Objetivo**
```sql
SELECT objetivo_principal, COUNT(*) as total
FROM public.lead_insights
GROUP BY objetivo_principal
ORDER BY total DESC;
```

### 4. **Segmentação por Barreiras**
```sql
SELECT unnest(barreiras) as barreira, COUNT(*) as total
FROM public.lead_insights
WHERE barreiras IS NOT NULL
GROUP BY barreira
ORDER BY total DESC;
```

### 5. **Leads de Alta Intenção (IRR > 7)**
```sql
SELECT * FROM public.remarketing_leads
WHERE irr_score >= 7
  AND completion_status = 'in_progress'
ORDER BY created_at DESC;
```

## 🔐 Segurança (RLS)

Todas as tabelas têm Row Level Security (RLS) habilitado.
Apenas o service role (backend) tem acesso completo aos dados.

## 🚀 Integração Frontend

O sistema já está integrado:
- **QuizContext** salva automaticamente no Cloud
- **Page25bContactCapture** captura contatos via `capture-contact`
- Respostas são enviadas via `save-quiz-answers` automaticamente

## 📈 Métricas Importantes

1. **Taxa de Conversão**: `completed` / `total leads`
2. **Taxa de Captura**: `(has_email OR has_whatsapp)` / `total leads`
3. **Páginas Críticas de Abandono**: `last_page_visited` distribution
4. **Objetivos Mais Comuns**: Top `objetivo_principal`
5. **Barreiras Mais Relatadas**: Top `barreiras`

## 🎯 Próximos Passos

1. Execute o SQL de migração no Cloud SQL Editor
2. Teste o fluxo do quiz completo
3. Verifique os dados nas tabelas via Cloud Database
4. Configure campanhas de remarketing baseadas nas segmentações
5. Analise os insights para otimizar o quiz

## 📝 Notas Importantes

- **Nome do usuário**: Presente em TODAS as tabelas para facilitar consultas
- **Timestamps**: Todas as ações têm timestamps para análise temporal
- **Arrays**: Barreiras, dificuldades e frutas são arrays para facilitar análise
- **View**: Use `remarketing_leads` para dashboard rápido
- **Indexes**: Criados automaticamente para performance
