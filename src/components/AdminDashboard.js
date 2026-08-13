import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { COLORS, FONTS, CARDS, BUTTONS } from '../styles/theme';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    en_proceso: 0,
    terminadas: 0,
    canceladas: 0,
    citas_hoy: 0,
    ingresos: 0
  });
  const [citasHoy, setCitasHoy] = useState([]);

  const cargarDatos = useCallback(async () => {
    try {
      const response = await api.get('/citas/all');
      const data = response.data;
      calcularEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const calcularEstadisticas = (data) => {
    const hoy = new Date().toISOString().split('T')[0];
    const citasHoy = data.filter(c => c.fecha === hoy);
    
    const ingresos = data
      .filter(c => c.estado === 'terminada')
      .reduce((sum, c) => sum + parseFloat(c.precio || 0), 0);

    setStats({
      total: data.length,
      pendientes: data.filter(c => c.estado === 'pendiente').length,
      en_proceso: data.filter(c => c.estado === 'en_proceso').length,
      terminadas: data.filter(c => c.estado === 'terminada').length,
      canceladas: data.filter(c => c.estado === 'cancelada').length,
      citas_hoy: citasHoy.length,
      ingresos: ingresos
    });

    setCitasHoy(citasHoy);
  };

  // ✅ COMPONENTE DE CITAS DEL DÍA
  const renderCitasDelDia = () => {
    if (citasHoy.length === 0) {
      return <p style={styles.sinCitas}>📭 No hay citas agendadas para hoy</p>;
    }

    return (
      <div style={styles.citasDiaContainer}>
        <h3 style={styles.citasDiaTitle}>📋 Citas de Hoy ({citasHoy.length})</h3>
        <div style={styles.citasDiaList}>
          {citasHoy.map((cita) => (
            <div key={cita.id} style={styles.citaDiaItem}>
              <span style={styles.citaHora}>⏰ {cita.hora}</span>
              <span style={styles.citaCliente}><strong>{cita.cliente_nombre}</strong></span>
              <span style={styles.citaServicio}>🚗 {cita.servicio_nombre}</span>
              <span style={{
                ...styles.estadoBadge,
                backgroundColor: cita.estado === 'pendiente' ? '#ffc107' : 
                                 cita.estado === 'en_proceso' ? '#17a2b8' : 
                                 cita.estado === 'terminada' ? '#28a745' : '#dc3545'
              }}>
                {cita.estado === 'pendiente' ? '⏳ Pendiente' :
                 cita.estado === 'en_proceso' ? '🔧 Proceso' :
                 cita.estado === 'terminada' ? '✔️ Terminada' : '❌ Cancelada'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Dashboard</h2>
      <p style={styles.subtitle}>Resumen general del negocio</p>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          <div style={styles.gridStats}>
            <div style={{...styles.statCard, borderLeft: `4px solid ${COLORS.primary}`}}>
              <h3 style={styles.statLabel}>📋 Total Citas</h3>
              <p style={styles.statNumber}>{stats.total}</p>
            </div>
            <div style={{...styles.statCard, borderLeft: `4px solid ${COLORS.secondary}`}}>
              <h3 style={styles.statLabel}>⏳ Pendientes</h3>
              <p style={styles.statNumber}>{stats.pendientes}</p>
            </div>
            <div style={{...styles.statCard, borderLeft: `4px solid ${COLORS.primaryLight}`}}>
              <h3 style={styles.statLabel}>💰 Ingresos</h3>
              <p style={styles.statNumber}>${stats.ingresos}</p>
            </div>
            <div style={{...styles.statCard, borderLeft: `4px solid ${COLORS.silver}`}}>
              <h3 style={styles.statLabel}>📅 Citas Hoy</h3>
              <p style={styles.statNumber}>{stats.citas_hoy}</p>
            </div>
          </div>

          <div style={styles.gridStats2}>
            <div style={{...styles.statCardSmall, borderTop: `4px solid ${COLORS.success}`}}>
              <span style={styles.badgeGreen}>✔️ {stats.terminadas}</span>
              <span style={styles.statSmallLabel}>Terminadas</span>
            </div>
            <div style={{...styles.statCardSmall, borderTop: `4px solid ${COLORS.info}`}}>
              <span style={styles.badgeBlue}>🔧 {stats.en_proceso}</span>
              <span style={styles.statSmallLabel}>En proceso</span>
            </div>
            <div style={{...styles.statCardSmall, borderTop: `4px solid ${COLORS.error}`}}>
              <span style={styles.badgeRed}>❌ {stats.canceladas}</span>
              <span style={styles.statSmallLabel}>Canceladas</span>
            </div>
          </div>

          {renderCitasDelDia()}
        </>
      )}
    </div>
  );
};

const styles = {
  container: { 
    padding: '20px', 
    maxWidth: '1200px', 
    margin: '0 auto' 
  },
  title: { 
    ...FONTS.title,
    marginBottom: '5px',
  },
  subtitle: { 
    ...FONTS.subtitle,
    color: COLORS.textGray,
    marginBottom: '20px',
  },
  
  gridStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  statCard: {
    ...CARDS.default,
    padding: '20px',
    borderLeft: `4px solid ${COLORS.primary}`,
  },
  statLabel: {
    fontSize: '14px',
    color: COLORS.textGray,
    marginBottom: '5px',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: COLORS.textDark,
    margin: '5px 0',
  },
  
  gridStats2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  },
  statCardSmall: {
    ...CARDS.default,
    padding: '15px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    borderTop: `4px solid ${COLORS.primary}`,
  },
  statSmallLabel: {
    fontSize: '13px',
    color: COLORS.textGray,
  },
  badgeGreen: { 
    color: COLORS.success, 
    fontWeight: 'bold', 
    fontSize: '1.2rem' 
  },
  badgeBlue: { 
    color: COLORS.info, 
    fontWeight: 'bold', 
    fontSize: '1.2rem' 
  },
  badgeRed: { 
    color: COLORS.error, 
    fontWeight: 'bold', 
    fontSize: '1.2rem' 
  },

  citasDiaContainer: {
    ...CARDS.default,
    marginTop: '20px',
  },
  citasDiaTitle: {
    ...FONTS.subtitle,
    marginBottom: '15px',
  },
  citasDiaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  citaDiaItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    borderLeft: `4px solid ${COLORS.primary}`,
    flexWrap: 'wrap',
    gap: '5px',
  },
  citaHora: { 
    fontWeight: 'bold', 
    color: COLORS.textDark, 
    minWidth: '80px' 
  },
  citaCliente: { 
    flex: 1, 
    minWidth: '100px' 
  },
  citaServicio: { 
    color: COLORS.textGray, 
    minWidth: '100px' 
  },
  estadoBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  sinCitas: {
    textAlign: 'center',
    padding: '30px',
    color: COLORS.textGray,
    ...CARDS.default,
    marginTop: '20px',
  },
};

export default AdminDashboard;