import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import { COLORS, FONTS, CARDS } from '../styles/theme';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [citasCliente, setCitasCliente] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await api.get('/auth/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setToast({ message: '❌ Error al cargar clientes', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const verHistorial = async (clienteId) => {
    try {
      const response = await api.get(`/citas/cliente/${clienteId}`);
      setCitasCliente(response.data);
      setClienteSeleccionado(clientes.find(c => c.id === clienteId));
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setToast({ message: '❌ Error al cargar historial', type: 'error' });
    }
  };

  const cerrarHistorial = () => {
    setClienteSeleccionado(null);
    setCitasCliente([]);
  };

  const clientesFiltrados = clientes.filter(c => {
    const busquedaLower = busqueda.toLowerCase().trim();
    const nombreCompleto = `${c.nombre} ${c.apellido || ''}`.toLowerCase();
    const telefono = c.telefono || '';
    
    return nombreCompleto.includes(busquedaLower) || 
           c.email.toLowerCase().includes(busquedaLower) ||
           telefono.includes(busqueda);
  });

  const formatearFecha = (fecha) => {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
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

  return (
    <div style={styles.container}>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <h2 style={styles.title}>👥 Clientes</h2>
      <p style={styles.subtitle}>Gestiona tus clientes y su historial</p>

      <input
        type="text"
        placeholder="🔍 Buscar por nombre, email o teléfono..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.buscador}
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          <p style={styles.resultados}>Mostrando {clientesFiltrados.length} de {clientes.length} clientes</p>
          <div style={styles.grid}>
            {clientesFiltrados.map((cliente) => (
              <div key={cliente.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h4 style={styles.nombreCliente}>{cliente.nombre} {cliente.apellido || ''}</h4>
                  <span style={styles.badgeCliente}>👤 Cliente</span>
                </div>
                <p style={styles.email}>📧 {cliente.email}</p>
                {cliente.telefono && <p style={styles.telefono}>📱 {cliente.telefono}</p>}
                <p style={styles.fechaRegistro}>📅 Registrado: {formatearFecha(cliente.created_at)}</p>
                <button 
                  onClick={() => verHistorial(cliente.id)}
                  style={styles.btnHistorial}
                >
                  📋 Ver Historial
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {clienteSeleccionado && (
        <div style={styles.modalOverlay} onClick={cerrarHistorial}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>📋 Historial de {clienteSeleccionado.nombre}</h3>
              <button onClick={cerrarHistorial} style={styles.btnCerrar}>✕</button>
            </div>

            <p style={styles.modalEmail}>📧 {clienteSeleccionado.email}</p>
            {clienteSeleccionado.telefono && (
              <p style={styles.modalTelefono}>📱 {clienteSeleccionado.telefono}</p>
            )}

            {citasCliente.length === 0 ? (
              <p style={styles.sinCitas}>No tiene citas agendadas</p>
            ) : (
              <>
                <p style={styles.totalCitas}>Total de citas: {citasCliente.length}</p>
                <div style={styles.historialGrid}>
                  {citasCliente.map((cita) => (
                    <div key={cita.id} style={styles.historialCard}>
                      <div style={styles.historialHeader}>
                        <span style={styles.historialServicio}>{cita.servicio_nombre}</span>
                        <span 
                          style={{
                            ...styles.estado,
                            backgroundColor: getEstadoColor(cita.estado)
                          }}
                        >
                          {traducirEstado(cita.estado)}
                        </span>
                      </div>
                      <p>📅 {formatearFecha(cita.fecha)} - ⏰ {cita.hora}</p>
                      <p>🚗 {cita.vehiculo_tipo}</p>
                      <p style={styles.precioHistorial}>💰 ${cita.precio}</p>
                    </div>
                  ))}
                </div>
                <div style={styles.resumen}>
                  <p><strong>Total citas:</strong> {citasCliente.length}</p>
                  <p><strong>Total gastado:</strong> ${citasCliente.reduce((sum, c) => sum + parseFloat(c.precio || 0), 0)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { ...FONTS.title, marginBottom: '5px' },
  subtitle: { ...FONTS.subtitle, color: COLORS.textGray, marginBottom: '20px' },
  resultados: { marginBottom: '15px', color: COLORS.textGray, fontSize: '14px' },
  
  buscador: {
    ...CARDS.default,
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `2px solid ${COLORS.silverLight}`,
    fontSize: '16px',
    marginBottom: '20px',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    ...CARDS.default,
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  nombreCliente: {
    color: COLORS.textDark,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  badgeCliente: {
    padding: '4px 12px',
    backgroundColor: COLORS.silverLight,
    borderRadius: '20px',
    fontSize: '12px',
    color: COLORS.textDark,
  },
  email: { color: COLORS.textGray, fontSize: '14px', marginBottom: '5px' },
  telefono: { color: COLORS.textGray, fontSize: '14px', marginBottom: '5px' },
  fechaRegistro: { color: COLORS.textSilver, fontSize: '13px', marginBottom: '15px' },
  btnHistorial: {
    padding: '8px 16px',
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)',
  },
  modal: {
    ...CARDS.default,
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: COLORS.white,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  modalTitle: {
    color: COLORS.primary,
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  btnCerrar: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: COLORS.textGray,
  },
  modalEmail: { color: COLORS.textGray, marginBottom: '5px' },
  modalTelefono: { color: COLORS.textGray, marginBottom: '15px' },
  totalCitas: { fontWeight: 'bold', marginBottom: '10px', color: COLORS.primary },
  sinCitas: { textAlign: 'center', color: COLORS.textGray, padding: '20px' },
  historialGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  historialCard: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: `4px solid ${COLORS.primary}`,
  },
  historialHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  historialServicio: {
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  estado: {
    padding: '3px 10px',
    borderRadius: '15px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  precioHistorial: { 
    marginTop: '5px', 
    fontWeight: 'bold', 
    color: COLORS.success 
  },
  resumen: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-around',
    border: `1px solid ${COLORS.silverLight}`,
  },
};

export default AdminClientes;