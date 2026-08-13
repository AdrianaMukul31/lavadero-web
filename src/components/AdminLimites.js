import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import { COLORS, FONTS, CARDS, INPUTS } from '../styles/theme';

const AdminLimites = () => {
  const [limites, setLimites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [nuevoValor, setNuevoValor] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargarLimites();
  }, []);

  const cargarLimites = async () => {
    try {
      const response = await api.get('/limites');
      setLimites(response.data);
    } catch (error) {
      console.error('Error al cargar límites:', error);
      setToast({ message: '❌ Error al cargar límites', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const actualizarLimite = async (id, valor) => {
    if (valor < 1) {
      setToast({ message: '⚠️ El límite debe ser mayor a 0', type: 'warning' });
      return;
    }

    try {
      await api.put(`/limites/${id}`, { limite_diario: parseInt(valor) });
      setToast({ message: '✅ Límite actualizado correctamente', type: 'success' });
      cargarLimites();
      setEditando(null);
      setNuevoValor('');
    } catch (error) {
      console.error('Error al actualizar:', error);
      setToast({ message: '❌ Error al actualizar el límite', type: 'error' });
    }
  };

  const traducirTipo = (tipo) => {
    const tipos = {
      coche: '🚗 Coche',
      camioneta: '🚙 Camioneta',
      furgoneta: '🚐 Furgoneta',
      motocicleta: '🏍️ Motocicleta'
    };
    return tipos[tipo] || tipo;
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

      <h2 style={styles.title}>📊 Límites Diarios</h2>
      <p style={styles.subtitle}>
        Define cuántos vehículos de cada tipo puedes lavar por día
      </p>

      {loading ? (
        <Loader />
      ) : (
        <div style={styles.grid}>
          {limites.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3 style={styles.tipoTitulo}>{traducirTipo(item.tipo_vehiculo)}</h3>
              
              {editando === item.id ? (
                <div style={styles.editContainer}>
                  <input
                    type="number"
                    min="1"
                    value={nuevoValor}
                    onChange={(e) => setNuevoValor(e.target.value)}
                    style={styles.input}
                  />
                  <div style={styles.editActions}>
                    <button 
                      onClick={() => actualizarLimite(item.id, nuevoValor)}
                      style={styles.btnGuardar}
                    >
                      ✅ Guardar
                    </button>
                    <button 
                      onClick={() => {
                        setEditando(null);
                        setNuevoValor('');
                      }}
                      style={styles.btnCancelar}
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={styles.infoContainer}>
                  <p style={styles.limiteActual}>
                    <strong>Límite diario:</strong> {item.limite_diario} vehículos
                  </p>
                  <button 
                    onClick={() => {
                      setEditando(item.id);
                      setNuevoValor(item.limite_diario.toString());
                    }}
                    style={styles.btnEditar}
                  >
                    ✏️ Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={styles.infoBox}>
        <p>💡 <strong>Nota:</strong> Estos límites aplican por día. Si se alcanza el límite, el cliente no podrá agendar más citas para ese tipo de vehículo en esa fecha.</p>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  title: { ...FONTS.title, marginBottom: '5px' },
  subtitle: { ...FONTS.subtitle, color: COLORS.textGray, marginBottom: '20px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    ...CARDS.default,
    padding: '20px',
  },
  tipoTitulo: {
    ...FONTS.subtitle,
    color: COLORS.primary,
    marginBottom: '15px',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  limiteActual: {
    fontSize: '16px',
    color: COLORS.textDark,
    marginBottom: '5px',
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    ...INPUTS.default,
  },
  editActions: {
    display: 'flex',
    gap: '10px',
  },
  btnGuardar: {
    padding: '8px 16px',
    backgroundColor: COLORS.success,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  btnCancelar: {
    padding: '8px 16px',
    backgroundColor: COLORS.error,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1,
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  btnEditar: {
    padding: '8px 16px',
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  infoBox: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#fff3cd',
    borderRadius: '10px',
    border: `1px solid ${COLORS.warning}`,
    color: COLORS.textDark,
  },
};

export default AdminLimites;