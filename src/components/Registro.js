import React, { useState } from 'react';
import api from '../services/api';
import { COLORS, FONTS, INPUTS, BUTTONS, CARDS } from '../styles/theme';

const Registro = ({ onRegistro, onVolver }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validarEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validarTelefono = (telefono) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(telefono);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.nombre || !formData.apellido || !formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    if (!validarEmail(formData.email)) {
      setError('Ingresa un correo electrónico válido (ejemplo@dominio.com)');
      setLoading(false);
      return;
    }

    if (formData.telefono && !validarTelefono(formData.telefono)) {
      setError('El teléfono debe tener exactamente 10 dígitos (solo números)');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', {
        ...formData,
        rol: 'cliente'
      });
      
      alert('✅ ¡Registro exitoso! Ahora inicia sesión.');
      onVolver();
    } catch (err) {
      console.error('Error en registro:', err);
      setError(err.response?.data?.error || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Registro de Cliente</h2>
        <p style={styles.subtitle}>Crea tu cuenta para agendar citas</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.row}>
            <input
              name="nombre"
              placeholder="Nombre *"
              value={formData.nombre}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <input
              name="apellido"
              placeholder="Apellido *"
              value={formData.apellido}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email * (ejemplo@correo.com)"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña * (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono (10 dígitos, solo números)"
            value={formData.telefono}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setFormData({ ...formData, telefono: value });
            }}
            style={styles.input}
            maxLength="10"
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p style={styles.link} onClick={onVolver}>
          ¿Ya tienes cuenta? Inicia sesión
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
    ...CARDS.default,
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(106, 13, 173, 0.35)',
    border: `2px solid ${COLORS.silver}`,
  },
  title: {
    ...FONTS.title,
    textAlign: 'center',
    marginBottom: '5px',
    fontSize: '1.8rem',
  },
  subtitle: {
    ...FONTS.small,
    textAlign: 'center',
    marginBottom: '25px',
    color: COLORS.textGray,
  },
  row: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    ...INPUTS.default,
    marginBottom: '15px',
    backgroundColor: COLORS.white,
  },
  button: {
    ...BUTTONS.primary,
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    marginTop: '5px',
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: '15px',
    padding: '12px',
    backgroundColor: '#FEE2E2',
    borderRadius: '10px',
    borderLeft: `4px solid ${COLORS.error}`,
    fontSize: '14px',
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    color: COLORS.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
    ...FONTS.small,
    transition: 'all 0.3s ease',
  },
};

export default Registro;