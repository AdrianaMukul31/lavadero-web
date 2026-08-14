import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaWater, FaShieldAlt, FaClock, FaStar, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import Toast from './Toast';
import Loader from './Loader';
import { COLORS, FONTS, CARDS, INPUTS, BUTTONS } from '../styles/theme';

const Home = ({ user }) => {
  const [servicios, setServicios] = useState([]);
  const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarAgendar, setMostrarAgendar] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [filtroVehiculo, setFiltroVehiculo] = useState('todos');

  // ==========================================
  // ANIMACIONES
  // ==========================================
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const cardHover = {
    scale: 1.03,
    boxShadow: '0 12px 30px rgba(106,13,173,0.2)',
    transition: { duration: 0.3 }
  };

  // ==========================================
  // FUNCIONES
  // ==========================================
  // 🔥 CAMBIO: siempre carga TODOS los servicios (sin filtro)
  const cargarServicios = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando servicios (cliente) sin filtro...');
      const response = await api.get('/servicios');
      console.log('✅ Servicios recibidos:', response.data);
      setServicios(response.data);
    } catch (error) {
      console.error('❌ Error al cargar servicios:', error);
      alert('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    console.log('👤 user en Home:', user);
    if (user?.rol !== 'admin') {
      cargarServicios();
    } else {
      setLoading(false);
    }
  }, [cargarServicios, user?.rol]);

  // Filtrado local (cuando cambia el filtro o los servicios)
  useEffect(() => {
    if (filtroVehiculo === 'todos') {
      setServiciosFiltrados(servicios);
    } else {
      setServiciosFiltrados(
        servicios.filter(s => s.tipo_vehiculo === filtroVehiculo)
      );
    }
  }, [filtroVehiculo, servicios]);

  const seleccionarServicio = (servicio) => {
    setServicioSeleccionado(servicio);
    setMostrarAgendar(true);
  };

  const volver = () => {
    setMostrarAgendar(false);
    setServicioSeleccionado(null);
  };

  // ==========================================
  // RENDER ADMIN
  // ==========================================
  if (user?.rol === 'admin') {
    return (
      <div style={styles.container}>
        <div style={styles.headerSimple}>
          <h3 style={styles.welcomeText}>👋 Bienvenido, <strong>{user?.nombre || 'Usuario'}</strong></h3>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={styles.adminMessage}
        >
          <h2 style={styles.adminTitle}>⛔ Acceso Restringido</h2>
          <p style={styles.adminText}>Los administradores no pueden agendar citas.</p>
          <p style={styles.adminSubtext}>Usa el panel de administrador para gestionar las citas de los clientes.</p>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // RENDER PRINCIPAL (CLIENTE)
  // ==========================================
  return (
    <div style={styles.container}>
      {/* HERO SECTION */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        style={styles.hero}
      >
        <div style={styles.heroContent}>
          <motion.h1 style={styles.heroTitle} variants={fadeInUp}>
            <span style={{ color: COLORS.primary }}>HI</span>
            <span style={{ color: COLORS.silver }}> PERFORMANCE</span>
          </motion.h1>
          <motion.p style={styles.heroSubtitle} variants={fadeInUp}>
            Tu vehículo merece brillar.<br />
            Reservá tu turno en segundos.
          </motion.p>
          <motion.div style={styles.heroButtons} variants={fadeInUp}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.btnPrimary}
              onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
            >
              Reservar Turno <FaArrowRight style={{ marginLeft: '8px' }} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.btnOutline}
              onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Servicios
            </motion.button>
          </motion.div>
        </div>
        <motion.div
          style={styles.heroImage}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600"
            alt="Coche brillante"
            style={styles.heroImg}
          />
        </motion.div>
      </motion.section>

      {/* SECCIÓN DE SERVICIOS */}
      <motion.section
        id="servicios"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        style={styles.section}
      >
        <motion.h2 variants={fadeInUp} style={styles.sectionTitle}>Nuestros Servicios</motion.h2>
        <motion.p variants={fadeInUp} style={styles.sectionSub}>
          Cuidamos cada detalle de tu vehículo con productos de primera calidad.
        </motion.p>

        {/* FILTRO */}
        <motion.div variants={fadeInUp} style={styles.filtros}>
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
        </motion.div>

        {loading ? (
          <Loader />
        ) : serviciosFiltrados.length === 0 ? (
          <p style={styles.sinServicios}>No hay servicios disponibles para este tipo de vehículo.</p>
        ) : (
          <motion.div
            variants={staggerContainer}
            style={styles.grid}
          >
            {serviciosFiltrados.map((item, index) => {
              const icons = [<FaWater />, <FaShieldAlt />, <FaStar />];
              return (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  whileHover={cardHover}
                  style={styles.card}
                >
                  <div style={styles.serviceIcon}>
                    {icons[index % icons.length]}
                  </div>
                  <h4 style={styles.cardTitle}>{item.nombre}</h4>
                  <p style={styles.cardDesc}>{item.descripcion}</p>
                  <p style={styles.cardPrice}>${item.precio}</p>
                  <p style={styles.cardTime}>⏱️ {item.tiempo_base_minutos} min</p>
                  {item.tipo_vehiculo && item.tipo_vehiculo !== 'todos' && (
                    <p style={styles.cardTipo}>🚗 {item.tipo_vehiculo}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => seleccionarServicio(item)}
                    style={styles.agendarBtn}
                  >
                    📅 Agendar
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>

      {/* BENEFICIOS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        style={styles.benefitsSection}
      >
        <div style={styles.benefitsGrid}>
          <motion.div variants={fadeInUp} style={styles.benefitItem}>
            <FaClock size={40} color={COLORS.primary} />
            <h4>Reserva en 1 minuto</h4>
            <p>Agendá tu turno de forma rápida y sencilla.</p>
          </motion.div>
          <motion.div variants={fadeInUp} style={styles.benefitItem}>
            <FaWater size={40} color={COLORS.secondary} />
            <h4>Productos premium</h4>
            <p>Utilizamos los mejores productos para tu vehículo.</p>
          </motion.div>
          <motion.div variants={fadeInUp} style={styles.benefitItem}>
            <FaShieldAlt size={40} color={COLORS.silverDark} />
            <h4>Acabado impecable</h4>
            <p>Dejamos tu coche como nuevo, con brillo y protección.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA FINAL */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={styles.ctaSection}
      >
        <h2 style={styles.ctaTitle}>¿Listo para que tu coche brille?</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={styles.btnPrimary}
          onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
        >
          Reservar Turno Ahora
        </motion.button>
      </motion.div>

      {/* AGENDAR CITA (OVERLAY) */}
      {mostrarAgendar && (
        <AgendarCita
          servicio={servicioSeleccionado}
          user={user}
          onVolver={volver}
        />
      )}
    </div>
  );
};

// ==========================================
// COMPONENTE AGENDAR CITA (MEJORADO)
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
    if (mes > 12) { mes = 1; año++; }
    else if (mes < 1) { mes = 12; año--; }
    setMesActual(mes);
    setAñoActual(año);
  };

  const renderCalendario = () => {
    if (cargandoDias) return <Loader message="Cargando días disponibles..." />;

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
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      style={styles.modalOverlay}
      onClick={onVolver}
    >
      <motion.div
        style={styles.cardAgendar}
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={onVolver} style={styles.volverBtn}>← Volver</button>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// ESTILOS (MEJORADOS)
// ==========================================
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
  // HERO
  hero: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '60px 40px',
    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
    minHeight: '60vh',
    flexWrap: 'wrap',
  },
  heroContent: {
    flex: 1,
    minWidth: '280px',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    marginBottom: '20px',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    color: '#4B5563',
    marginBottom: '30px',
    lineHeight: 1.6,
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    border: 'none',
    padding: '14px 30px',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: `0 4px 15px rgba(106,13,173,0.3)`,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    padding: '12px 28px',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  heroImage: {
    flex: 1,
    minWidth: '280px',
    display: 'flex',
    justifyContent: 'center',
  },
  heroImg: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
  },
  // SECCIÓN SERVICIOS
  section: {
    padding: '60px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    ...FONTS.title,
    textAlign: 'center',
    marginBottom: '10px',
  },
  sectionSub: {
    ...FONTS.small,
    color: COLORS.textGray,
    textAlign: 'center',
    marginBottom: '40px',
  },
  filtros: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
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
    gap: '30px',
    marginTop: '20px',
  },
  card: {
    ...CARDS.default,
    padding: '25px 20px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  serviceIcon: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: COLORS.primary,
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
    borderRadius: '50px',
  },
  // BENEFICIOS
  benefitsSection: {
    padding: '40px 20px',
    backgroundColor: COLORS.white,
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  benefitItem: {
    textAlign: 'center',
    padding: '20px',
  },
  // CTA
  ctaSection: {
    padding: '60px 20px',
    textAlign: 'center',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
    color: '#fff',
  },
  ctaTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  // AGENDAR MODAL
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  cardAgendar: {
    ...CARDS.default,
    maxWidth: '500px',
    width: '100%',
    padding: '30px',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: COLORS.white,
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
    borderRadius: '50px',
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
  volverBtn: {
    ...BUTTONS.outline,
    marginBottom: '20px',
  },
  // CALENDARIO
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