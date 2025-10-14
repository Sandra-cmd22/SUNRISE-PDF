# 🚀 Início Rápido - Integração com Supabase

## ✅ O que foi implementado

- ✅ Cliente Supabase configurado (`src/lib/supabase.ts`)
- ✅ Serviço de coletas com funções de salvar e listar (`src/services/coletaService.ts`)
- ✅ Botão "Salvar no Supabase" no FormularioColeta
- ✅ Nova aba "Visualizar Coletas" no menu
- ✅ Componente ListaColetas para exibir coletas salvas

## 📋 Passos para Configurar (5 minutos)

### 1. Criar conta no Supabase
```
👉 Acesse: https://supabase.com
👉 Clique em "Start your project"
👉 Crie uma conta gratuita
👉 Crie um novo projeto
```

### 2. Criar a tabela no Supabase

No painel do Supabase:
1. Vá em **SQL Editor** (ícone de banco de dados)
2. Clique em **New query**
3. Cole o SQL completo do arquivo `SUPABASE_CONFIG.md` (seção 2)
4. Clique em **Run** (ou pressione Ctrl/Cmd + Enter)

### 3. Obter credenciais

1. Vá em **Project Settings** (ícone ⚙️)
2. Clique em **API**
3. Copie:
   - **Project URL**
   - **anon public** (em Project API keys)

### 4. Criar arquivo .env

Crie um arquivo chamado `.env` na raiz do projeto com este conteúdo:

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

**Exemplo real:**
```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjM5NzE4NzQsImV4cCI6MTkzOTU0Nzg3NH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Reiniciar o servidor

```bash
# Pare o servidor (Ctrl+C) se estiver rodando
npm run dev
```

## 🎯 Como Usar

### Salvar uma coleta:
1. Preencha o **Formulário de Coleta**
2. Clique em **"Salvar no Supabase"**
3. Aguarde a mensagem de sucesso ✅

### Visualizar coletas salvas:
1. Clique na aba **"Visualizar Coletas"** no menu
2. Veja todas as coletas salvas
3. Clique em **"🔄 Atualizar"** para recarregar

## 🔍 Verificar se funcionou

### No navegador:
- Abra o Console (F12)
- Ao salvar, você deve ver: `"Dados salvos: {...}"`
- Se der erro, verifique a mensagem no console

### No Supabase:
1. Vá em **Table Editor** (ícone de tabela)
2. Clique na tabela **coletas**
3. Você deve ver os registros salvos

## ❌ Solução de Problemas

### "Variáveis de ambiente não configuradas"
```bash
# Verifique se o arquivo .env existe:
ls -la .env

# Se não existir, crie-o com as credenciais
```

### "Failed to fetch" ou erro de rede
- ✅ Verifique se a URL do Supabase está correta
- ✅ Confirme que você tem internet
- ✅ Verifique se o projeto Supabase está ativo

### "Row-level security policy violation"
- ✅ Você executou o SQL completo do SUPABASE_CONFIG.md?
- ✅ As políticas públicas foram criadas?

### Dados não aparecem na lista
- ✅ Recarregue a página (F5)
- ✅ Clique no botão "🔄 Atualizar"
- ✅ Verifique o console do navegador (F12)

## 📁 Arquivos Criados/Modificados

```
📦 Sunrise-PDF
├── 📄 SUPABASE_CONFIG.md          ← Guia completo de configuração
├── 📄 INICIO_RAPIDO_SUPABASE.md   ← Este arquivo
├── 📄 .env                         ← Criar este arquivo com suas credenciais
│
└── src/
    ├── lib/
    │   └── 📄 supabase.ts          ← Configuração do cliente
    │
    ├── services/
    │   └── 📄 coletaService.ts     ← Funções de salvar/listar
    │
    └── components/
        ├── 📄 FormularioColeta.tsx  ← Atualizado com botão Supabase
        ├── 📄 ListaColetas.tsx      ← Novo componente de listagem
        ├── 📄 Header.tsx            ← Atualizado com nova aba
        └── 📄 README_SUPABASE.md    ← Documentação dos componentes
```

## 🎓 Próximos Passos (Opcional)

Depois de tudo funcionando, você pode:

- [ ] Adicionar autenticação de usuários
- [ ] Implementar edição de coletas
- [ ] Criar filtros e busca
- [ ] Exportar dados para Excel
- [ ] Criar dashboards e gráficos
- [ ] Implementar backup automático

## 📚 Documentação Completa

- **SUPABASE_CONFIG.md** - Instruções detalhadas + SQL da tabela
- **src/components/README_SUPABASE.md** - Documentação dos componentes

## 💡 Dica

O arquivo `.env` não deve ser commitado no Git (já está no .gitignore).
Cada desenvolvedor deve ter seu próprio arquivo `.env` com suas credenciais.

---

**Precisa de ajuda?** Consulte a documentação oficial do Supabase: https://supabase.com/docs

