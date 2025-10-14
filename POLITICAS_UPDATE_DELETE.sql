-- ===============================================
-- POLÍTICAS RLS PARA UPDATE E DELETE
-- ===============================================
-- Execute este SQL no Supabase SQL Editor para 
-- habilitar edição e deleção de coletas
-- ===============================================

-- Permitir atualização (UPDATE) pública
CREATE POLICY "Permitir atualização pública" ON coletas
  FOR UPDATE WITH CHECK (true);

-- Permitir deleção (DELETE) pública
CREATE POLICY "Permitir deleção pública" ON coletas
  FOR DELETE USING (true);

-- ===============================================
-- VERIFICAR POLÍTICAS
-- ===============================================
-- Execute para ver todas as políticas ativas:

-- SELECT * FROM pg_policies WHERE tablename = 'coletas';

-- ===============================================
-- RESULTADO ESPERADO:
-- ===============================================
-- Você deve ver 4 políticas:
-- 1. "Permitir inserção pública" (INSERT)
-- 2. "Permitir leitura pública" (SELECT)
-- 3. "Permitir atualização pública" (UPDATE) ← Nova
-- 4. "Permitir deleção pública" (DELETE) ← Nova
-- ===============================================

-- ===============================================
-- POLÍTICAS MAIS SEGURAS (PARA PRODUÇÃO)
-- ===============================================
-- ⚠️ ATENÇÃO: As políticas acima permitem acesso
-- público para desenvolvimento/testes.
-- 
-- Para PRODUÇÃO, use políticas mais restritivas:
-- ===============================================

-- EXEMPLO: Apenas usuários autenticados

-- Remover políticas públicas:
-- DROP POLICY "Permitir atualização pública" ON coletas;
-- DROP POLICY "Permitir deleção pública" ON coletas;

-- Criar políticas restritas:
-- CREATE POLICY "Usuários autenticados podem atualizar" ON coletas
--   FOR UPDATE 
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Usuários autenticados podem deletar" ON coletas
--   FOR DELETE 
--   USING (auth.role() = 'authenticated');

-- ===============================================
-- EXEMPLO: Apenas o criador pode editar/deletar
-- ===============================================
-- Requer adicionar coluna 'user_id' na tabela:

-- ALTER TABLE coletas ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Então criar políticas:
-- CREATE POLICY "Usuários podem atualizar suas coletas" ON coletas
--   FOR UPDATE 
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Usuários podem deletar suas coletas" ON coletas
--   FOR DELETE 
--   USING (auth.uid() = user_id);

-- ===============================================
-- DICAS DE SEGURANÇA
-- ===============================================
-- 1. Use políticas públicas apenas em desenvolvimento
-- 2. Implemente autenticação antes de ir para produção
-- 3. Teste as políticas antes de fazer deploy
-- 4. Documente quem pode fazer o quê
-- 5. Considere adicionar logs de auditoria
-- ===============================================

