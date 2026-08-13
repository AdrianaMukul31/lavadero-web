import React, { useState, useEffect } from 'react';
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

      <div style={styles.card}>
        <h2 style={styles.title}>✏️ Editar Perfil</h2>
        <p style={styles.subtitle}>Actualiza tus datos personales</p>

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
            placeholder="Email"
            value={formData.email}
            style={{...styles.input, backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
            disabled
          />

          <input
            name="telefono"
            type="tel"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.separator}>
            <hr />
            <span style={styles.separatorText}>Cambiar Contraseña (opcional)</span>
            <hr />
          </div>

          <input
            name="password"
            type="password"
            placeholder="Nueva contraseña (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Guardando...' : '💾 Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 70px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: '20px',
  },
  card: {
    ...CARDS.default,
    width: '100%',
    maxWidth: '500px',
    padding: '40px',
  },
  title: {
    ...FONTS.title,
    textAlign: 'center',
    marginBottom: '5px',
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
  },
  button: {
    ...BUTTONS.primary,
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    marginTop: '5px',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    margin: '15px 0',
    gap: '10px',
  },
  separatorText: {
    ...FONTS.small,
    color: COLORS.textGray,
    whiteSpace: 'nowrap',
  },
};

export default EditarPerfil;