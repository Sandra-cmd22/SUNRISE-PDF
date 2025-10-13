import React, { useState } from 'react';
import Header from './components/Header';
import FormularioColeta from './components/FormularioColeta';
import MonitoramentoAcelerometro from './components/MonitoramentoAcelerometro';
import QuestionarioPais from './components/QuestionarioPais';

export default function App() {
  const [currentForm, setCurrentForm] = useState('coleta');

  return (
    <div style={styles.app}>
      <Header currentForm={currentForm} onFormChange={setCurrentForm} />
      
      <main style={styles.main}>
        {currentForm === 'coleta' && <FormularioColeta />}
        {currentForm === 'monitoramento' && <MonitoramentoAcelerometro />}
        {currentForm === 'questionario' && <QuestionarioPais />}
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
