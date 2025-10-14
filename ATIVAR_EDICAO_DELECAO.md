# ⚡ ATIVAR EDIÇÃO E DELEÇÃO - Guia Rápido (1 minuto)

## 🎯 O que você precisa fazer

Para que os botões **"✏️ Editar"** e **"🗑️ Deletar"** funcionem, você precisa executar um SQL no Supabase.

---

## 📋 Passo a Passo (1 minuto)

### 1️⃣ Acessar SQL Editor

Vá para: https://app.supabase.com/project/jssucohdicspywtzxvrx/sql/new

Ou:
1. Abra seu projeto no Supabase
2. Clique em **SQL Editor** no menu lateral
3. Clique em **+ New query**

### 2️⃣ Copiar e Colar SQL

Cole este código:

```sql
-- Permitir atualização (UPDATE) pública
CREATE POLICY "Permitir atualização pública" ON coletas
  FOR UPDATE WITH CHECK (true);

-- Permitir deleção (DELETE) pública
CREATE POLICY "Permitir deleção pública" ON coletas
  FOR DELETE USING (true);
```

### 3️⃣ Executar

- Clique em **Run** (ou pressione `Ctrl/Cmd + Enter`)
- ✅ Você deve ver: **"Success. No rows returned"**

### 4️⃣ Pronto!

Agora você pode:
- ✅ Editar coletas existentes
- ✅ Deletar coletas

---

## 🧪 Testar

1. Vá para **"Visualizar Coletas"**
2. Clique em uma linha
3. Tente clicar em **"✏️ Editar"**
4. Deve funcionar! ✅

---

## ❓ Não Funcionou?

### Erro: "new row violates row-level security policy"

**Causa:** As políticas não foram criadas ou falharam.

**Solução:**

1. Verifique se as políticas existem:

```sql
SELECT * FROM pg_policies WHERE tablename = 'coletas';
```

Você deve ver **4 políticas**:
- Permitir inserção pública
- Permitir leitura pública
- **Permitir atualização pública** ← Nova
- **Permitir deleção pública** ← Nova

2. Se não aparecerem as novas, execute o SQL novamente

3. Se ainda não funcionar, delete e recrie:

```sql
-- Deletar se existirem
DROP POLICY IF EXISTS "Permitir atualização pública" ON coletas;
DROP POLICY IF EXISTS "Permitir deleção pública" ON coletas;

-- Recriar
CREATE POLICY "Permitir atualização pública" ON coletas
  FOR UPDATE WITH CHECK (true);

CREATE POLICY "Permitir deleção pública" ON coletas
  FOR DELETE USING (true);
```

---

## ⚠️ Importante para Produção

Estas políticas permitem que **qualquer pessoa** edite e delete coletas.

**Para produção:**
- Implemente autenticação
- Use políticas mais restritivas
- Ver arquivo: `POLITICAS_UPDATE_DELETE.sql`

---

## ✅ Checklist

- [ ] Abri o SQL Editor no Supabase
- [ ] Copiei e colei o SQL
- [ ] Executei com sucesso
- [ ] Testei editar uma coleta
- [ ] Testei deletar uma coleta
- [ ] Tudo funcionando! 🎉

---

**Tempo total:** ~1 minuto  
**Dificuldade:** ⭐ Muito Fácil  
**Status após:** ✅ CRUD Completo Funcional

