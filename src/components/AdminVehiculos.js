import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import ConfirmModal from './ConfirmModal';
import { COLORS, FONTS, CARDS } from '../styles/theme';

const AdminVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [toast, setToast] = useState(null);

  // ✅ Estado para el modal de confirmación
  const [confirmData, setConfirmData] = useState({ open: false, id: null });

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const response = await api.get('/vehiculos/all');
      setVehiculos(response.data);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
      setToast({ message: '❌ Error al cargar vehículos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ahora solo abre el modal
  const eliminarVehiculo = (id) => {
    setConfirmData({ open: true, id });
  };

  // ✅ Función que sí elimina al confirmar
  const confirmarEliminar = async () => {
    try {
      await api.delete(`/vehiculos/${confirmData.id}`);
      setToast({ message: '✅ Vehículo eliminado correctamente', type: 'success' });
      cargarVehiculos();
    } catch (error) {
      setToast({ message: '❌ Error al eliminar vehículo', type: 'error' });
    } finally {
      setConfirmData({ open: false, id: null });
    }
  };

  const traducirTipo = (tipo) => {
    const tipos = {
      coche: '🚗 Coche',
      camioneta: '🚙 Camioneta',
      furgoneta: '🚐 Furgoneta',
      motocicleta: '🏍️ Motocicleta'
    };
    return tipos[tipo?.toLowerCase()] || tipo || '❓ Desconocido';
  };

  const vehiculosFiltrados = vehiculos.filter(v => {
    const busquedaLower = busqueda.toLowerCase();
    const nombreCompleto = `${v.nombre || ''} ${v.apellido || ''}`.toLowerCase();
    return nombreCompleto.includes(busquedaLower) || 
           v.tipo?.toLowerCase().includes(busquedaLower) ||
           (v.email && v.email.toLowerCase().includes(busquedaLower));
  });

  return (
    <div style={styles.container}>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* ✅ Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmData.open}
        title="¿Eliminar vehículo?"
        message="Esta acción eliminará el vehículo del registro. ¿Estás seguro de que quieres continuar?"
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        tipo="danger"
        onConfirm={confirmarEliminar}
        onCancel={() => setConfirmData({ open: false, id: null })}
      />

      <h2 style={styles.title}>🚗 Gestión de Vehículos</h2>
      <p style={styles.subtitle}>Vehículos registrados por los clientes</p>

      <input
        type="text"
        placeholder="🔍 Buscar por cliente o tipo de vehículo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={styles.buscador}
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          <p style={styles.resultados}>Mostrando {vehiculosFiltrados.length} de {vehiculos.length} vehículos</p>
          <div style={styles.grid}>
            {vehiculosFiltrados.map((vehiculo) => (
              <div key={vehiculo.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h4 style={styles.tipoVehiculo}>{traducirTipo(vehiculo.tipo)}</h4>
                  <button 
                    onClick={() => eliminarVehiculo(vehiculo.id)}
                    style={styles.btnEliminar}
                  >
                    🗑️
                  </button>
                </div>
                <p style={styles.clienteInfo}>
                  <strong>Cliente:</strong> {vehiculo.nombre} {vehiculo.apellido || ''}
                </p>
                <p style={styles.clienteInfo}>
                  <strong>Email:</strong> {vehiculo.email}
                </p>
                <p style={styles.fechaRegistro}>
                  📅 Registrado: {new Date(vehiculo.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            ))}
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
  tipoVehiculo: {
    color: COLORS.primary,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  clienteInfo: {
    color: COLORS.textDark,
    fontSize: '14px',
    marginBottom: '5px',
  },
  fechaRegistro: {
    color: COLORS.textSilver,
    fontSize: '13px',
    marginTop: '10px',
  },
  btnEliminar: {
    backgroundColor: COLORS.error,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
};

export default AdminVehiculos;