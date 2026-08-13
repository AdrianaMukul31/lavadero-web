import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import { COLORS, FONTS, CARDS } from '../styles/theme';

const MisCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [mostrarMotivo, setMostrarMotivo] = useState(null);
  const [motivoCancelacion, setMotivoCancelacion] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await api.get('/citas/mis-citas');
      setCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setToast({ message: '❌ Error al cargar tus citas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cancelarCitaConMotivo = async (citaId) => {
    if (!motivoCancelacion.trim()) {
      setToast({ message: '⚠️ Por favor escribe un motivo', type: 'warning' });
      return;
    }

    try {
      await api.put(`/citas/${citaId}/cancelar`, { 
        motivo: motivoCancelacion 
      });
      setToast({ message: '✅ Cita cancelada correctamente', type: 'success' });
      setMostrarMotivo(null);
      setMotivoCancelacion('');
      cargarCitas();
    } catch (error) {
      console.error('Error al cancelar:', error);
      setToast({ message: '❌ Error al cancelar la cita', type: 'error' });
    }
  };

  const calificarServicio = async (citaId, calificacion) => {
    try {
      await api.put(`/citas/${citaId}/calificar`, { calificacion });
      setToast({ message: '✅ ¡Gracias por calificar el servicio!', type: 'success' });
      cargarCitas();
    } catch (error) {
      setToast({ message: '❌ Error al calificar', type: 'error' });
    }
  };

  const getEstadoReal = (cita) => {
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    const horaActual = ahora.toTimeString().slice(0, 5);
    
    if (cita.estado === 'cancelada') return 'cancelada';
    if (cita.estado === 'terminada') return 'terminada';
    
    if (cita.fecha > hoy) return 'pendiente';
    
    if (cita.fecha === hoy) {
      const [hora, minuto] = cita.hora.split(':');
      const horaFin = new Date();
      horaFin.setHours(parseInt(hora), parseInt(minuto) + cita.duracion_total_minutos);
      const horaFinStr = horaFin.toTimeString().slice(0, 5);
      
      if (horaActual >= cita.hora && horaActual < horaFinStr) {
        return 'en_proceso';
      }
      if (horaActual >= horaFinStr) {
        return 'terminada';
      }
      return 'pendiente';
    }
    
    if (cita.fecha < hoy) return 'terminada';
    return cita.estado;
  };

  const citasFiltradas = citas.filter(cita => {
    const estadoReal = getEstadoReal(cita);
    if (filtro === 'activas') {
      return estadoReal === 'pendiente' || estadoReal === 'en_proceso' || estadoReal === 'confirmada';
    }
    if (filtro === 'pasadas') {
      return estadoReal === 'terminada' || estadoReal === 'cancelada';
    }
    return true;
  });

  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#ffc107',
      confirmada: '#007bff',
      en_proceso: '#17a2b8',
      terminada: '#28a745',
      cancelada: '#dc3545'
    };
    return colores[estado] || '#6c757d';
  };

  const traducirEstado = (estado) => {
    const traducciones = {
      pendiente: '⏳ Pendiente',
      confirmada: '✅ Confirmada',
      en_proceso: '🔧 En proceso',
      terminada: '✔️ Terminada',
      cancelada: '❌ Cancelada'
    };
    return traducciones[estado] || estado;
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

      <h2 style={styles.title}>📋 Mis Citas</h2>

      <div style={styles.filtros}>
        <button 
          onClick={() => setFiltro('todas')} 
          style={{...styles.filtroBtn, ...(filtro === 'todas' ? styles.filtroActivo : {})}}
        >
          📋 Todas
        </button>
        <button 
          onClick={() => setFiltro('activas')} 
          style={{...styles.filtroBtn, ...(filtro === 'activas' ? styles.filtroActivo : {})}}
        >
          🔵 Activas
        </button>
        <button 
          onClick={() => setFiltro('pasadas')} 
          style={{...styles.filtroBtn, ...(filtro === 'pasadas' ? styles.filtroActivo : {})}}
        >
          ⚪ Historial
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : citasFiltradas.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No tienes citas {filtro === 'activas' ? 'activas' : filtro === 'pasadas' ? 'en tu historial' : ''}</p>
          {filtro === 'activas' && <p style={styles.emptySub}>Agenda una cita desde la página principal</p>}
        </div>
      ) : (
        <div style={styles.grid}>
          {citasFiltradas.map((cita) => {
            const estadoReal = getEstadoReal(cita);
            return (
              <div key={cita.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.servicioNombre}>{cita.servicio_nombre}</span>
                  <span 
                    style={{
                      ...styles.estado,
                      backgroundColor: getEstadoColor(estadoReal)
                    }}
                  >
                    {traducirEstado(estadoReal)}
                  </span>
                </div>

                <div style={styles.cardBody}>
                  <p><strong>📅 Fecha:</strong> {formatearFecha(cita.fecha)}</p>
                  <p><strong>⏰ Hora:</strong> {cita.hora}</p>
                  <p><strong>🚗 Vehículo:</strong> {cita.vehiculo_tipo}</p>
                  <p><strong>💰 Precio:</strong> ${cita.precio}</p>
                  <p><strong>⏱️ Duración:</strong> {cita.duracion_total_minutos} min</p>
                  
                  {cita.motivo_cancelacion && (
                    <p style={styles.motivoMostrado}>
                      <strong>Motivo de cancelación:</strong> {cita.motivo_cancelacion}
                    </p>
                  )}
                </div>

                <div style={styles.acciones}>
                  {estadoReal !== 'cancelada' && estadoReal !== 'terminada' && (
                    mostrarMotivo === cita.id ? (
                      <div style={styles.motivoContainer}>
                        <textarea
                          placeholder="Motivo de cancelación..."
                          value={motivoCancelacion}
                          onChange={(e) => setMotivoCancelacion(e.target.value)}
                          style={styles.motivoInput}
                          rows="2"
                        />
                        <div style={styles.motivoActions}>
                          <button 
                            onClick={() => cancelarCitaConMotivo(cita.id)}
                            style={styles.confirmarCancelarBtn}
                          >
                            ✅ Confirmar
                          </button>
                          <button 
                            onClick={() => {
                              setMostrarMotivo(null);
                              setMotivoCancelacion('');
                            }}
                            style={styles.cancelarBtn}
                          >
                            ❌ Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setMostrarMotivo(cita.id)}
                        style={styles.cancelarBtn}
                      >
                        ❌ Cancelar Cita
                      </button>
                    )
                  )}

                  {estadoReal === 'terminada' && !cita.calificacion && (
                    <div style={styles.calificacion}>
                      <p style={styles.calificacionLabel}>⭐ Califica este servicio:</p>
                      <div style={styles.estrellas}>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            onClick={() => calificarServicio(cita.id, num)}
                            style={styles.estrellaBtn}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {cita.calificacion && (
                    <p style={styles.calificacionHecha}>
                      ⭐ Calificación: {cita.calificacion}/5
                    </p>
                  )}
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
  title: { ...FONTS.title, marginBottom: '20px' },
  
  filtros: { 
    display: 'flex', 
    gap: '10px', 
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filtroBtn: {
    padding: '8px 16px',
    backgroundColor: COLORS.silverLight,
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
    color: COLORS.textDark,
  },
  filtroActivo: {
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
  },
  
  empty: {
    ...CARDS.default,
    textAlign: 'center',
    padding: '40px',
    marginTop: '50px',
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textGray,
  },
  emptySub: { 
    ...FONTS.small,
    color: COLORS.textGray, 
    marginTop: '10px' 
  },
  
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
    gap: '20px' 
  },
  card: { 
    ...CARDS.default, 
    overflow: 'hidden' 
  },
  cardHeader: { 
    padding: '15px 20px', 
    backgroundColor: '#f8f9fa', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: `1px solid ${COLORS.silverLight}`,
  },
  servicioNombre: { 
    ...FONTS.subtitle,
    fontSize: '18px',
    color: COLORS.primary,
  },
  estado: { 
    padding: '5px 12px', 
    borderRadius: '20px', 
    color: '#fff', 
    fontSize: '13px', 
    fontWeight: 'bold' 
  },
  cardBody: { 
    padding: '20px' 
  },
  motivoMostrado: { 
    marginTop: '10px', 
    padding: '10px', 
    backgroundColor: '#fff3cd', 
    borderRadius: '5px', 
    border: `1px solid ${COLORS.warning}`, 
    fontSize: '14px' 
  },
  
  acciones: { 
    padding: '15px 20px', 
    backgroundColor: '#f8f9fa', 
    borderTop: `1px solid ${COLORS.silverLight}`,
  },
  
  motivoContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '10px' 
  },
  motivoInput: { 
    padding: '10px', 
    borderRadius: '5px', 
    border: `1px solid ${COLORS.silverLight}`, 
    fontSize: '14px', 
    width: '100%', 
    boxSizing: 'border-box', 
    fontFamily: 'Arial' 
  },
  motivoActions: { 
    display: 'flex', 
    gap: '10px' 
  },
  
  cancelarBtn: { 
    padding: '10px', 
    backgroundColor: COLORS.error, 
    color: COLORS.textLight, 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: 'bold' 
  },
  confirmarCancelarBtn: { 
    padding: '10px', 
    backgroundColor: COLORS.success, 
    color: COLORS.textLight, 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: 'bold' 
  },
  
  calificacion: { 
    marginTop: '10px', 
    textAlign: 'center' 
  },
  calificacionLabel: {
    ...FONTS.body,
    color: COLORS.textGray,
  },
  estrellas: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '10px', 
    marginTop: '5px' 
  },
  estrellaBtn: { 
    fontSize: '24px', 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    transition: 'transform 0.2s' 
  },
  calificacionHecha: { 
    textAlign: 'center', 
    marginTop: '10px', 
    color: COLORS.success, 
    fontWeight: 'bold' 
  },
};

export default MisCitas;