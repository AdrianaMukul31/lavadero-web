import React, { useState } from 'react';
import api from '../services/api';
import Logo from './Logo';

const Login = ({ onLogin, onRegistro }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      onLogin(response.data.user);
    } catch (err) {
      console.error('Error de login:', err.response?.data || err.message);
      localStorage.removeItem('token');
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <Logo size="xlarge" showText={true} />
        </div>
        
        <h2 style={styles.subtitle}>Iniciar Sesión</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button 
            type="submit" 
            style={styles.button} 
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <button onClick={onRegistro} style={styles.registroBtn}>
          ¿No tienes cuenta? Regístrate
        </button>

        <p style={styles.demo}>
          Admin: fijo@correo.com / 123456
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #4A0A7A 0%, #6A0DAD 50%, #8B5CF6 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    padding: '45px 40px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(106, 13, 173, 0.35)',
    width: '100%',
    maxWidth: '460px',
    border: '2px solid #C0C0C0',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 1,
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px',
  },
  subtitle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '28px',
    color: '#6A0DAD',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    marginBottom: '16px',
    borderRadius: '10px',
    border: '2px solid #E5E7EB',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6A0DAD 0%, #4A0A7A 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    letterSpacing: '0.5px',
  },
  registroBtn: {
    width: '100%',
    padding: '13px',
    marginTop: '12px',
    background: 'transparent',
    color: '#6A0DAD',
    border: '2px solid #6A0DAD',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#FEE2E2',
    borderRadius: '10px',
    borderLeft: '4px solid #EF4444',
    fontSize: '14px',
  },
  demo: {
    textAlign: 'center',
    marginTop: '22px',
    fontSize: '13px',
    color: '#9CA3AF',
    borderTop: '1px solid #E5E7EB',
    paddingTop: '18px',
  },
};

export default Login;