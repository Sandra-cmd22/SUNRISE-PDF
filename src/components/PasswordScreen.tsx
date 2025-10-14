import React, { useState } from 'react';
import { Lock } from '@phosphor-icons/react';
import logo from '../assets/logo.png';

interface PasswordScreenProps {
  onAuthenticated: () => void;
}

export default function PasswordScreen({ onAuthenticated }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Senha correta (usando base64 para dificultar leitura no código)
  const CORRECT_PASSWORD = 'LA35QZRA';

  const hashPassword = async (pwd: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Por favor, digite a senha');
      triggerShake();
      return;
    }

    // Comparar senha (case-insensitive)
    const inputPassword = password.toUpperCase().trim();
    
    if (inputPassword === CORRECT_PASSWORD) {
      // Senha correta - salvar hash para segurança
      const hash = await hashPassword(inputPassword);
      localStorage.setItem('sunrise_authenticated', hash);
      onAuthenticated();
    } else {
      // Senha incorreta
      setError('❌ Senha incorreta! Tente novamente.');
      setPassword('');
      triggerShake();
    }
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div style={styles.overlay}>
      <div style={{...styles.modal, ...(isShaking ? styles.shake : {})}}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <img src={logo} alt="SUNRISE Logo" style={styles.logoImage} />
          <p style={styles.brasilText}>Brasil</p>
        </div>

        {/* Texto */}
        <div style={styles.textContainer}>
          <h2 style={styles.subtitle}>
            <Lock size={28} weight="bold" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Acesso Restrito
          </h2>
          <p style={styles.description}>
            Digite a senha de acesso para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha..."
            style={styles.input}
            autoFocus
          />

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <button type="submit" style={styles.button}>
            Entrar →
          </button>
        </form>

        {/* Footer */}
        <p style={styles.footer}>
          Apenas pesquisadores autorizados
        </p>
      </div>

      {/* Animação de shake */}
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
        `}
      </style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #E54A64 0%, #FF9A51 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    fontFamily: "'Poppins', sans-serif"
  },
  modal: {
    background: '#ffffff',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '450px',
    width: '90%',
    textAlign: 'center'
  },
  shake: {
    animation: 'shake 0.5s'
  },
  logoContainer: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logoImage: {
    width: '180px',
    height: 'auto',
    marginBottom: '0.5rem'
  },
  brasilText: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#666',
    margin: 0,
    letterSpacing: '0.05em'
  },
  textContainer: {
    marginBottom: '2rem'
  },
  subtitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 0.5rem 0'
  },
  description: {
    fontSize: '0.95rem',
    color: '#666',
    margin: 0
  },
  form: {
    marginBottom: '1.5rem'
  },
  input: {
    width: '100%',
    padding: '1rem',
    fontSize: '1rem',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
    letterSpacing: '0.1em',
    marginBottom: '1rem',
    boxSizing: 'border-box'
  },
  errorBox: {
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    padding: '0.75rem',
    color: '#c00',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '1rem'
  },
  button: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    background: 'linear-gradient(135deg, #E54A64 0%, #FF9A51 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    fontFamily: "'Poppins', sans-serif"
  },
  footer: {
    fontSize: '0.85rem',
    color: '#999',
    margin: 0
  }
};

