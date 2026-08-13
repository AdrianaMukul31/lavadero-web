import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import { COLORS, FONTS, CARDS, INPUTS } from '../styles/theme';

const AdminCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await api.get('/citas/all');
      setCitas(response.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setToast({ message: '❌ Error al cargar citas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (citaId, nuevoEstado) => {
    try {
      await api.put(`/citas/${citaId}/estado`, { estado: nuevoEstado });
      setToast({ message: `✅ Cita actualizada a: ${nuevoEstado}`, type: 'success' });
      cargarCitas();
    } catch (error) {
      console.error('Error al actualizar:', error);
      setToast({ message: '❌ Error al actualizar la cita', type: 'error' });
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
    if (filtroFecha && cita.fecha !== filtroFecha) return false;
    if (filtroCliente) {
      const busqueda = filtroCliente.toLowerCase();
      const nombreCompleto = `${cita.cliente_nombre} ${cita.cliente_apellido || ''}`.toLowerCase();
      if (!nombreCompleto.includes(busqueda) && !cita.email?.toLowerCase().includes(busqueda)) {
        return false;
      }
    }
    if (filtroEstado && estadoReal !== filtroEstado) return false;
    return true;
  });

  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: '#ffc107',
      en_proceso: '#17a2b8',
      terminada: '#28a745',
      cancelada: '#dc3545'
    };
    return colores[estado] || '#6c757d';
  };

  const traducirEstado = (estado) => {
    const traducciones = {
      pendiente: '⏳ Pendiente',
      en_proceso: '🔧 En proceso',
      terminada: '✔️ Terminada',
      cancelada: '❌ Cancelada'
    };
    return traducciones[estado] || estado;
  };

  const traducirTipoVehiculo = (tipo) => {
    const tipos = {
      coche: '🚗 Coche',
      camioneta: '🚙 Camioneta',
      furgoneta: '🚐 Furgoneta',
      motocicleta: '🏍️ Motocicleta'
    };
    return tipos[tipo?.toLowerCase()] || tipo || '❓ Desconocido';
  };

  const estadosPosibles = [
    { valor: 'pendiente', label: '⏳ Pendiente' },
    { valor: 'en_proceso', label: '🔧 En proceso' },
    { valor: 'terminada', label: '✔️ Terminada' }
  ];

  return (
    <div style={styles.container}>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <h2 style={styles.title}>📋 Todas las Citas</h2>
      <p style={styles.subtitle}>Gestiona las citas de todos los clientes</p>

      <div style={styles.filtros}>
        <div style={styles.filtroGroup}>
          <label style={styles.filtroLabel}>📅 Fecha:</label>
          <div style={styles.filtroInputWrapper}>
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={styles.filtroInput}
            />
            {filtroFecha && (
              <button onClick={() => setFiltroFecha('')} style={styles.btnLimpiar}>✕</button>
            )}
          </div>
        </div>

        <div style={styles.filtroGroup}>
          <label style={styles.filtroLabel}>🔍 Buscar cliente:</label>
          <input
            type="text"
            placeholder="Nombre o email..."
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            style={styles.filtroInput}
          />
        </div>

        <div style={styles.filtroGroup}>
          <label style={styles.filtroLabel}>📊 Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={styles.filtroSelect}
          >
            <option value="">Todos</option>
            {estadosPosibles.map((est) => (
              <option key={est.valor} value={est.valor}>{est.label}</option>
            ))}
          </select>
        </div>

        <button onClick={cargarCitas} style={styles.btnRecargar}>🔄 Recargar</button>
      </div>

      {loading ? (
        <Loader />
      ) : citasFiltradas.length === 0 ? (
        <p style={styles.sinResultados}>No hay citas que coincidan con los filtros</p>
      ) : (
        <>
          <p style={styles.resultados}>Mostrando {citasFiltradas.length} de {citas.length} citas</p>
          <div style={styles.grid}>
            {citasFiltradas.map((cita) => {
              const estadoReal = getEstadoReal(cita);
              return (
                <div key={cita.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span style={styles.clienteNombre}>
                      {cita.cliente_nombre} {cita.cliente_apellido || ''}
                    </span>
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
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>📧 Email:</span>
                      <span style={styles.infoValue}>{cita.email}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>📱 Teléfono:</span>
                      <span style={styles.infoValue}>{cita.cliente_telefono || 'No registrado'}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>🚗 Servicio:</span>
                      <span style={styles.infoValue}>{cita.servicio_nombre}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>📅 Fecha:</span>
                      <span style={styles.infoValue}>{formatearFecha(cita.fecha)}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>⏰ Hora:</span>
                      <span style={styles.infoValue}>{cita.hora}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>🚙 Vehículo:</span>
                      <span style={styles.infoValue}>{traducirTipoVehiculo(cita.vehiculo_tipo)}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>💰 Precio:</span>
                      <span style={styles.infoValue}>${cita.precio}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>⏱️ Duración:</span>
                      <span style={styles.infoValue}>{cita.duracion_total_minutos} min</span>
                    </div>
                    
                    {cita.calificacion && (
                      <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>⭐ Calificación:</span>
                        <span style={styles.infoValue}>{cita.calificacion}/5</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.acciones}>
                    <p style={styles.accionesLabel}>Cambiar estado:</p>
                    <div style={styles.estadosButtons}>
                      {estadosPosibles.map((est) => (
                        <button
                          key={est.valor}
                          onClick={() => cambiarEstado(cita.id, est.valor)}
                          style={{
                            ...styles.estadoBtn,
                            backgroundColor: getEstadoColor(est.valor),
                            opacity: estadoReal === est.valor ? 1 : 0.5
                          }}
                        >
                          {est.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { ...FONTS.title, marginBottom: '5px' },
  subtitle: { ...FONTS.subtitle, color: COLORS.textGray, marginBottom: '20px' },
  resultados: { marginBottom: '15px', color: COLORS.textGray, fontSize: '14px' },
  sinResultados: { textAlign: 'center', padding: '40px', color: COLORS.textGray },
  
  filtros: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: COLORS.white,
    borderRadius: '12px',
    boxShadow: COLORS.shadow,
    alignItems: 'flex-end',
    border: `1px solid ${COLORS.silverLight}`,
  },
  filtroGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: '1',
    minWidth: '160px',
  },
  filtroLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.textDark,
  },
  filtroInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  },
  filtroInput: {
    ...INPUTS.default,
    flex: 1,
  },
  filtroSelect: {
    ...INPUTS.default,
  },
  btnLimpiar: { 
    padding: '6px 12px', 
    backgroundColor: COLORS.error, 
    color: COLORS.textLight, 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    fontSize: '12px', 
    whiteSpace: 'nowrap',
  },
  btnRecargar: { 
    padding: '10px 24px', 
    backgroundColor: COLORS.primary, 
    color: COLORS.textLight, 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '14px', 
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    transition: 'all 0.3s ease',
  },
  
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
    gap: '20px',
    justifyContent: 'center',
    justifyItems: 'center',
  },
  
  card: {
    ...CARDS.default,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '500px',
  },
  
  cardHeader: { 
    padding: '15px 20px', 
    backgroundColor: '#f8f9fa', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: `1px solid ${COLORS.silverLight}`,
  },
  clienteNombre: { 
    fontSize: '18px', 
    fontWeight: 'bold', 
    color: COLORS.textDark 
  },
  estado: { 
    padding: '5px 14px', 
    borderRadius: '20px', 
    color: '#fff', 
    fontSize: '13px', 
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  
  cardBody: { 
    padding: '16px 20px',
    flex: 1,
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: `1px solid ${COLORS.silverLight}`,
    gap: '10px',
  },
  infoLabel: {
    fontWeight: '600',
    color: COLORS.textGray,
    fontSize: '14px',
    minWidth: '100px',
    flexShrink: 0,
  },
  infoValue: {
    color: COLORS.textDark,
    fontSize: '14px',
    textAlign: 'left',
    wordBreak: 'break-word',
    flex: 1,
  },
  
  acciones: { 
    padding: '15px 20px', 
    backgroundColor: '#f8f9fa', 
    borderTop: `1px solid ${COLORS.silverLight}`,
    marginTop: 'auto',
    textAlign: 'center',
  },
  accionesLabel: { 
    marginBottom: '10px', 
    fontSize: '14px', 
    fontWeight: 'bold', 
    color: COLORS.textDark,
    textAlign: 'center',
  },
  estadosButtons: { 
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '8px',
    justifyContent: 'center',
  },
  estadoBtn: { 
    padding: '6px 14px', 
    border: 'none', 
    borderRadius: '5px', 
    color: '#fff', 
    fontSize: '13px', 
    fontWeight: 'bold', 
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: '1',
    minWidth: '80px',
    maxWidth: '140px',
    textAlign: 'center',
  },
};

export default AdminCitas;