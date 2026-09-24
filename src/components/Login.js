import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import Logo from './Logo';
import { COLORS } from '../styles/theme';

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

  // ==========================================
  // ANIMACIONES
  // ==========================================
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <motion.div
          style={styles.logoWrapper}
          variants={itemVariants}
        >
          <Logo size="xlarge" showText={true} />
        </motion.div>

        <motion.h2
          style={styles.subtitle}
          variants={itemVariants}
        >
          Iniciar Sesión
        </motion.h2>

        {error && (
          <motion.p
            style={styles.error}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            style={styles.inputWrapper}
            variants={itemVariants}
          >
            <FaEnvelope style={styles.inputIcon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </motion.div>

          <motion.div
            style={styles.inputWrapper}
            variants={itemVariants}
          >
            <FaLock style={styles.inputIcon} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            style={styles.button}
            disabled={loading}
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(106, 13, 173, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
            {!loading && <FaArrowRight style={{ marginLeft: '10px' }} />}
          </motion.button>
        </form>

        <motion.button
          onClick={onRegistro}
          style={styles.registroBtn}
          variants={itemVariants}
          whileHover={{ scale: 1.02, backgroundColor: COLORS.primary, color: '#fff' }}
          whileTap={{ scale: 0.98 }}
        >
          ¿No tienes cuenta? Regístrate
        </motion.button>

        {/* ❌ Credenciales de demo ELIMINADAS */}
      </motion.div>
    </div>
  );
};

// ==========================================
// ESTILOS MODERNOS (GLASSMORPHISM)
// ==========================================
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative',
    background: 'transparent',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '45px 40px',
    borderRadius: '32px',
    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '460px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    position: 'relative',
    zIndex: 1,
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  subtitle: {
    fontSize: '1.6rem',
    textAlign: 'center',
    marginBottom: '28px',
    color: COLORS.primary,
    fontWeight: '700',
    letterSpacing: '0.5px',
    position: 'relative',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: '16px',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: COLORS.silverDark,
    fontSize: '18px',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    borderRadius: '14px',
    border: '2px solid rgba(229, 231, 235, 0.6)',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(4px)',
    color: COLORS.textDark,
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #6A0DAD 0%, #8B5CF6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '14px',
    fontSize: '17px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 20px rgba(106, 13, 173, 0.3)',
  },
  registroBtn: {
    width: '100%',
    padding: '14px',
    marginTop: '14px',
    background: 'transparent',
    color: COLORS.primary,
    border: '2px solid rgba(106, 13, 173, 0.4)',
    borderRadius: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: '12px',
    borderLeft: '4px solid #EF4444',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Login;