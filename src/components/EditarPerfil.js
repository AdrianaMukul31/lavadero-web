import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Toast from './Toast';
import { COLORS, FONTS, INPUTS, BUTTONS, CARDS } from '../styles/theme';

const EditarPerfil = ({ user, onPerfilActualizado }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setToast({ message: '❌ Las contraseñas no coinciden', type: 'error' });
      setLoading(false);
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setToast({ message: '❌ La contraseña debe tener al menos 6 caracteres', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const datosActualizar = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono
      };

      if (formData.password) {
        datosActualizar.password = formData.password;
      }

      await api.put('/auth/perfil', datosActualizar);

      setToast({ message: '✅ Perfil actualizado correctamente', type: 'success' });

      if (onPerfilActualizado) {
        const response = await api.get('/auth/profile');
        onPerfilActualizado(response.data);
      }

      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Error al actualizar:', err);
      setToast({ message: '❌ Error al actualizar el perfil', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.card}
      >
        <div style={styles.topBar} />

        <div style={styles.cardContent}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 style={styles.title}>✏️ Editar Perfil</h2>
            <p style={styles.subtitle}>Actualiza tus datos personales</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nombre</label>
                <input
                  name="nombre"
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Apellido</label>
                <input
                  name="apellido"
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                style={styles.inputDisabled}
                disabled
              />
              <span style={styles.helperText}>El email no se puede modificar</span>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Teléfono</label>
              <input
                name="telefono"
                type="tel"
                placeholder="Ej: 55 1234 5678"
                value={formData.telefono}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.separator}>
              <span style={styles.separatorLine} />
              <span style={styles.separatorText}>🔒 Cambiar Contraseña (opcional)</span>
              <span style={styles.separatorLine} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Nueva contraseña</label>
              <input
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirmar contraseña</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Repite la nueva contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <motion.button
              type="submit"
              style={loading ? styles.buttonDisabled : styles.button}
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02, boxShadow: '0 12px 40px rgba(34,197,94,0.5)' }}
              whileTap={loading ? {} : { scale: 0.98 }}
            >
              {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'clamp(15px, 4vw, 40px) clamp(10px, 3vw, 20px)',
  },
  card: {
    width: '100%',
    maxWidth: '540px',
    background: 'linear-gradient(135deg, rgba(74,10,122,0.92) 0%, rgba(106,13,173,0.88) 50%, rgba(139,92,246,0.85) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    boxShadow: '0 25px 70px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
    overflow: 'hidden',
    position: 'relative',
  },
  topBar: {
    height: '6px',
    background: 'linear-gradient(90deg, #22C55E 0%, #8B5CF6 50%, #22C55E 100%)',
    width: '100%',
  },
  cardContent: {
    padding: 'clamp(25px, 5vw, 40px)',
  },
  title: {
    ...FONTS.title,
    textAlign: 'center',
    marginBottom: '5px',
    color: '#FFFFFF',
    fontSize: 'clamp(22px, 5vw, 28px)',
    fontWeight: '800',
    letterSpacing: '0.5px',
    textShadow: '0 2px 12px rgba(0,0,0,0.2)',
  },
  subtitle: {
    ...FONTS.small,
    textAlign: 'center',
    marginBottom: '30px',
    color: 'rgba(255,255,255,0.85)',
    fontSize: 'clamp(13px, 3.5vw, 15px)',
  },
  row: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  inputGroup: {
    flex: 1,
    minWidth: '140px',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#86EFAC',
    marginBottom: '6px',
    letterSpacing: '0.3px',
    textShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  input: {
    ...INPUTS.default,
    marginBottom: 0,
    background: 'rgba(255,255,255,0.95)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '15px',
    transition: 'all 0.3s ease',
    color: COLORS.textDark,
    outline: 'none',
  },
  inputDisabled: {
    ...INPUTS.default,
    marginBottom: 0,
    background: 'rgba(255,255,255,0.6)',
    border: '2px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '15px',
    color: 'rgba(31,41,55,0.6)',
    cursor: 'not-allowed',
  },
  helperText: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '4px',
    fontStyle: 'italic',
  },
  button: {
    ...BUTTONS.primary,
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    marginTop: '10px',
    borderRadius: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
    boxShadow: '0 8px 25px rgba(34,197,94,0.4)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  buttonDisabled: {
    ...BUTTONS.primary,
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    marginTop: '10px',
    borderRadius: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    background: 'rgba(255,255,255,0.3)',
    boxShadow: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'not-allowed',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0 20px 0',
    gap: '12px',
  },
  separatorLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
  },
  separatorText: {
    ...FONTS.small,
    color: '#86EFAC',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.3px',
  },
};

export default EditarPerfil;