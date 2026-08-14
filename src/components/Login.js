import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa';
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
        ease: "easeOut",
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
          whileHover={{ scale: 1.02, backgroundColor: '#6A0DAD', color: '#FFFFFF' }}
          whileTap={{ scale: 0.98 }}
        >
          ¿No tienes cuenta? Regístrate
        </motion.button>

        <motion.p 
          style={styles.demo}
          variants={itemVariants}
        >
          Admin: admin@hiperformance.com / admin123
        </motion.p>
      </motion.div>
    </div>
  );
};

// ==========================================
// ESTILOS (MEJORADOS)
// ==========================================
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #4A0A7A 0%, #6A0DAD 50%, #8B5CF6 100%)',
    padding: '20px',
    position: 'relative',
  },
  // Fondo con patrón de puntos sutiles
  containerBefore: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none',
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
    position: 'relative',
  },
  subtitleAfter: {
    content: '""',
    display: 'block',
    width: '60px',
    height: '3px',
    background: 'linear-gradient(90deg, #6A0DAD, #22C55E)',
    margin: '8px auto 0',
    borderRadius: '2px',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: '16px',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9CA3AF',
    fontSize: '18px',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 46px',
    borderRadius: '10px',
    border: '2px solid #E5E7EB',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    outline: 'none',
  },
  inputFocus: {
    borderColor: '#6A0DAD',
    boxShadow: '0 0 0 4px rgba(106, 13, 173, 0.12)',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
    transform: 'none !important',
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