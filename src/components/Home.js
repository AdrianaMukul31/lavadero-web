import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import { COLORS, FONTS, CARDS, INPUTS, BUTTONS } from '../styles/theme';

const Home = ({ user }) => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarAgendar, setMostrarAgendar] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [filtroVehiculo, setFiltroVehiculo] = useState('todos');

  const cargarServicios = useCallback(async () => {
    try {
      const params = filtroVehiculo !== 'todos' ? `?tipo_vehiculo=${filtroVehiculo}` : '';
      const response = await api.get(`/servicios${params}`);
      setServicios(response.data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      alert('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  }, [filtroVehiculo]);

  useEffect(() => {
    if (user?.rol !== 'admin') {
      cargarServicios();
    } else {
      setLoading(false);
    }
  }, [cargarServicios, user?.rol]);

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    setMostrarAgendar(true);
  };

  const volver = () => {
    setMostrarAgendar(false);
    setServicioSeleccionado(null);
  };

  if (user?.rol === 'admin') {
    return (
      <div style={styles.container}>
        <div style={styles.headerSimple}>
          <h3 style={styles.welcomeText}>👋 Bienvenido, <strong>{user?.nombre || 'Usuario'}</strong></h3>
        </div>
        <div style={styles.adminMessage}>
          <h2 style={styles.adminTitle}>⛔ Acceso Restringido</h2>
          <p style={styles.adminText}>Los administradores no pueden agendar citas.</p>
          <p style={styles.adminSubtext}>Usa el panel de administrador para gestionar las citas de los clientes.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerSimple}>
        <h3 style={styles.welcomeText}>👋 Bienvenido, <strong>{user?.nombre || 'Usuario'}</strong></h3>
      </div>

      <main style={styles.main}>
        {!mostrarAgendar ? (
          <div>
            <h3 style={styles.sectionTitle}>Nuestros Servicios</h3>
            <p style={styles.subtitle}>Selecciona un servicio para agendar</p>

            <div style={styles.filtros}>
              <label style={styles.filtroLabel}>🚗 Filtrar por vehículo:</label>
              <select 
                value={filtroVehiculo} 
                onChange={(e) => setFiltroVehiculo(e.target.value)}
                style={styles.selectFiltro}
              >
                <option value="todos">🚗 Todos los servicios</option>
                <option value="coche">🚗 Coche</option>
                <option value="camioneta">🚙 Camioneta</option>
                <option value="furgoneta">🚐 Furgoneta</option>
                <option value="motocicleta">🏍️ Motocicleta</option>
              </select>
            </div>

            {loading ? (
              <Loader />
            ) : servicios.length === 0 ? (
              <p style={styles.sinServicios}>No hay servicios disponibles para este tipo de vehículo.</p>
            ) : (
              <div style={styles.grid}>
                {servicios.map((item) => (
                  <div key={item.id} style={styles.card}>
                    <h4 style={styles.cardTitle}>{item.nombre}</h4>
                    <p style={styles.cardDesc}>{item.descripcion}</p>
                    <p style={styles.cardPrice}>${item.precio}</p>
                    <p style={styles.cardTime}>⏱️ {item.tiempo_base_minutos} min</p>
                    {item.tipo_vehiculo && item.tipo_vehiculo !== 'todos' && (
                      <p style={styles.cardTipo}>🚗 {item.tipo_vehiculo}</p>
                    )}
                    <button 
                      onClick={() => seleccionarServicio(item)} 
                      style={styles.agendarBtn}
                    >
                      📅 Agendar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <AgendarCita 
            servicio={servicioSeleccionado} 
            user={user} 
            onVolver={volver} 
          />
        )}
      </main>
    </div>
  );
};

// ==========================================
// COMPONENTE AGENDAR CITA
// ==========================================
const AgendarCita = ({ servicio, user, onVolver }) => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('coche');
  const [cargando, setCargando] = useState(false);
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [cargandoDias, setCargandoDias] = useState(true);
  const [errorFecha, setErrorFecha] = useState('');
  const [mesActual, setMesActual] = useState(new Date().getMonth() + 1);
  const [añoActual, setAñoActual] = useState(new Date().getFullYear());
  const [toast, setToast] = useState(null);

  const cargarDiasDisponibles = useCallback(async (mes, año) => {
    try {
      setCargandoDias(true);
      const response = await api.get(`/horarios/dias-disponibles?mes=${mes}&año=${año}`);
      setDiasDisponibles(response.data);
    } catch (error) {
      console.error('Error al cargar días disponibles:', error);
      setToast({ message: '❌ Error al cargar días disponibles', type: 'error' });
    } finally {
      setCargandoDias(false);
    }
  }, []);

  useEffect(() => {
    cargarDiasDisponibles(mesActual, añoActual);
  }, [mesActual, añoActual, cargarDiasDisponibles]);

  useEffect(() => {
    if (fecha) {
      const diaInfo = diasDisponibles.find(d => d.fecha === fecha);
      if (diaInfo) {
        setHorasDisponibles(diaInfo.horasDisponibles);
        setErrorFecha('');
        if (!diaInfo.horasDisponibles.includes(hora)) {
          setHora('');
        }
      } else {
        setHorasDisponibles([]);
        setErrorFecha('Este día no está disponible para citas');
      }
    }
  }, [fecha, diasDisponibles, hora]);

  const handleAgendar = async () => {
    if (!fecha || !hora) {
      setToast({ message: '⚠️ Por favor selecciona fecha y hora', type: 'warning' });
      return;
    }

    setCargando(true);
    try {
      const disponibilidadResponse = await api.get(
        `/limites/verificar?fecha=${fecha}&tipo_vehiculo=${tipoVehiculo}`
      );

      if (!disponibilidadResponse.data.disponible) {
        setToast({ 
          message: `❌ No hay cupo disponible para ${tipoVehiculo} en esta fecha.`, 
          type: 'error' 
        });
        setCargando(false);
        return;
      }

      const vehiculoResponse = await api.post('/vehiculos', {
        tipo: tipoVehiculo
      });

      await api.post('/citas', {
        vehiculo_id: vehiculoResponse.data.id,
        servicio_id: servicio.id,
        fecha: fecha,
        hora: hora
      });

      setToast({ message: '✅ ¡Cita agendada con éxito!', type: 'success' });
      setTimeout(() => onVolver(), 1500);
    } catch (error) {
      console.error('Error al agendar:', error);
      let mensajeError = 'Error al agendar la cita. Intenta de nuevo.';
      if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      }
      setToast({ message: `❌ ${mensajeError}`, type: 'error' });
    } finally {
      setCargando(false);
    }
  };

  const cambiarMes = (incremento) => {
    let mes = mesActual + incremento;
    let año = añoActual;
    
    if (mes > 12) {
      mes = 1;
      año++;
    } else if (mes < 1) {
      mes = 12;
      año--;
    }
    
    setMesActual(mes);
    setAñoActual(año);
  };

  const renderCalendario = () => {
    if (cargandoDias) {
      return <Loader message="Cargando días disponibles..." />;
    }

    const fechasDisponibles = diasDisponibles.map(d => d.fecha);
    const diasEnMes = new Date(añoActual, mesActual, 0).getDate();
    const primerDiaSemana = new Date(añoActual, mesActual - 1, 1).getDay();
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
      <div style={styles.calendarioContainer}>
        <div style={styles.calendarioHeader}>
          <button onClick={() => cambiarMes(-1)} style={styles.calendarioBtn}>◀</button>
          <span style={styles.calendarioMes}>
            {new Date(añoActual, mesActual - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => cambiarMes(1)} style={styles.calendarioBtn}>▶</button>
        </div>

        <div style={styles.calendarioGrid}>
          {diasSemana.map(d => (
            <div key={d} style={styles.calendarioDiaSemana}>{d}</div>
          ))}
          
          {Array.from({ length: primerDiaSemana }).map((_, i) => (
            <div key={`empty-${i}`} style={styles.calendarioDiaVacio} />
          ))}
          
          {Array.from({ length: diasEnMes }).map((_, i) => {
            const dia = i + 1;
            const fechaStr = `${añoActual}-${String(mesActual).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
            const disponible = fechasDisponibles.includes(fechaStr);
            const seleccionado = fecha === fechaStr;
            
            return (
              <div
                key={dia}
                style={{
                  ...styles.calendarioDia,
                  ...(disponible ? styles.calendarioDiaDisponible : styles.calendarioDiaNoDisponible),
                  ...(seleccionado ? styles.calendarioDiaSeleccionado : {})
                }}
                onClick={() => {
                  if (disponible) {
                    setFecha(fechaStr);
                    setErrorFecha('');
                  } else {
                    setToast({ message: '⚠️ Este día no está disponible para citas', type: 'warning' });
                  }
                }}
              >
                {dia}
              </div>
            );
          })}
        </div>

        {fecha && (
          <p style={styles.fechaSeleccionada}>
            📅 Fecha seleccionada: {new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}

        {errorFecha && <p style={styles.error}>{errorFecha}</p>}
      </div>
    );
  };

  return (
    <div>
      <button onClick={onVolver} style={styles.volverBtn}>← Volver</button>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div style={styles.cardAgendar}>
        <h2 style={styles.agendarTitle}>📅 Agendar Cita</h2>
        <p><strong>Servicio:</strong> {servicio?.nombre}</p>
        <p><strong>Precio:</strong> ${servicio?.precio}</p>
        <p><strong>Duración:</strong> {servicio?.tiempo_base_minutos} minutos</p>

        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Tipo de Vehículo:</label>
          <select 
            value={tipoVehiculo} 
            onChange={(e) => setTipoVehiculo(e.target.value)}
            style={styles.input}
          >
            <option value="coche">🚗 Coche</option>
            <option value="camioneta">🚙 Camioneta</option>
            <option value="furgoneta">🚐 Furgoneta</option>
            <option value="motocicleta">🏍️ Motocicleta</option>
          </select>
        </div>

        {renderCalendario()}

        {fecha && horasDisponibles.length > 0 && (
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>⏰ Hora:</label>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              style={styles.input}
            >
              <option value="">Selecciona una hora</option>
              {horasDisponibles.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        )}

        {fecha && horasDisponibles.length === 0 && !errorFecha && (
          <p style={styles.error}>No hay horas disponibles para esta fecha</p>
        )}

        <button 
          onClick={handleAgendar} 
          style={{
            ...styles.confirmarBtn,
            ...((!fecha || !hora || cargando) ? styles.confirmarBtnDisabled : {})
          }}
          disabled={!fecha || !hora || cargando}
        >
          {cargando ? '⏳ Guardando...' : '✅ Confirmar Cita'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  headerSimple: {
    padding: '15px 30px',
    backgroundColor: COLORS.white,
    borderBottom: `1px solid ${COLORS.silverLight}`,
    marginBottom: '20px',
  },
  welcomeText: {
    ...FONTS.subtitle,
    color: COLORS.textDark,
  },
  adminMessage: {
    ...CARDS.default,
    textAlign: 'center',
    padding: '60px 20px',
    maxWidth: '500px',
    margin: '40px auto',
  },
  adminTitle: {
    ...FONTS.title,
    color: COLORS.error,
  },
  adminText: {
    ...FONTS.body,
    color: COLORS.textGray,
  },
  adminSubtext: {
    ...FONTS.small,
    color: COLORS.textGray,
    marginTop: '10px',
  },
  main: {
    padding: '0 30px 30px 30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    ...FONTS.title,
    marginBottom: '5px',
  },
  subtitle: {
    ...FONTS.small,
    color: COLORS.textGray,
    marginBottom: '20px',
  },
  filtros: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  filtroLabel: {
    ...FONTS.body,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  selectFiltro: {
    ...INPUTS.default,
    backgroundColor: COLORS.white,
    maxWidth: '250px',
  },
  sinServicios: {
    ...FONTS.body,
    color: COLORS.textGray,
    textAlign: 'center',
    padding: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '20px',
  },
  card: {
    ...CARDS.default,
    padding: '20px',
  },
  cardTitle: {
    ...FONTS.subtitle,
    color: COLORS.primary,
    fontSize: '18px',
  },
  cardDesc: {
    ...FONTS.body,
    color: COLORS.textGray,
    marginTop: '5px',
  },
  cardPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: COLORS.success,
    marginTop: '10px',
  },
  cardTime: {
    ...FONTS.small,
    color: COLORS.textGray,
  },
  cardTipo: {
    ...FONTS.small,
    color: COLORS.primaryLight,
    marginTop: '5px',
    fontWeight: 'bold',
  },
  agendarBtn: {
    ...BUTTONS.primary,
    width: '100%',
    marginTop: '15px',
    textAlign: 'center',
  },
  volverBtn: {
    ...BUTTONS.outline,
    marginBottom: '20px',
  },
  cardAgendar: {
    ...CARDS.default,
    maxWidth: '500px',
    margin: '0 auto',
    padding: '30px',
  },
  agendarTitle: {
    ...FONTS.title,
    marginBottom: '20px',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    ...FONTS.body,
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
    color: COLORS.textDark,
  },
  input: {
    ...INPUTS.default,
    backgroundColor: COLORS.white,
  },
  confirmarBtn: {
    ...BUTTONS.secondary,
    width: '100%',
    marginTop: '10px',
    textAlign: 'center',
  },
  confirmarBtnDisabled: {
    backgroundColor: COLORS.silverDark,
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginTop: '10px',
    padding: '8px',
    backgroundColor: '#FEE2E2',
    borderRadius: '8px',
  },
  
  // Calendario
  calendarioContainer: {
    ...CARDS.default,
    padding: '15px',
    marginBottom: '15px',
  },
  calendarioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  calendarioMes: {
    ...FONTS.subtitle,
    fontSize: '18px',
    textTransform: 'capitalize',
  },
  calendarioBtn: {
    ...BUTTONS.primary,
    padding: '8px 15px',
    fontSize: '14px',
  },
  calendarioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
  },
  calendarioDiaSemana: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '8px',
    fontSize: '12px',
    color: COLORS.textGray,
  },
  calendarioDia: {
    textAlign: 'center',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    minHeight: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarioDiaVacio: {
    padding: '10px',
  },
  calendarioDiaDisponible: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#c8e6c9',
    },
  },
  calendarioDiaNoDisponible: {
    backgroundColor: '#f5f5f5',
    color: '#bdbdbd',
    cursor: 'not-allowed',
  },
  calendarioDiaSeleccionado: {
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  fechaSeleccionada: {
    textAlign: 'center',
    marginTop: '10px',
    ...FONTS.small,
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
};

export default Home;