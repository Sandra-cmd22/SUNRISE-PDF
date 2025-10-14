import React, { useState } from 'react';
import Header from './components/Header';
import FormularioColeta from './components/FormularioColeta';
import MonitoramentoAcelerometro from './components/MonitoramentoAcelerometro';
import QuestionarioPais from './components/QuestionarioPais';
import ListaColetas from './components/ListaColetas';
import DetalhesColeta from './components/DetalhesColeta';

export default function App() {
  const [currentForm, setCurrentForm] = useState('coleta');
  const [coletaSelecionadaId, setColetaSelecionadaId] = useState<string | null>(null);

  const handleColetaSelecionada = (coletaId: string) => {
    setColetaSelecionadaId(coletaId);
  };

  const handleVoltarParaLista = () => {
    setColetaSelecionadaId(null);
    setCurrentForm('listaColetas'); // Força recarregar a lista
  };

  return (
    <div style={styles.app}>
      <Header currentForm={currentForm} onFormChange={setCurrentForm} />
      
      <main style={styles.main}>
        {currentForm === 'coleta' && <FormularioColeta />}
        {currentForm === 'monitoramento' && <MonitoramentoAcelerometro />}
        {currentForm === 'questionario' && <QuestionarioPais />}
        {currentForm === 'listaColetas' && !coletaSelecionadaId && (
          <ListaColetas onColetaSelecionada={handleColetaSelecionada} />
        )}
        {currentForm === 'listaColetas' && coletaSelecionadaId && (
          <DetalhesColeta 
            coletaId={coletaSelecionadaId} 
            onVoltar={handleVoltarParaLista}
            onColetaDeletada={handleVoltarParaLista}
          />
        )}
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f7',
    fontFamily: "'Poppins', sans-serif"
  },
  main: {
    paddingTop: '1rem',
    paddingBottom: '3rem'
  },
  placeholder: {
    maxWidth: '1400px',
    margin: '2rem auto',
    padding: '3rem 1.5rem',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
  }
};
