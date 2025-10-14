import React, { useState, useEffect } from 'react';
import { listarColetas, exportarParaExcel } from '../services/coletaService';

interface Coleta {
  id: string;
  idCrianca: string;
  nomeCrianca: string;
  dataColeta: string;
  avaliador: string;
  created_at: string;
  [key: string]: any;
}

interface ListaColetasProps {
  onColetaSelecionada?: (coletaId: string) => void;
}

export default function ListaColetas({ onColetaSelecionada }: ListaColetasProps) {
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  const carregarColetas = async () => {
    setCarregando(true);
    setErro('');
    
    try {
      const resultado = await listarColetas();
      
      if (resultado.sucesso) {
        setColetas(resultado.dados || []);
      } else {
        setErro(resultado.erro || 'Erro ao carregar coletas');
      }
    } catch (error) {
      setErro('Erro ao carregar coletas');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handleExportarExcel = async () => {
    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 2rem; border-radius: 8px; z-index: 9999; font-family: Poppins, sans-serif;';
    loadingMsg.textContent = 'Gerando planilha Excel...';
    document.body.appendChild(loadingMsg);

    try {
      const resultado = await exportarParaExcel();
      document.body.removeChild(loadingMsg);

      if (resultado.sucesso && resultado.dados) {
        alert(`✅ Planilha exportada com sucesso!\n\n📊 ${resultado.dados.totalColetas} coletas exportadas\n📁 Arquivo: ${resultado.dados.nomeArquivo}`);
      } else {
        alert(`❌ Erro ao exportar: ${resultado.erro}`);
      }
    } catch (error) {
      document.body.removeChild(loadingMsg);
      alert('❌ Erro ao exportar para Excel. Verifique o console.');
      console.error(error);
    }
  };

  useEffect(() => {
    carregarColetas();
  }, []);

  // Filtrar coletas com base no termo de busca
  const coletasFiltradas = coletas.filter((coleta) => {
    if (!termoBusca) return true;
    
    const termo = termoBusca.toLowerCase();
    const idCreche = (coleta.idCreche || '').toLowerCase();
    const idCrianca = (coleta.idCrianca || '').toLowerCase();
    const avaliador = (coleta.avaliador || '').toLowerCase();
    
    return (
      idCreche.includes(termo) ||
      idCrianca.includes(termo) ||
      avaliador.includes(termo)
    );
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Coletas Salvas</h2>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleExportarExcel}
            style={styles.excelButton}
            disabled={carregando || coletas.length === 0}
          >
            📊 Exportar Excel
          </button>
          <button 
            onClick={carregarColetas} 
            style={styles.refreshButton}
            disabled={carregando}
          >
            {carregando ? 'Carregando...' : '🔄 Atualizar'}
          </button>
        </div>
      </div>

      {erro && (
        <div style={styles.errorBox}>
          <p style={styles.errorText}>❌ {erro}</p>
          <p style={styles.errorHint}>
            Verifique se as variáveis de ambiente VITE_SUPABASE_URL e 
            VITE_SUPABASE_ANON_KEY estão configuradas corretamente.
          </p>
        </div>
      )}

      {!erro && coletas.length === 0 && !carregando && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Nenhuma coleta encontrada</p>
          <p style={styles.emptyHint}>
            As coletas salvas aparecerão aqui quando você usar o botão 
            "Salvar no Supabase" no formulário.
          </p>
        </div>
      )}

      {!erro && coletas.length > 0 && (
        <>
          {/* Campo de Busca */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Buscar por ID da creche, ID da criança ou avaliador..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={styles.searchInput}
            />
            {termoBusca && (
              <button
                onClick={() => setTermoBusca('')}
                style={styles.clearButton}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          {/* Resultado da busca */}
          {termoBusca && (
            <p style={styles.searchResult}>
              {coletasFiltradas.length === 0 ? (
                <span style={styles.noResults}>
                  ❌ Nenhum resultado encontrado para "{termoBusca}"
                </span>
              ) : (
                <span style={styles.hasResults}>
                  ✅ {coletasFiltradas.length} {coletasFiltradas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </span>
              )}
            </p>
          )}

          <div style={styles.tableContainer}>
            {coletasFiltradas.length > 0 && (
              <p style={styles.clickHint}>
                💡 Clique em uma linha para visualizar e editar a coleta
              </p>
            )}
            {coletasFiltradas.length > 0 ? (
              <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>ID Criança</th>
                <th style={styles.tableHeader}>Nome</th>
                <th style={styles.tableHeader}>Data Coleta</th>
                <th style={styles.tableHeader}>Avaliador</th>
                <th style={styles.tableHeader}>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {coletasFiltradas.map((coleta) => (
                <tr 
                  key={coleta.id} 
                  style={styles.tableRow}
                  onClick={() => onColetaSelecionada && onColetaSelecionada(coleta.id)}
                >
                  <td style={styles.tableCell}>{coleta.idCrianca || '-'}</td>
                  <td style={styles.tableCell}>{coleta.nomeCrianca || '-'}</td>
                  <td style={styles.tableCell}>
                    {coleta.dataColeta ? new Date(coleta.dataColeta).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td style={styles.tableCell}>{coleta.avaliador || '-'}</td>
                  <td style={styles.tableCell}>
                    {new Date(coleta.created_at).toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            ) : (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>Nenhum resultado encontrado</p>
                <p style={styles.emptyHint}>
                  Tente buscar por outro termo
                </p>
              </div>
            )}
          <p style={styles.totalText}>
            {termoBusca ? (
              <>Mostrando {coletasFiltradas.length} de {coletas.length} {coletas.length === 1 ? 'coleta' : 'coletas'}</>
            ) : (
              <>Total: {coletas.length} {coletas.length === 1 ? 'coleta' : 'coletas'}</>
            )}
          </p>
        </div>
        </>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '1.5rem',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '1.75rem',
    fontWeight: '600',
    margin: 0
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  excelButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #28a745, #20c997)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  refreshButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #3ECF8E, #2E7D5E)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  errorBox: {
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  errorText: {
    color: '#c00',
    margin: '0 0 0.5rem 0',
    fontWeight: '600',
    fontSize: '1rem'
  },
  errorHint: {
    color: '#666',
    margin: 0,
    fontSize: '0.85rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem 1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  emptyText: {
    fontSize: '1.25rem',
    color: '#666',
    margin: '0 0 0.75rem 0',
    fontWeight: '500'
  },
  emptyHint: {
    fontSize: '0.95rem',
    color: '#999',
    margin: 0
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '1.5rem'
  },
  searchInput: {
    width: '100%',
    padding: '0.875rem 3rem 0.875rem 1rem',
    fontSize: '0.95rem',
    border: '2px solid #d0d0d0',
    borderRadius: '8px',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    boxSizing: 'border-box'
  },
  clearButton: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 'bold'
  },
  searchResult: {
    margin: '0 0 1rem 0',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  noResults: {
    color: '#dc3545'
  },
  hasResults: {
    color: '#28a745'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  clickHint: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f0f8ff',
    borderRadius: '6px',
    border: '1px solid #b8daff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '1rem'
  },
  tableHeaderRow: {
    background: 'linear-gradient(135deg, #613789, #FD9630)',
  },
  tableHeader: {
    padding: '1rem',
    textAlign: 'left',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap'
  },
  tableRow: {
    borderBottom: '1px solid #e0e0e0',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  },
  tableCell: {
    padding: '0.875rem 1rem',
    fontSize: '0.875rem',
    color: '#333'
  },
  totalText: {
    textAlign: 'right',
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: '500',
    margin: 0
  }
};

