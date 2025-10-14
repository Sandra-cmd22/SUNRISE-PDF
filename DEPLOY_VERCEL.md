# 🚀 Deploy no Vercel - Branch Api

## ✅ Pré-requisitos

- ✅ Branch **Api** está no GitHub
- ✅ Conta no Vercel (https://vercel.com)
- ✅ Supabase configurado com credenciais

---

## 📋 Passo a Passo

### 1️⃣ **Acessar o Vercel**

1. Acesse: https://vercel.com
2. Faça login (use a mesma conta do GitHub)

### 2️⃣ **Ir para o Projeto Existente**

Se você já tem o projeto no Vercel:

1. Clique no seu projeto **Sunrise-PDF**
2. Vá em **Settings**
3. Role até **Git** → **Production Branch**
4. Mude de `main` para **`Api`**
5. Clique em **Save**

### 3️⃣ **Configurar Variáveis de Ambiente**

**IMPORTANTE:** O Vercel precisa das mesmas variáveis que você tem no `.env` local!

1. No seu projeto no Vercel, vá em **Settings**
2. Clique em **Environment Variables** (menu lateral)
3. Adicione as seguintes variáveis:

#### Variável 1:
```
Name: VITE_SUPABASE_URL
Value: https://jssucohdicspywtzxvrx.supabase.co
```

#### Variável 2:
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzc3Vjb2hkaWNzcHl3dHp4dnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTQ1MTUsImV4cCI6MjA3NjAzMDUxNX0.R8gDaYBwzi7onKI-LKEO8Qf5UwGYjpk3sVzgifc0m-Y
```

**Para cada variável:**
- Clique em **Add New**
- Cole o **Name**
- Cole o **Value**
- Selecione: ✅ **Production**, ✅ **Preview**, ✅ **Development**
- Clique em **Save**

### 4️⃣ **Fazer Deploy**

Opção A: **Forçar novo deploy**
```
1. Vá em "Deployments"
2. Clique nos "..." da última deployment
3. Clique em "Redeploy"
4. Confirme
```

Opção B: **Trigger automático**
```
Qualquer push na branch Api vai gerar deploy automático
```

### 5️⃣ **Aguardar Build**

1. O Vercel vai:
   - ✅ Baixar o código da branch **Api**
   - ✅ Instalar dependências (`npm install`)
   - ✅ Rodar build (`npm run build`)
   - ✅ Fazer deploy

2. Tempo estimado: **2-5 minutos**

3. Status:
   - 🟡 **Building...** - Aguarde
   - ✅ **Ready** - Sucesso!
   - ❌ **Failed** - Veja os logs

### 6️⃣ **Verificar Deploy**

Quando terminar:
1. Clique no link do deploy (ex: `sunrise-pdf.vercel.app`)
2. Teste as funcionalidades:
   - ✅ Formulário de Coleta
   - ✅ Salvar no Supabase
   - ✅ Visualizar Coletas
   - ✅ Editar/Deletar
   - ✅ Exportar Excel

---

## 🔍 Método Alternativo: Deploy Novo

Se preferir criar um deploy novo (sem alterar o existente):

### Passo 1: Importar Projeto
1. No Vercel, clique em **Add New** → **Project**
2. Selecione o repositório **Sunrise-PDF**
3. Clique em **Import**

### Passo 2: Configurar Build
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Passo 3: Selecionar Branch
- Em **Git Branch**: Selecione **Api** (não main)

### Passo 4: Adicionar Variáveis de Ambiente
Igual ao passo 3️⃣ acima:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Passo 5: Deploy
- Clique em **Deploy**
- Aguarde 2-5 minutos

---

## ✅ Checklist Pós-Deploy

Após o deploy, teste:

- [ ] Site abre sem erros
- [ ] Formulário de Coleta funciona
- [ ] Botão "Salvar no Supabase" funciona
- [ ] Aba "Visualizar Coletas" abre
- [ ] Tabela de coletas carrega
- [ ] Clicar em linha abre detalhes
- [ ] Botão "Editar" funciona
- [ ] Botão "Deletar" funciona
- [ ] Botão "Exportar Excel" funciona
- [ ] Download do Excel funciona
- [ ] Console do navegador sem erros (F12)

---

## 🐛 Solução de Problemas

### Erro: "Environment variables not configured"

**Causa:** Variáveis de ambiente não foram adicionadas no Vercel

**Solução:**
1. Vá em Settings → Environment Variables
2. Adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. Redeploy (Deployments → Redeploy)

### Erro: Build Failed

**Causa:** Erro de TypeScript ou dependências

**Solução:**
1. Clique no deploy failed
2. Veja os logs (Build Logs)
3. Procure por erros vermelhos
4. Copie o erro e me envie

### Erro: 404 na API

**Causa:** Este projeto usa Vite, não Next.js (não há API routes)

**Solução:**
- ✅ Está correto! Usamos Supabase diretamente do frontend
- ❌ Não precisa de `/api` routes

### Erro: "Failed to fetch" no console

**Causa:** Variáveis de ambiente incorretas

**Solução:**
1. Verifique no Vercel: Settings → Environment Variables
2. Confirme que os valores estão corretos
3. Redeploy

### Site funciona local mas não no Vercel

**Causa:** Falta adicionar variáveis de ambiente

**Solução:**
1. Compare seu `.env` local com as variáveis no Vercel
2. Certifique-se que ambas estão iguais
3. Redeploy

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças:

```bash
# No seu computador:
git add .
git commit -m "Descrição da mudança"
git push origin Api

# No Vercel:
- Deploy automático vai iniciar
- Aguarde 2-5 minutos
- Site atualizado! ✅
```

---

## 📊 Monitoramento

### Ver Logs em Tempo Real

1. Vercel Dashboard → Seu Projeto
2. Clique no deploy ativo
3. Vá em **Function Logs** ou **Runtime Logs**
4. Veja requests e erros

### Analytics

1. Vercel Dashboard → Analytics
2. Veja:
   - Visitantes
   - Performance
   - Erros
   - Uso de recursos

---

## 🌐 URLs do Projeto

Depois do deploy, você terá:

**URL de Produção:**
```
https://sunrise-pdf.vercel.app
```

**URL de Preview (branch Api):**
```
https://sunrise-pdf-git-api-seu-usuario.vercel.app
```

**URL do Supabase:**
```
https://jssucohdicspywtzxvrx.supabase.co
```

---

## 🔐 Segurança no Deploy

### ✅ O que está seguro:

- ✅ Variáveis de ambiente não aparecem no código
- ✅ `VITE_SUPABASE_ANON_KEY` é pública (OK para frontend)
- ✅ Políticas RLS do Supabase protegem os dados
- ✅ HTTPS automático (SSL)

### ⚠️ Melhorias para Produção:

Antes de usar com dados reais:

1. **Adicionar autenticação:**
   - Supabase Auth
   - Apenas usuários logados podem acessar

2. **Melhorar políticas RLS:**
   - Restringir a usuários autenticados
   - Ver `POLITICAS_UPDATE_DELETE.sql`

3. **Adicionar domínio próprio:**
   - Vercel Settings → Domains
   - Adicionar seu domínio personalizado

4. **Configurar Analytics:**
   - Google Analytics
   - Vercel Analytics

---

## 📞 Suporte

### Problemas com Vercel:
- Docs: https://vercel.com/docs
- Status: https://vercel-status.com

### Problemas com Supabase:
- Docs: https://supabase.com/docs
- Status: https://status.supabase.com

### Problemas com o Código:
- Veja os logs no console (F12)
- Verifique o console do Vercel
- Consulte a documentação do projeto

---

## ✨ Resumo Rápido

```bash
# 1. Já fizemos (branch no GitHub) ✅
git push origin Api

# 2. No Vercel:
- Settings → Git → Production Branch → Api
- Settings → Environment Variables → Adicionar as 2 variáveis
- Deployments → Redeploy

# 3. Aguarde 2-5 min ⏳

# 4. Teste tudo ✅

# 5. Pronto! 🎉
```

---

## 🎯 O Que Vai Funcionar no Vercel

Depois do deploy correto, vai funcionar:

✅ **Frontend completo:**
- Formulário de Coleta
- Monitoramento de Acelerômetro
- Questionário Pais

✅ **CRUD com Supabase:**
- Criar coletas (Salvar no Supabase)
- Listar coletas (Visualizar Coletas)
- Editar coletas (Detalhes → Editar)
- Deletar coletas (Detalhes → Deletar)

✅ **Exportação:**
- Exportar Excel (Download local)
- Exportar CSV (Download local)
- Gerar PDF (Download local)

✅ **Banco de Dados:**
- Supabase continua funcionando normal
- Mesmos dados acessíveis de qualquer lugar

---

**Status:** ✅ Branch Api pronta para deploy!  
**Próximo passo:** Configurar variáveis no Vercel e fazer deploy  
**Tempo estimado:** 5-10 minutos

