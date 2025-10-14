# 📝 Funcionalidades CRUD - Visualizar, Editar e Deletar Coletas

## ✅ Funcionalidades Implementadas

### 1. **Visualizar Coleta** (READ)
- ✅ Clique em qualquer linha na aba "Visualizar Coletas"
- ✅ Abre página de detalhes com todos os dados
- ✅ Visualização em modo somente leitura

### 2. **Editar Coleta** (UPDATE/PUT)
- ✅ Botão "✏️ Editar" na página de detalhes
- ✅ Habilita edição de todos os campos
- ✅ Botão "💾 Salvar Alterações" para confirmar
- ✅ Botão "❌ Cancelar" para descartar mudanças

### 3. **Deletar Coleta** (DELETE)
- ✅ Botão "🗑️ Deletar" na página de detalhes
- ✅ Confirmação antes de deletar
- ✅ Retorna automaticamente para a lista

---

## 🎯 Como Usar

### 📋 Listar e Visualizar Coletas

1. **Acesse a aba "Visualizar Coletas"** no menu
2. **Veja a tabela** com todas as coletas salvas:
   - ID da criança
   - Nome
   - Data da coleta
   - Avaliador
   - Data/hora de criação
3. **Clique em qualquer linha** para ver os detalhes

### 👁️ Visualizar Detalhes

Ao clicar em uma linha:
- ✅ Abre página de detalhes
- ✅ Mostra todos os campos preenchidos
- ✅ Campos em modo somente leitura (cinza)
- ✅ Botões disponíveis: **Editar** e **Deletar**

### ✏️ Editar uma Coleta

1. **Na página de detalhes**, clique em **"✏️ Editar"**
2. **Todos os campos ficam editáveis** (fundo branco)
3. **Modifique** os campos desejados
4. **Clique em "💾 Salvar Alterações"**
5. ✅ Aguarde confirmação: "Coleta atualizada com sucesso!"
6. Os campos voltam para modo somente leitura

**Cancelar edição:**
- Clique em **"❌ Cancelar"** para descartar alterações
- Os dados originais são recarregados

### 🗑️ Deletar uma Coleta

1. **Na página de detalhes**, clique em **"🗑️ Deletar"**
2. **Confirme** a ação no alerta:
   ```
   ⚠️ ATENÇÃO!
   
   Tem certeza que deseja deletar esta coleta?
   
   Esta ação não pode ser desfeita.
   ```
3. Se confirmar:
   - ✅ Coleta é deletada do Supabase
   - ✅ Você é redirecionado para a lista
   - ✅ A coleta não aparece mais na tabela

### ⬅️ Voltar para a Lista

- Clique em **"← Voltar para Lista"** a qualquer momento
- Retorna para a tabela de coletas

---

## 🎨 Interface Visual

### Botões e Cores

| Botão | Cor | Função |
|-------|-----|--------|
| **← Voltar para Lista** | Cinza | Retorna para a lista |
| **✏️ Editar** | Azul | Habilita edição |
| **🗑️ Deletar** | Vermelho | Deleta a coleta (com confirmação) |
| **💾 Salvar Alterações** | Verde | Salva mudanças no Supabase |
| **❌ Cancelar** | Amarelo | Cancela edição e recarrega dados |

### Estados dos Campos

**Modo Visualização:**
- 🔒 Campos com fundo cinza (`#f5f5f7`)
- 🔒 Cursor "not-allowed"
- 🔒 Não é possível editar

**Modo Edição:**
- ✏️ Campos com fundo branco
- ✏️ Bordas destacadas ao focar
- ✏️ Todos os campos editáveis

---

## 🔧 Arquivos Modificados/Criados

### Novos Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `src/components/DetalhesColeta.tsx` | Componente de visualização e edição |
| `FUNCIONALIDADES_CRUD.md` | Este arquivo - documentação |

### Arquivos Modificados

| Arquivo | Mudanças |
|---------|----------|
| `src/services/coletaService.ts` | ✅ Adicionadas funções `atualizarColeta()` e `deletarColeta()` |
| `src/components/ListaColetas.tsx` | ✅ Linhas clicáveis<br>✅ Callback `onColetaSelecionada`<br>✅ Dica visual "Clique em uma linha..." |
| `src/App.tsx` | ✅ Importado `DetalhesColeta`<br>✅ Estado `coletaSelecionadaId`<br>✅ Navegação entre lista e detalhes |

---

## 🔄 Fluxo de Navegação

```
┌─────────────────────────────────────────────────────────────┐
│               Aba "Visualizar Coletas"                       │
│                                                              │
│  📋 Tabela de Coletas                                        │
│  ┌────────────────────────────────────────────────────┐     │
│  │ ID      Nome      Data      Avaliador    Criado    │     │
│  ├────────────────────────────────────────────────────┤     │
│  │ CR001   João     14/10/25   Maria       14/10...   │ ←── Clicável
│  │ CR002   Ana      14/10/25   João        14/10...   │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │ CLICA em uma linha
                      ▼
┌─────────────────────────────────────────────────────────────┐
│            Página de Detalhes da Coleta                      │
│                                                              │
│  [← Voltar]          [✏️ Editar] [🗑️ Deletar]              │
│                                                              │
│  📋 Visualizando Coleta - CR001                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Creche/escola     │     Criança                   │     │
│  │  🔒 (somente leitura, campos cinza)                │     │
│  │  ...                                               │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────┬─────────────────┬─────────────────────┘
                      │                 │
         Clica "Editar"│                 │Clica "Deletar"
                      ▼                 ▼
┌────────────────────────────┐  ┌──────────────────────┐
│    Modo Edição             │  │  Confirmação         │
│                            │  │                      │
│ [💾 Salvar] [❌ Cancelar] │  │  ⚠️ Tem certeza?     │
│                            │  │                      │
│ ✏️ (campos editáveis)      │  │  [Sim] [Não]        │
│                            │  │                      │
│ Edita os campos...         │  └──────┬───────────────┘
│                            │         │
│ Clica "Salvar"             │         │Confirma
│          │                 │         │
│          ▼                 │         ▼
│  ✅ Coleta atualizada!     │  ✅ Coleta deletada!
│  (volta modo visualização) │  (volta para lista)
└────────────────────────────┘
```

