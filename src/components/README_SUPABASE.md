# Como Usar o Supabase no Formulário de Coleta

## Componentes Criados

### 1. **FormularioColeta.tsx** (atualizado)
- Botão **"Salvar no Supabase"** adicionado
- Salva todos os dados do formulário diretamente no banco Supabase

### 2. **ListaColetas.tsx** (novo)
- Componente para visualizar todas as coletas salvas
- Atualização em tempo real
- Mostra informações resumidas (ID criança, nome, data, avaliador)

### 3. **coletaService.ts** (novo)
- Funções para interagir com o Supabase:
  - `salvarColeta(dados)` - Salva uma nova coleta
  - `listarColetas()` - Lista todas as coletas
  - `buscarColeta(id)` - Busca uma coleta específica

### 4. **supabase.ts** (novo)
- Configuração do cliente Supabase
- Usa variáveis de ambiente para segurança

## Como Adicionar o ListaColetas ao App

Para visualizar as coletas salvas, adicione o componente `ListaColetas` ao seu `App.tsx`:

```tsx
import FormularioColeta from './components/FormularioColeta';
import ListaColetas from './components/ListaColetas';

function App() {
  return (
    <div>
      <FormularioColeta />
      <ListaColetas />
    </div>
  );
}

export default App;
```

## Fluxo de Uso

1. **Configurar Supabase** (ver SUPABASE_CONFIG.md na raiz do projeto)
   - Criar conta
   - Criar projeto
   - Criar tabela `coletas`
   - Obter credenciais

2. **Configurar arquivo .env**
   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

3. **Usar o formulário**
   - Preencher os dados
   - Clicar em "Salvar no Supabase"
   - Ver confirmação de sucesso

4. **Visualizar coletas salvas**
   - Acessar o componente ListaColetas
   - Ou ver no painel do Supabase

## Estrutura dos Dados Salvos

Todos os campos do formulário são salvos, incluindo:
- Dados da creche/escola
- Dados da criança
- Medições do acelerômetro
- Altura e peso
- Testes de desempenho motor
- Testes cognitivos (Mr. Ant, Go-No Go)
- Comentários

## Vantagens da Integração com Supabase

✅ **Banco de dados em nuvem** - Acesso de qualquer lugar  
✅ **Gratuito** - Plano free generoso  
✅ **Real-time** - Dados sincronizados instantaneamente  
✅ **Seguro** - Row Level Security (RLS)  
✅ **Escalável** - Suporta milhares de registros  
✅ **API REST automática** - Não precisa criar backend  

## Próximos Passos (Opcional)

- Adicionar autenticação de usuários
- Implementar edição de coletas
- Exportar dados para CSV/Excel
- Criar dashboards e relatórios
- Adicionar filtros e busca avançada

