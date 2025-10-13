import React from 'react';
import logo from 'figma:asset/40d5745e5b8d14c1303981ecc3aea3c79fa40432.png';

interface HeaderProps {
  currentForm: string;
  onFormChange: (form: string) => void;
}

export default function Header({ currentForm, onFormChange }: HeaderProps) {
  const forms = [
    { id: 'coleta', label: 'Formulário de Coleta' },
    { id: 'monitoramento', label: 'Monitoramento de Acelerômetro' },
    { id: 'questionario', label: 'Questionário Pais/Responsável' }
  ];

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <img src={logo} alt="Sunrise Logo" style={styles.logo} />
        <nav style={styles.nav}>
          {forms.map(form => (
            <button
              key={form.id}
              onClick={() => onFormChange(form.id)}
              style={{
                ...styles.navButton,
                ...(currentForm === form.id ? styles.navButtonActive : {})
              }}
            >
              {form.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    padding: '1rem 0',
    position: 'sticky' as 'sticky',
    top: 0,
    zIndex: 1000
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  logo: {
    height: '50px',
    width: 'auto'
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  },
  navButton: {
    padding: '0.75rem 1.25rem',
    background: 'transparent',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.9rem',
    color: '#333'
  },
  navButtonActive: {
    background: 'linear-gradient(135deg, #613789, #FD9630)',
    color: '#ffffff',
    borderColor: 'transparent'
  }
};