---

## 📊 Operações da API

### GET - Buscar Coleta
```typescript
buscarColeta(id: string)
```
- **Quando:** Ao clicar em uma linha
- **Retorna:** Todos os dados da coleta
- **Usa:** Supabase `.select().eq('id', id).single()`

### PUT - Atualizar Coleta
```typescript
atualizarColeta(id: string, dados: DadosColeta)
```
- **Quando:** Ao clicar em "Salvar Alterações"
- **Envia:** Todos os campos editados
- **Usa:** Supabase `.update(dados).eq('id', id)`

### DELETE - Deletar Coleta
```typescript
deletarColeta(id: string)
```
- **Quando:** Ao confirmar deleção
- **Remove:** Coleta do banco de dados
- **Usa:** Supabase `.delete().eq('id', id)`

---

## ⚡ Políticas RLS Necessárias

Para as funcionalidades funcionarem, você precisa adicionar permissões de UPDATE e DELETE no Supabase:

```sql
-- Permitir atualização pública
CREATE POLICY "Permitir atualização pública" ON coletas
  FOR UPDATE WITH CHECK (true);

-- Permitir deleção pública
CREATE POLICY "Permitir deleção pública" ON coletas
  FOR DELETE USING (true);
```

### Como adicionar:

1. Acesse o **SQL Editor** no Supabase
2. Cole e execute o SQL acima
3. ✅ Pronto! Agora você pode editar e deletar

⚠️ **IMPORTANTE PARA PRODUÇÃO:**
- Estas políticas permitem acesso público
- Para produção, implemente autenticação
- Restrinja políticas apenas para usuários autenticados

---

## 🧪 Como Testar

### Teste 1: Visualizar
1. ✅ Vá para "Visualizar Coletas"
2. ✅ Clique em uma linha
3. ✅ Veja todos os dados carregados

### Teste 2: Editar
1. ✅ Na página de detalhes, clique "Editar"
2. ✅ Modifique alguns campos
3. ✅ Clique "Salvar Alterações"
4. ✅ Veja mensagem de sucesso
5. ✅ Volte para lista e confirme mudanças

### Teste 3: Cancelar Edição
1. ✅ Clique "Editar"
2. ✅ Modifique campos
3. ✅ Clique "Cancelar"
4. ✅ Confirme que dados originais foram restaurados

### Teste 4: Deletar
1. ✅ Na página de detalhes, clique "Deletar"
2. ✅ Confirme no alerta
3. ✅ Veja mensagem de sucesso
4. ✅ Confirme que voltou para lista
5. ✅ Confirme que coleta não aparece mais

### Teste 5: Voltar
1. ✅ Clique "Voltar para Lista"
2. ✅ Confirme que retornou para tabela
3. ✅ Lista deve recarregar automaticamente

---

## 💡 Dicas de Uso

### ✅ Melhores Práticas

1. **Sempre verifique os dados** antes de salvar edições
2. **Confirme cuidadosamente** antes de deletar (ação irreversível!)
3. **Use "Cancelar"** se mudar de ideia durante edição
4. **Recarregue a lista** após editar/deletar para ver mudanças

### ⚠️ Cuidados

- Deletar uma coleta é **permanente** - não há "desfazer"
- Certifique-se de ter backup antes de deletar dados importantes
- Em modo edição, mudanças não são salvas até clicar "Salvar"
- Se fechar o navegador durante edição, mudanças são perdidas

---

## 🚀 Próximas Melhorias

Funcionalidades que podem ser adicionadas:

- [ ] Confirmação antes de cancelar edição (se houver mudanças)
- [ ] Histórico de alterações (quem editou e quando)
- [ ] Soft delete (marcar como deletado ao invés de remover)
- [ ] Duplicar coleta
- [ ] Exportar coleta individual para PDF
- [ ] Comparar duas coletas
- [ ] Restaurar versão anterior
- [ ] Logs de auditoria
- [ ] Permissões por usuário (quem pode editar/deletar)

---

## 📞 Suporte

**Problemas comuns:**

### "Erro ao atualizar coleta"
- Verifique se executou as políticas RLS de UPDATE
- Confirme que a conexão com Supabase está ativa

### "Erro ao deletar coleta"
- Verifique se executou as políticas RLS de DELETE
- Pode haver registros relacionados em outras tabelas

### Campos não aparecem
- Verifique se a estrutura da tabela está correta
- Confirme que todos os campos existem no banco

---

**Status:** ✅ CRUD Completo Implementado e Funcional
**Data:** 14 de Outubro de 2025
**Versão:** 1.0

