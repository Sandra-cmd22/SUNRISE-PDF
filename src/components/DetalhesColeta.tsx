import React, { useState, useEffect } from 'react';
import { buscarColeta, atualizarColeta, deletarColeta, DadosColeta } from '../services/coletaService';

interface DetalhesColetaProps {
  coletaId: string;
  onVoltar: () => void;
  onColetaDeletada: () => void;
}

export default function DetalhesColeta({ coletaId, onVoltar, onColetaDeletada }: DetalhesColetaProps) {
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<DadosColeta>({
    idCreche: '', professor: '', dataColeta: '', avaliador: '',
    nomeCrianca: '', idCrianca: '', dataNascimento: '', observacaoCrianca: '',
    idAcelerometro: '', dataColocacao: '', horaColocacao: '', dataRetirada: '', horaRetirada: '',
    altura1: '', altura2: '', altura3: '', peso1: '', peso2: '', peso3: '', observacaoAlturaPeso: '',
    treinoSupine: '', tentativa1Supine: '', tentativa2Supine: '', observacaoSupine: '',
    pernaDireita30: '', pernaEsquerda30: '', observacaoEquilibrio: '',
    tentativa1Salto: '', tentativa2Salto: '', observacaoSalto: '',
    tentativaDireita1Din: '', tentativaEsquerda1Din: '', tentativaDireita2Din: '', tentativaEsquerda2Din: '', observacaoDinamometro: '',
    treinoDireita9P: '', tentativaDireita9P: '', treinoEsquerda9P: '', tentativaEsquerda9P: '', observacao9Pinos: '',
    pointScore: '', classificacaoAnt: '', numTentativasCorretas: '', horarioTerminoAnt: '', observacaoAnt: '',
    precisaoGo: '', classificacaoGo: '', precisaoNoGo: '', horarioTerminoGo: '', icGo: '', observacaoGoNoGo: '',
    comentarios: ''
  });

  useEffect(() => {
    carregarColeta();
  }, [coletaId]);

  const carregarColeta = async () => {
    setCarregando(true);
    const resultado = await buscarColeta(coletaId);
    
    if (resultado.sucesso && resultado.dados) {
      setFormData(resultado.dados as DadosColeta);
    } else {
      alert('❌ Erro ao carregar coleta: ' + resultado.erro);
    }
    
    setCarregando(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSalvar = async () => {
    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 2rem; border-radius: 8px; z-index: 9999; font-family: Poppins, sans-serif;';
    loadingMsg.textContent = 'Salvando alterações...';
    document.body.appendChild(loadingMsg);

    const resultado = await atualizarColeta(coletaId, formData);
    document.body.removeChild(loadingMsg);

    if (resultado.sucesso) {
      alert('✅ Coleta atualizada com sucesso!');
      setEditando(false);
    } else {
      alert('❌ Erro ao atualizar: ' + resultado.erro);
    }
  };

  const handleDeletar = async () => {
    const confirmar = window.confirm(
      '⚠️ ATENÇÃO!\n\nTem certeza que deseja deletar esta coleta?\n\nEsta ação não pode ser desfeita.'
    );

    if (!confirmar) return;

    const loadingMsg = document.createElement('div');
    loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: white; padding: 2rem; border-radius: 8px; z-index: 9999; font-family: Poppins, sans-serif;';
    loadingMsg.textContent = 'Deletando coleta...';
    document.body.appendChild(loadingMsg);

    const resultado = await deletarColeta(coletaId);
    document.body.removeChild(loadingMsg);

    if (resultado.sucesso) {
      alert('✅ Coleta deletada com sucesso!');
      onColetaDeletada();
    } else {
      alert('❌ Erro ao deletar: ' + resultado.erro);
    }
  };

  if (carregando) {
    return (
      <div style={styles.loading}>
        <p>Carregando coleta...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header com botões de ação */}
      <div style={styles.header}>
        <button onClick={onVoltar} style={styles.voltarButton}>
          ← Voltar para Lista
        </button>
        
        <div style={styles.actionButtons}>
          {!editando ? (
            <>
              <button onClick={() => setEditando(true)} style={styles.editarButton}>
                ✏️ Editar
              </button>
              <button onClick={handleDeletar} style={styles.deletarButton}>
                🗑️ Deletar
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSalvar} style={styles.salvarButton}>
                💾 Salvar Alterações
              </button>
              <button 
                onClick={() => {
                  setEditando(false);
                  carregarColeta(); // Recarregar dados originais
                }} 
                style={styles.cancelarButton}
              >
                ❌ Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Título com ID da criança */}
      <h1 style={styles.mainTitle}>
        {editando ? '✏️ Editando Coleta' : '📋 Visualizando Coleta'}
        {formData.idCrianca && ` - ${formData.idCrianca}`}
      </h1>

      {/* Formulário */}
      <form style={styles.form}>
        {/* Seções lado a lado: Creche/escola e Criança */}
        <div style={styles.row}>
          <section style={styles.sectionHalf}>
            <h2 style={styles.sectionTitle}>Creche/escola</h2>
            <div style={styles.compactGrid}>
              <Campo label="ID do creche/escola:" name="idCreche" value={formData.idCreche} onChange={handleChange} disabled={!editando} />
              <Campo label="Professor(a):" name="professor" value={formData.professor} onChange={handleChange} disabled={!editando} />
              <Campo label="Data da coleta:" name="dataColeta" type="date" value={formData.dataColeta} onChange={handleChange} disabled={!editando} />
              <Campo label="Nome do avaliador(a):" name="avaliador" value={formData.avaliador} onChange={handleChange} disabled={!editando} />
            </div>
          </section>

          <section style={styles.sectionHalf}>
            <h2 style={styles.sectionTitle}>Criança</h2>
            <div style={styles.compactGrid}>
              <Campo label="Nome da criança:" name="nomeCrianca" value={formData.nomeCrianca} onChange={handleChange} disabled={!editando} />
              <Campo label="ID da criança:" name="idCrianca" value={formData.idCrianca} onChange={handleChange} disabled={!editando} />
              <Campo label="Data de nascimento:" name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} disabled={!editando} />
              <Campo label="Observação:" name="observacaoCrianca" value={formData.observacaoCrianca} onChange={handleChange} disabled={!editando} />
            </div>
          </section>
        </div>

        {/* Seção: Acelerômetro */}
        <section style={styles.sectionFull}>
          <h2 style={styles.sectionTitle}>1. Acelerômetro</h2>
          <Campo label="ID Acelerômetro:" name="idAcelerometro" value={formData.idAcelerometro} onChange={handleChange} disabled={!editando} />
          <div style={styles.inlineRow}>
            <Campo label="Data de colocação:" name="dataColocacao" type="date" value={formData.dataColocacao} onChange={handleChange} disabled={!editando} />
            <Campo label="Hora da colocação:" name="horaColocacao" type="time" value={formData.horaColocacao} onChange={handleChange} disabled={!editando} />
            <Campo label="Data de retirada:" name="dataRetirada" type="date" value={formData.dataRetirada} onChange={handleChange} disabled={!editando} />
            <Campo label="Hora da retirada:" name="horaRetirada" type="time" value={formData.horaRetirada} onChange={handleChange} disabled={!editando} />
          </div>
        </section>

        {/* Seções lado a lado: Altura/Peso e Supine */}
        <div style={styles.row}>
          <section style={styles.sectionHalf}>
            <h2 style={styles.sectionTitle}>2. Altura/Peso</h2>
            <div style={styles.threeColumns}>
              <Campo label="Altura 1 (cm)" name="altura1" type="number" value={formData.altura1} onChange={handleChange} disabled={!editando} />
              <Campo label="Altura 2 (cm)" name="altura2" type="number" value={formData.altura2} onChange={handleChange} disabled={!editando} />
              <Campo label="Altura 3 (cm)" name="altura3" type="number" value={formData.altura3} onChange={handleChange} disabled={!editando} />
            </div>
            <div style={styles.threeColumns}>
              <Campo label="Peso 1 (kg)" name="peso1" type="number" value={formData.peso1} onChange={handleChange} disabled={!editando} />
              <Campo label="Peso 2 (kg)" name="peso2" type="number" value={formData.peso2} onChange={handleChange} disabled={!editando} />
              <Campo label="Peso 3 (kg)" name="peso3" type="number" value={formData.peso3} onChange={handleChange} disabled={!editando} />
            </div>
            <CampoTexto label="Observação:" name="observacaoAlturaPeso" value={formData.observacaoAlturaPeso} onChange={handleChange} disabled={!editando} />
          </section>

          <section style={styles.sectionHalf}>
            <h2 style={styles.sectionTitle}>3. Supine Time UP and Go</h2>
            <div style={styles.threeColumns}>
              <Campo label="Treino (seg)" name="treinoSupine" type="number" value={formData.treinoSupine} onChange={handleChange} disabled={!editando} />
              <Campo label="Tentativa 1 (seg)" name="tentativa1Supine" type="number" value={formData.tentativa1Supine} onChange={handleChange} disabled={!editando} />
              <Campo label="Tentativa 2 (seg)" name="tentativa2Supine" type="number" value={formData.tentativa2Supine} onChange={handleChange} disabled={!editando} />
            </div>
            <CampoTexto label="Observação:" name="observacaoSupine" value={formData.observacaoSupine} onChange={handleChange} disabled={!editando} />
          </section>
        </div>

        {/* Seções lado a lado: Salto e Equilíbrio */}
        <div style={styles.row}>
          <section style={styles.sectionHalf}>
            <h2 style={styles.sectionTitle}>4. Salto horizontal</h2>
            <div style={styles.twoColumns}>
              <Campo label="Tentativa 1 (cm)" name="tentativa1Salto" type="number" value={formData.tentativa1Salto} onChange={handleChange} disabled={!editando} />
              <Campo label="Tentativa 2 (cm)" name="tentativa2Salto" type="number" value={formData.tentativa2Salto} onChange={handleChange} disabled={!editando} />
            </div>
            <CampoTexto label="Observação:" name="observacaoSalto" value={formData.observacaoSalto} onChange={handleChange} disabled={!editando} />
          </section>

          <section style={styles.sectionHalf}>
            <h2 style={styles.sectionTitle}>5. Equilíbrio em uma perna</h2>
            <div style={styles.twoColumns}>
              <Campo label="Perna Direita (30 seg)" name="pernaDireita30" type="number" value={formData.pernaDireita30} onChange={handleChange} disabled={!editando} />
              <Campo label="Perna Esquerda (30 seg)" name="pernaEsquerda30" type="number" value={formData.pernaEsquerda30} onChange={handleChange} disabled={!editando} />
            </div>
            <CampoTexto label="Observação:" name="observacaoEquilibrio" value={formData.observacaoEquilibrio} onChange={handleChange} disabled={!editando} />
          </section>
        </div>

        {/* Comentários */}
        <section style={styles.sectionFull}>
          <h2 style={styles.sectionTitle}>Comentários</h2>
          <CampoTexto label="Comentários:" name="comentarios" value={formData.comentarios} onChange={handleChange} disabled={!editando} />
        </section>
      </form>
    </div>
  );
}

// Componente auxiliar para campos de texto
const Campo = ({ label, name, value, onChange, disabled, type = 'text' }: any) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        ...styles.input,
        ...(disabled ? styles.inputDisabled : {})
      }}
    />
  </div>
);

// Componente auxiliar para textarea
const CampoTexto = ({ label, name, value, onChange, disabled }: any) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        ...styles.textarea,
        ...(disabled ? styles.inputDisabled : {})
      }}
    />
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1.5rem 1rem',
    fontFamily: "'Poppins', sans-serif"
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
  },
  voltarButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #6c757d, #495057)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  actionButtons: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  editarButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #0d6efd, #0a58ca)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  deletarButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #dc3545, #bb2d3b)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  salvarButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #198754, #146c43)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  cancelarButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #ffc107, #ffb300)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  form: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem'
  },
  sectionHalf: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
  },
  sectionFull: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    marginBottom: '1rem'
  },
  sectionTitle: {
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem',
    fontSize: '1rem',
    fontWeight: '600'
  },
  compactGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  threeColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.75rem',
    marginBottom: '0.75rem'
  },
  inlineRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem',
    marginTop: '0.75rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem'
  },
  label: {
    color: '#333',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    minHeight: '36px'
  },
  inputDisabled: {
    backgroundColor: '#f5f5f7',
    color: '#666',
    cursor: 'not-allowed'
  },
  textarea: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    fontSize: '0.875rem',
    fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    minHeight: '60px',
    resize: 'vertical'
  }
};

