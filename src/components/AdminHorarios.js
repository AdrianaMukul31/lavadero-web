import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';

const AdminHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [festivos, setFestivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoFestivo, setNuevoFestivo] = useState({ fecha: '', descripcion: '' });
  const [toast, setToast] = useState(null);

  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [horariosRes, festivosRes] = await Promise.all([
        api.get('/horarios'),
        api.get('/horarios/festivos')
      ]);
      setHorarios(horariosRes.data);
      setFestivos(festivosRes.data);
    } catch (error) {
      console.error('Error al cargar:', error);
      setToast({ message: '❌ Error al cargar horarios', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const actualizarHorario = async (id, campo, valor) => {
    try {
      await api.put(`/horarios/${id}`, { [campo]: valor });
      setToast({ message: '✅ Horario actualizado correctamente', type: 'success' });
      cargarDatos();
    } catch (error) {
      console.error('Error al actualizar:', error);
      const errorMsg = error.response?.data?.error || 'Error al actualizar horario';
      setToast({ message: `❌ ${errorMsg}`, type: 'error' });
    }
  };

  const agregarFestivo = async (e) => {
    e.preventDefault();
    if (!nuevoFestivo.fecha) {
      setToast({ message: '⚠️ Selecciona una fecha', type: 'warning' });
      return;
    }
    try {
      await api.post('/horarios/festivos', nuevoFestivo);
      setNuevoFestivo({ fecha: '', descripcion: '' });
      setToast({ message: '✅ Día festivo agregado', type: 'success' });
      cargarDatos();
    } catch (error) {
      setToast({ message: '❌ Error al agregar día festivo', type: 'error' });
    }
  };

  const eliminarFestivo = async (id) => {
    if (!window.confirm('¿Eliminar este día festivo?')) return;
    try {
      await api.delete(`/horarios/festivos/${id}`);
      setToast({ message: '✅ Día festivo eliminado', type: 'success' });
      cargarDatos();
    } catch (error) {
      setToast({ message: '❌ Error al eliminar día festivo', type: 'error' });
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

      <h2 style={styles.title}>🕐 Gestión de Horarios</h2>
      <p style={styles.subtitle}>
        Configura los horarios de atención. Activa/desactiva días y ajusta los horarios manualmente.
      </p>

      {loading ? (
        <p style={styles.loadingText}>Cargando...</p>
      ) : (
        <>
          <h3 style={styles.subtitle2}>📅 Horarios por Día</h3>
          <div style={styles.grid}>
            {horarios.map((horario) => {
              const isAbierto = horario.activo;

              return (
                <div
                  key={horario.id}
                  style={{
                    ...styles.card,
                    borderLeft: isAbierto ? '4px solid #28a745' : '4px solid #dc3545',
                    opacity: isAbierto ? 1 : 0.75
                  }}
                >
                  <h4 style={styles.diaNombre}>
                    <span>{diasSemana[horario.dia_semana]}</span>
                    {isAbierto ? (
                      <span style={styles.badgeAbierto}>✅ Abierto</span>
                    ) : (
                      <span style={styles.badgeCerrado}>❌ Cerrado</span>
                    )}
                  </h4>

                  {/* Activo */}
                  <div style={styles.horarioRow}>
                    <label style={styles.rowLabel}>Activo:</label>
                    <input
                      type="checkbox"
                      checked={isAbierto}
                      onChange={(e) => actualizarHorario(horario.id, 'activo', e.target.checked)}
                      style={styles.checkbox}
                    />
                  </div>

                  {/* Apertura */}
                  <div style={styles.horarioRow}>
                    <label style={styles.rowLabel}>Apertura:</label>
                    <input
                      type="time"
                      value={horario.hora_apertura}
                      onChange={(e) => actualizarHorario(horario.id, 'hora_apertura', e.target.value)}
                      disabled={!isAbierto}
                      style={styles.inputHora}
                    />
                  </div>

                  {/* Cierre */}
                  <div style={styles.horarioRow}>
                    <label style={styles.rowLabel}>Cierre:</label>
                    <input
                      type="time"
                      value={horario.hora_cierre}
                      onChange={(e) => actualizarHorario(horario.id, 'hora_cierre', e.target.value)}
                      disabled={!isAbierto}
                      style={styles.inputHora}
                    />
                  </div>

                  {/* Intervalo */}
                  <div style={styles.horarioRow}>
                    <label style={styles.rowLabel}>Intervalo:</label>
                    <input
                      type="number"
                      value={horario.intervalo_minutos}
                      onChange={(e) => actualizarHorario(horario.id, 'intervalo_minutos', parseInt(e.target.value))}
                      disabled={!isAbierto}
                      style={styles.inputIntervalo}
                      min="15"
                      step="15"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <h3 style={styles.subtitle2}>📌 Días Festivos / Cerrados</h3>
          <form onSubmit={agregarFestivo} style={styles.festivoForm}>
            <input
              type="date"
              value={nuevoFestivo.fecha}
              onChange={(e) => setNuevoFestivo({ ...nuevoFestivo, fecha: e.target.value })}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Motivo (opcional)"
              value={nuevoFestivo.descripcion}
              onChange={(e) => setNuevoFestivo({ ...nuevoFestivo, descripcion: e.target.value })}
              style={styles.input}
            />
            <button type="submit" style={styles.btnAgregar}>➕ Agregar</button>
          </form>

          <div style={styles.festivosList}>
            {festivos.length === 0 ? (
              <p style={styles.sinFestivos}>No hay días festivos registrados</p>
            ) : (
              festivos.map((festivo) => (
                <div key={festivo.id} style={styles.festivoItem}>
                  <span>📅 {new Date(festivo.fecha).toLocaleDateString('es-ES')}</span>
                  <span>{festivo.descripcion || 'Sin motivo'}</span>
                  <button onClick={() => eliminarFestivo(festivo.id)} style={styles.btnEliminar}>
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    marginBottom: '5px',
    color: '#FFFFFF',
    fontSize: 'clamp(20px, 4.5vw, 26px)',
    fontWeight: '800',
    textShadow: '0 2px 12px rgba(0,0,0,0.2)',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    marginBottom: '20px',
    fontSize: 'clamp(13px, 3vw, 15px)',
  },
  subtitle2: {
    marginTop: '30px',
    marginBottom: '15px',
    color: '#FFFFFF',
    fontSize: 'clamp(16px, 3.5vw, 20px)',
    fontWeight: '700',
    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    padding: '20px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    overflow: 'hidden',         // ✅ evita que nada se salga
    boxSizing: 'border-box',
    minWidth: 0,                // ✅ permite flex/grid shrinking
  },
  diaNombre: {
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '6px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1F2937',
  },
  badgeAbierto: {
    fontSize: '12px',
    color: '#28a745',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  badgeCerrado: {
    fontSize: '12px',
    color: '#dc3545',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },

  // ✅ Filas responsivas
  horarioRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    gap: '8px',
    minWidth: 0,                 // ✅ evita overflow
    flexWrap: 'wrap',
  },
  rowLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4B5563',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    flexShrink: 0,
  },

  // ✅ Inputs responsivos que NO se salen
  inputHora: {
    padding: '5px 6px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '13px',
    flex: 1,
    minWidth: 0,                // ✅ clave para que no se desborde
    maxWidth: '130px',          // ✅ límite superior
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputIntervalo: {
    padding: '5px 6px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '13px',
    flex: 1,
    minWidth: 0,
    maxWidth: '80px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },

  festivoForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    flex: 1,
    minWidth: '150px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  btnAgregar: {
    padding: '10px 20px',
    backgroundColor: '#22C55E',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 4px 15px rgba(34,197,94,0.35)',
    fontFamily: 'inherit',
  },
  festivosList: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  sinFestivos: {
    textAlign: 'center',
    color: '#9CA3AF',
    padding: '20px 0',
    fontSize: '14px',
  },
  festivoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
    gap: '10px',
    flexWrap: 'wrap',
    fontSize: '14px',
  },
  btnEliminar: {
    backgroundColor: '#EF4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '5px 12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'inherit',
  },
};

export default AdminHorarios;