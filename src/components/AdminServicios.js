import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import { COLORS, FONTS, CARDS, INPUTS } from '../styles/theme';

const AdminServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    tiempo_base_minutos: '',
    tipo_vehiculo: 'todos'
  });

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const response = await api.get('/servicios');
      setServicios(response.data);
    } catch (error) {
      setToast({ message: '❌ Error al cargar servicios', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await api.put(`/servicios/${editando}`, formData);
        setToast({ message: '✅ Servicio actualizado correctamente', type: 'success' });
      } else {
        await api.post('/servicios', formData);
        setToast({ message: '✅ Servicio creado correctamente', type: 'success' });
      }
      setMostrarForm(false);
      setEditando(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        tiempo_base_minutos: '',
        tipo_vehiculo: 'todos'
      });
      cargarServicios();
    } catch (error) {
      setToast({ message: '❌ Error al guardar servicio', type: 'error' });
    }
  };

  const eliminarServicio = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      await api.delete(`/servicios/${id}`);
      setToast({ message: '✅ Servicio eliminado correctamente', type: 'success' });
      cargarServicios();
    } catch (error) {
      setToast({ message: '❌ Error al eliminar servicio', type: 'error' });
    }
  };

  const editarServicio = (servicio) => {
    setEditando(servicio.id);
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      precio: servicio.precio,
      tiempo_base_minutos: servicio.tiempo_base_minutos,
      tipo_vehiculo: servicio.tipo_vehiculo || 'todos'
    });
    setMostrarForm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const traducirTipoVehiculo = (tipo) => {
    const tipos = {
      todos: '🚗 Todos los vehículos',
      coche: '🚗 Coche',
      camioneta: '🚙 Camioneta',
      furgoneta: '🚐 Furgoneta',
      motocicleta: '🏍️ Motocicleta'
    };
    return tipos[tipo] || tipo;
  };

  // ✅ Convierte la descripción larga en lista de items
  const parseDescripcion = (desc) => {
    if (!desc) return [];
    return desc
      .split(/\s*-\s*/)       // separa por " - " o "-"
      .map(item => item.trim())
      .filter(item => item.length > 0);
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

      <div style={styles.header}>
        <h2 style={styles.title}>⚙️ Gestión de Servicios</h2>
        <button
          onClick={() => {
            setMostrarForm(true);
            setEditando(null);
            setFormData({
              nombre: '',
              descripcion: '',
              precio: '',
              tiempo_base_minutos: '',
              tipo_vehiculo: 'todos'
            });
          }}
          style={styles.btnCrear}
        >
          + Nuevo Servicio
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={styles.formTitle}>{editando ? '✏️ Editar Servicio' : '📝 Nuevo Servicio'}</h3>

          <div style={styles.formGrid}>
            <input
              name="nombre"
              placeholder="Nombre del servicio *"
              value={formData.nombre}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="descripcion"
              placeholder="Descripción (separa con guiones: item1 - item2 - item3)"
              value={formData.descripcion}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="precio"
              placeholder="Precio *"
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="tiempo_base_minutos"
              placeholder="Duración (min) *"
              type="number"
              value={formData.tiempo_base_minutos}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <div style={styles.selectGroup}>
              <label style={styles.selectLabel}>🚗 Tipo de Vehículo:</label>
              <select
                name="tipo_vehiculo"
                value={formData.tipo_vehiculo}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="todos">🚗 Todos los vehículos</option>
                <option value="coche">🚗 Coche</option>
                <option value="camioneta">🚙 Camioneta</option>
                <option value="furgoneta">🚐 Furgoneta</option>
                <option value="motocicleta">🏍️ Motocicleta</option>
              </select>
              <p style={styles.selectHelp}>
                Selecciona el tipo de vehículo para el cual aplica este servicio.
              </p>
            </div>
          </div>

          <div style={styles.formActions}>
            <button type="submit" style={styles.btnGuardar}>
              {editando ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarForm(false);
                setEditando(null);
              }}
              style={styles.btnCancelar}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div style={styles.grid}>
          {servicios.map((item) => {
            const items = parseDescripcion(item.descripcion);
            return (
              <div key={item.id} style={styles.card}>
                <h4 style={styles.servicioNombre}>{item.nombre}</h4>

                {/* ✅ Lista con viñetas */}
                {items.length > 0 ? (
                  <ul style={styles.descList}>
                    {items.map((punto, i) => (
                      <li key={i} style={styles.descItem}>
                        <span style={styles.descBullet}>•</span>
                        <span style={styles.descText}>{punto}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={styles.sinDesc}>Sin descripción</p>
                )}

                <div style={styles.infoRow}>
                  <span style={styles.servicioPrice}>${item.precio}</span>
                  <span style={styles.servicioTime}>⏱️ {item.tiempo_base_minutos} min</span>
                </div>

                <p style={styles.servicioTipo}>
                  {traducirTipoVehiculo(item.tipo_vehiculo || 'todos')}
                </p>

                <div style={styles.cardActions}>
                  <button onClick={() => editarServicio(item)} style={styles.btnEditar}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => eliminarServicio(item.id)} style={styles.btnEliminar}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: {
    ...FONTS.title,
    marginBottom: '5px',
    color: '#FFFFFF',
    textShadow: '0 2px 12px rgba(0,0,0,0.2)',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  btnCrear: {
    padding: '10px 20px',
    backgroundColor: COLORS.secondary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(34,197,94,0.4)',
  },

  form: {
    ...CARDS.default,
    marginBottom: '20px',
  },
  formTitle: {
    ...FONTS.subtitle,
    color: COLORS.primary,
    marginBottom: '15px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
    gap: '15px',
  },
  input: {
    ...INPUTS.default,
  },
  selectGroup: {
    gridColumn: '1 / -1',
  },
  selectLabel: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  select: {
    ...INPUTS.default,
    backgroundColor: COLORS.white,
  },
  selectHelp: {
    fontSize: '12px',
    color: COLORS.textGray,
    marginTop: '5px',
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    flexWrap: 'wrap',
  },
  btnGuardar: {
    padding: '10px 20px',
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  btnCancelar: {
    padding: '10px 20px',
    backgroundColor: COLORS.silverDark,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
    gap: '20px',
  },
  card: {
    ...CARDS.default,
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  servicioNombre: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: '5px',
  },

  // ✅ LISTA CON VIÑETAS
  descList: {
    listStyle: 'none',
    padding: 0,
    margin: '4px 0 10px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  descItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '14px',
    lineHeight: 1.4,
  },
  descBullet: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '1.4',
    flexShrink: 0,
  },
  descText: {
    color: COLORS.textGray,
    fontSize: '14px',
    textTransform: 'capitalize',
    letterSpacing: '0.2px',
  },
  sinDesc: {
    color: COLORS.textGray,
    fontSize: '13px',
    fontStyle: 'italic',
    margin: '4px 0 10px 0',
  },

  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    paddingTop: '10px',
    borderTop: '1px dashed rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: '8px',
  },
  servicioPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: COLORS.success,
  },
  servicioTime: {
    color: COLORS.textGray,
    fontSize: '14px',
    fontWeight: '600',
  },
  servicioTipo: {
    color: COLORS.primaryLight,
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '4px 0',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  btnEditar: {
    flex: 1,
    padding: '10px 15px',
    backgroundColor: COLORS.warning,
    color: COLORS.textDark,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  btnEliminar: {
    flex: 1,
    padding: '10px 15px',
    backgroundColor: COLORS.error,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
};

export default AdminServicios;