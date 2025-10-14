# Configuração do Supabase

Este documento explica como configurar o Supabase para salvar os dados do formulário de coleta.

## 1. Criar Conta no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

## 2. Criar a Tabela `coletas`

No painel do Supabase, vá em **SQL Editor** e execute o seguinte script:

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
-- ATENÇÃO: Esta política permite acesso público. 
-- Para produção, você deve implementar autenticação e políticas mais restritivas.
CREATE POLICY "Permitir inserção pública" ON coletas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir leitura pública" ON coletas
  FOR SELECT USING (true);
```

## 3. Obter as Credenciais

1. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie os seguintes valores:
   - **Project URL** (URL do projeto)
   - **anon public** (Chave pública anônima)

## 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
VITE_SUPABASE_URL=sua_url_do_projeto_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

**Exemplo:**
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Reiniciar o Servidor de Desenvolvimento

Após criar o arquivo `.env`, reinicie o servidor:

```bash
npm run dev
```

## 6. Testar a Integração

1. Preencha o formulário de coleta
2. Clique no botão **"Salvar no Supabase"**
3. Você deve ver uma mensagem de sucesso
4. Verifique no painel do Supabase em **Table Editor** > **coletas** se o registro foi salvo

## 7. Visualizar Coletas Salvas

Para visualizar as coletas salvas, você pode:

1. Acessar o componente `ListaColetas` (se adicionado à aplicação)
2. Ou visualizar diretamente no painel do Supabase em **Table Editor** > **coletas**

## Segurança (Importante para Produção)

⚠️ **ATENÇÃO:** As políticas configuradas permitem acesso público (qualquer pessoa pode inserir e ler dados).

Para produção, você deve:

1. Implementar autenticação de usuários
2. Modificar as políticas RLS para permitir apenas usuários autenticados
3. Adicionar validação de dados
4. Implementar controle de acesso baseado em funções (RBAC)

### Exemplo de Política Mais Segura:

```sql
-- Remover políticas públicas
DROP POLICY "Permitir inserção pública" ON coletas;
DROP POLICY "Permitir leitura pública" ON coletas;

-- Permitir apenas usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir" ON coletas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ler" ON coletas
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Estrutura de Arquivos Criados

```
src/
├── lib/
│   └── supabase.ts          # Configuração do cliente Supabase
├── services/
│   └── coletaService.ts     # Funções para salvar e listar coletas
└── components/
    ├── FormularioColeta.tsx # Formulário atualizado com botão Supabase
    └── ListaColetas.tsx     # Componente para listar coletas salvas
```

## Solução de Problemas

### Erro: "Variáveis de ambiente não configuradas"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Certifique-se de que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento

### Erro: "Failed to fetch" ou erro de rede
- Verifique se a URL do Supabase está correta
- Verifique sua conexão com a internet
- Confirme se o projeto Supabase está ativo

### Erro: "new row violates row-level security policy"
- Verifique se você executou as políticas RLS no SQL Editor
- Certifique-se de que as políticas públicas foram criadas

### Dados não aparecem na lista
- Recarregue a página
- Verifique o console do navegador para erros
- Confirme que os dados foram salvos no painel do Supabase

## Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

