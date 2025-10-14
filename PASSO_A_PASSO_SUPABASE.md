# 🎯 Passo a Passo: Configurar Supabase do Zero

## ✅ Checklist Rápido

- [ ] 1. Criar conta no Supabase
- [ ] 2. Criar projeto
- [ ] 3. Criar tabela `coletas`
- [ ] 4. Obter credenciais
- [ ] 5. Preencher arquivo `.env`
- [ ] 6. Reiniciar servidor
- [ ] 7. Testar

---

## 📝 PASSO 1: Criar Conta (1 minuto)

1. Acesse: **https://supabase.com**
2. Clique em **"Start your project"**
3. Faça login com:
   - GitHub (recomendado)
   - Google
   - Email

---

## 🏗️ PASSO 2: Criar Projeto (2 minutos)

1. Clique em **"New Project"**
2. Preencha:
   - **Name:** `Sunrise-PDF` (ou outro nome)
   - **Database Password:** Crie uma senha forte (guarde-a!)
   - **Region:** Escolha o mais próximo (ex: `South America (São Paulo)`)
3. Clique em **"Create new project"**
4. ⏳ Aguarde 1-2 minutos (o projeto está sendo criado)

---

## 🗄️ PASSO 3: Criar Tabela (1 minuto)

1. No painel do projeto, clique em **SQL Editor** (ícone de banco de dados no menu lateral)
2. Clique em **"+ New query"**
3. **COPIE E COLE** todo o SQL abaixo:

```sql
-- Criar tabela coletas
CREATE TABLE coletas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Creche/escola
  "idCreche" TEXT,
  professor TEXT,
  "dataColeta" TEXT,
  avaliador TEXT,
  
  -- Criança
  "nomeCrianca" TEXT,
  "idCrianca" TEXT,
  "dataNascimento" TEXT,
  "observacaoCrianca" TEXT,
  
  -- Acelerômetro
  "idAcelerometro" TEXT,
  "dataColocacao" TEXT,
  "horaColocacao" TEXT,
  "dataRetirada" TEXT,
  "horaRetirada" TEXT,
  
  -- Altura/Peso
  altura1 TEXT,
  altura2 TEXT,
  altura3 TEXT,
  peso1 TEXT,
  peso2 TEXT,
  peso3 TEXT,
  "observacaoAlturaPeso" TEXT,
  
  -- Supine Time UP and Go
  "treinoSupine" TEXT,
  "tentativa1Supine" TEXT,
  "tentativa2Supine" TEXT,
  "observacaoSupine" TEXT,
  
  -- Equilíbrio
  "pernaDireita30" TEXT,
  "pernaEsquerda30" TEXT,
  "observacaoEquilibrio" TEXT,
  
  -- Salto horizontal
  "tentativa1Salto" TEXT,
  "tentativa2Salto" TEXT,
  "observacaoSalto" TEXT,
  
  -- Dinamômetro
  "tentativaDireita1Din" TEXT,
  "tentativaEsquerda1Din" TEXT,
  "tentativaDireita2Din" TEXT,
  "tentativaEsquerda2Din" TEXT,
  "observacaoDinamometro" TEXT,
  
  -- Jogo dos 9 Pinos
  "treinoDireita9P" TEXT,
  "tentativaDireita9P" TEXT,
  "treinoEsquerda9P" TEXT,
  "tentativaEsquerda9P" TEXT,
  "observacao9Pinos" TEXT,
  
  -- Mr. Ant
  "pointScore" TEXT,
  "classificacaoAnt" TEXT,
  "numTentativasCorretas" TEXT,
  "horarioTerminoAnt" TEXT,
  "observacaoAnt" TEXT,
  
  -- Go-No Go
  "precisaoGo" TEXT,
  "classificacaoGo" TEXT,
  "precisaoNoGo" TEXT,
  "horarioTerminoGo" TEXT,
  "icGo" TEXT,
  "observacaoGoNoGo" TEXT,
  
  -- Comentários
  comentarios TEXT
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE coletas ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção e leitura pública
CREATE POLICY "Permitir inserção pública" ON coletas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura pública" ON coletas
  FOR SELECT USING (true);
```

4. Clique em **"Run"** (ou pressione `Ctrl/Cmd + Enter`)
5. ✅ Você deve ver: **"Success. No rows returned"**

---

## 🔑 PASSO 4: Obter Credenciais (30 segundos)

1. No menu lateral, clique em **⚙️ Project Settings**
2. Clique em **API**
3. Você verá duas informações importantes:

   **A) Project URL**
   ```
   https://xyzabc123.supabase.co
   ```
   👆 **COPIE** esta URL

   **B) Project API keys** → **anon** **public**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
   ```
   👆 **COPIE** esta chave (clique no ícone de copiar)

---

## 📝 PASSO 5: Preencher .env (30 segundos)

1. **Abra o arquivo `.env`** na raiz do projeto Sunrise-PDF

   No terminal:
   ```bash
   code .env
   # ou
   nano .env
   # ou abra com seu editor preferido
   ```

2. **Substitua** os valores pelos que você copiou:

   ```env
   VITE_SUPABASE_URL=https://xyzabc123.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
   ```

   ⚠️ **IMPORTANTE:**
   - Cole a URL completa (com https://)
   - Cole a chave completa (pode ser bem grande!)
   - Não coloque aspas nem espaços extras

3. **Salve o arquivo** (Ctrl+S / Cmd+S)

---

## 🔄 PASSO 6: Reiniciar Servidor (10 segundos)

1. **Pare o servidor** atual:
   - No terminal onde está rodando, pressione `Ctrl+C`

2. **Inicie novamente:**
   ```bash
   npm run dev
   ```

3. ⏳ Aguarde abrir no navegador

---

## ✅ PASSO 7: Testar (1 minuto)

### Teste 1: Salvar Coleta

1. Acesse o **Formulário de Coleta**
2. Preencha pelo menos o campo **"ID da criança"**: `TESTE001`
3. Clique no botão verde **"Salvar no Supabase"**
4. ✅ Você deve ver: **"✅ Dados salvos no Supabase com sucesso!"**

### Teste 2: Visualizar

1. Clique na aba **"Visualizar Coletas"** no menu
2. ✅ Você deve ver a coleta que acabou de salvar na tabela

### Teste 3: Confirmar no Supabase

1. Volte ao painel do Supabase
2. Clique em **Table Editor** (ícone de tabela)
3. Clique na tabela **coletas**
4. ✅ Você deve ver o registro com `TESTE001`

---

## 🎉 Pronto!

Se todos os testes passaram, está tudo funcionando! 🚀

---

## ❌ Problemas?

### Erro: "Variáveis de ambiente não configuradas"
- ✅ Você criou o arquivo `.env`?
- ✅ O arquivo está na raiz do projeto?
- ✅ Você reiniciou o servidor?
- ✅ As variáveis começam com `VITE_`?

### Erro: "Failed to fetch"
- ✅ A URL do Supabase está correta?
- ✅ Você tem internet?
- ✅ O projeto Supabase está ativo?

### Erro: "Row-level security policy"
- ✅ Você executou o SQL completo?
- ✅ Incluindo as políticas RLS no final?

### Erro: "Invalid API key"
- ✅ Você copiou a chave **anon public** (não a service_role)?
- ✅ A chave está completa (sem cortar)?

---

## 📞 Precisa de Ajuda?

- Consulte: `INICIO_RAPIDO_SUPABASE.md`
- Ou: `SUPABASE_CONFIG.md`
- Documentação Supabase: https://supabase.com/docs

