# 📊 Sistema de Captação de Leads - Quiz Bariátrico

## ✅ Status: ATUALIZADO (06/10/2025)

Sistema completo para captar e armazenar respostas do quiz de forma organizada para remarketing.

---

## 🗄️ Estrutura do Banco de Dados

### 1. **lead_insights** - Tabela Principal
Armazena TODAS as respostas de cada lead em uma única linha.

**Colunas:**
- `id` (uuid) - Chave primária
- `lead_id` (uuid) - ID único do lead (UNIQUE)
- `nome` (text) - Nome do lead
- `contato` (text) - Contato (email ou WhatsApp)

**Respostas do Quiz:**
- `objetivo_principal` - Objetivo principal
- `genero` - Gênero (masculino/feminino)
- `mapa_corporal` - Onde acumula gordura
- `idade` - Faixa etária
- `meta_peso` - Quantos kg deseja perder
- `gatilhos` - O que mais incomoda
- `dificuldades_fisicas` (array) - Dificuldades diárias
- `barreiras` (array) - O que sabota o emagrecimento
- `tipo_de_corpo` - Tipo de corpo atual
- `corpo_dos_sonhos` - Corpo desejado
- `rotina_diaria` - Como é a rotina
- `consumo_de_agua` - Copos de água por dia
- `preferencias_de_frutas` (array) - Sabores preferidos
- `altura` (numeric) - Altura em cm
- `peso` (numeric) - Peso atual em kg
- `peso_desejado` (numeric) - Peso desejado em kg
- `beneficios` (array) - Benefícios desejados
- `irr_score` (integer) - Score de resistência à insulina

**Metadata:**
- `created_at` - Data de criação
- `updated_at` - Última atualização

### 2. **contatos_captados** - Contatos para Remarketing
Tabela focada em armazenar dados de contato.

**Colunas:**
- `id` (uuid) - Chave primária
- `lead_id` (uuid) - ID do lead (UNIQUE)
- `nome` (text) - Nome
- `whatsapp` (text) - Número de WhatsApp
- `email` (text) - E-mail
- `created_at` - Data de captura

**Constraint:** Pelo menos um contato (email OU whatsapp) deve estar preenchido.

---

## 🔧 Edge Functions

### 1. **init-lead**
Inicializa um novo lead quando começa o quiz.

**Endpoint:** `supabase.functions.invoke('init-lead', { body })`

**Payload:**
```json
{
  "lead_id": "uuid-do-lead",
  "user_agent": "string (opcional)",
  "referrer": "string (opcional)",
  "utm_source": "string (opcional)",
  "utm_medium": "string (opcional)",
  "utm_campaign": "string (opcional)"
}
```

**Ação:** Cria registro inicial na tabela `lead_insights` com nome "Novo Lead".

### 2. **save-quiz-answers**
Salva todas as respostas do quiz na tabela `lead_insights`.

**Endpoint:** `supabase.functions.invoke('save-quiz-answers', { body })`

**Payload:**
```json
{
  "lead_id": "uuid",
  "answers": [
    {
      "question": "name",
      "answer": "João Silva",
      "pageNumber": 1,
      "timestamp": 1234567890
    }
  ]
}
```

**Ação:** 
- Extrai insights de todas as respostas
- Faz UPSERT na tabela `lead_insights` (atualiza se já existir)
- Salva arrays corretamente (barreiras, dificuldades, frutas, benefícios)
- Converte números (altura, peso, IRR score)

### 3. **capture-contact**
Captura email ou WhatsApp do lead.

**Endpoint:** `supabase.functions.invoke('capture-contact', { body })`

**Payload:**
```json
{
  "session_id": "uuid",
  "contact_type": "whatsapp" | "email",
  "contact_value": "11987654321",
  "lead_name": "João Silva"
}
```

**Ação:**
- Salva na tabela `contatos_captados`
- Atualiza `lead_insights` com o contato

---

## 📊 Queries para Remarketing

### Todos os leads com contato capturado
```sql
SELECT * FROM public.contatos_captados
ORDER BY created_at DESC;
```

### Leads completos (insights + contato)
```sql
SELECT 
  li.*,
  cc.email,
  cc.whatsapp
FROM public.lead_insights li
LEFT JOIN public.contatos_captados cc ON li.lead_id = cc.lead_id
WHERE cc.lead_id IS NOT NULL
ORDER BY li.created_at DESC;
```

### Segmentação por objetivo
```sql
SELECT objetivo_principal, COUNT(*) as total
FROM public.lead_insights
WHERE objetivo_principal IS NOT NULL
GROUP BY objetivo_principal
ORDER BY total DESC;
```

### Segmentação por gênero
```sql
SELECT genero, COUNT(*) as total
FROM public.lead_insights
WHERE genero IS NOT NULL
GROUP BY genero;
```

### Leads com alta resistência insulínica (IRR >= 7)
```sql
SELECT li.nome, li.contato, li.irr_score, li.tipo_de_corpo
FROM public.lead_insights li
WHERE li.irr_score >= 7
ORDER BY li.irr_score DESC;
```

### Principais barreiras reportadas
```sql
SELECT unnest(barreiras) as barreira, COUNT(*) as total
FROM public.lead_insights
WHERE barreiras IS NOT NULL
GROUP BY barreira
ORDER BY total DESC;
```

---

## 🚀 Integração Frontend

### QuizContext
O `QuizContext` salva automaticamente as respostas:
- **localStorage** - Fallback local (sempre funciona)
- **Supabase Cloud** - Via `save-quiz-answers` (em background)

### Page25bContactCapture
Captura email/WhatsApp via `capture-contact`.

### Fluxo:
1. Lead inicia quiz → `init-lead` cria registro
2. A cada resposta → `save-quiz-answers` atualiza `lead_insights`
3. Captura contato → `capture-contact` salva em `contatos_captados`

---

## 🔐 Segurança

- **RLS habilitado** em todas as tabelas
- **Service role** tem acesso total (via edge functions)
- **Validação** de inputs no frontend (zod schemas)
- **Constraint** garante pelo menos um contato em `contatos_captados`

---

## ⚙️ Configuração Atual

**Projeto Supabase:**
- URL: `https://tuxxwwkgddarcddyujou.supabase.co`
- Project ID: `tuxxwwkgddarcddyujou`

**Arquivos atualizados:**
- ✅ `vite.config.ts` - URLs corrigidas
- ✅ `supabase/functions/init-lead/index.ts` - Usa `lead_insights`
- ✅ `supabase/functions/save-quiz-answers/index.ts` - Salva em `lead_insights`
- ✅ `supabase/functions/capture-contact/index.ts` - Usa `contatos_captados`

---

## 📈 Métricas Importantes

1. **Taxa de Captura**: `COUNT(contatos_captados)` / `COUNT(lead_insights)`
2. **Perguntas Mais Abandonadas**: Analise `updated_at` vs campos NULL
3. **Objetivos Mais Comuns**: Top `objetivo_principal`
4. **Barreiras Críticas**: Top `barreiras`
5. **Perfil Médio**: AVG(peso), AVG(altura), AVG(irr_score)

---

## 🎯 Próximos Passos

1. ✅ Migração executada com sucesso
2. ✅ Edge functions atualizadas
3. ✅ vite.config.ts corrigido
4. 🔄 Testar fluxo completo do quiz
5. 📊 Criar dashboard de remarketing
6. 📧 Configurar automações de email/WhatsApp
