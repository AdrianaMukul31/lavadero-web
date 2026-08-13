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
        <p>Cargando...</p>
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
                    opacity: isAbierto ? 1 : 0.7
                  }}
                >
                  <h4 style={styles.diaNombre}>
                    {diasSemana[horario.dia_semana]}
                    {isAbierto ? (
                      <span style={styles.badgeAbierto}> ✅ Abierto</span>
                    ) : (
                      <span style={styles.badgeCerrado}> ❌ Cerrado</span>
                    )}
                  </h4>

                  <div style={styles.horarioRow}>
                    <label>Activo:</label>
                    <input
                      type="checkbox"
                      checked={isAbierto}
                      onChange={(e) => actualizarHorario(horario.id, 'activo', e.target.checked)}
                    />
                  </div>

                  <div style={styles.horarioRow}>
                    <label>Apertura:</label>
                    <input
                      type="time"
                      value={horario.hora_apertura}
                      onChange={(e) => actualizarHorario(horario.id, 'hora_apertura', e.target.value)}
                      disabled={!isAbierto}
                      style={styles.inputHora}
                    />
                  </div>

                  <div style={styles.horarioRow}>
                    <label>Cierre:</label>
                    <input
                      type="time"
                      value={horario.hora_cierre}
                      onChange={(e) => actualizarHorario(horario.id, 'hora_cierre', e.target.value)}
                      disabled={!isAbierto}
                      style={styles.inputHora}
                    />
                  </div>

                  <div style={styles.horarioRow}>
                    <label>Intervalo (min):</label>
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
              <p>No hay días festivos registrados</p>
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
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { marginBottom: '5px', color: '#333' },
  subtitle: { color: '#666', marginBottom: '20px' },
  subtitle2: { marginTop: '30px', marginBottom: '15px', color: '#333' },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  diaNombre: {
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeAbierto: { fontSize: '14px', color: '#28a745', fontWeight: 'bold' },
  badgeCerrado: { fontSize: '14px', color: '#dc3545', fontWeight: 'bold' },
  horarioRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  inputHora: { padding: '5px', borderRadius: '5px', border: '1px solid #ddd', width: '100px' },
  inputIntervalo: { padding: '5px', borderRadius: '5px', border: '1px solid #ddd', width: '60px' },
  
  festivoForm: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
    flex: 1,
    minWidth: '150px',
  },
  btnAgregar: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  festivosList: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  festivoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
  },
  btnEliminar: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default AdminHorarios;