import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaWater, FaShieldAlt, FaStar } from 'react-icons/fa';
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
  const [error, setError] = useState(null);

  // ==========================================
  // ANIMACIONES
  // ==========================================
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.12 } }
  };

  const cardHover = {
    scale: 1.03,
    boxShadow: '0 20px 60px rgba(106,13,173,0.25)',
    transition: { duration: 0.3, ease: "easeOut" }
  };

  // ==========================================
  // FUNCIONES
  // ==========================================
  const cargarServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filtroVehiculo !== 'todos' ? `?tipo_vehiculo=${filtroVehiculo}` : '';
      const response = await api.get(`/servicios${params}`);

      console.log('Respuesta de /servicios:', response.data);

      const data = Array.isArray(response.data)
        ? response.data
        : (response.data?.servicios || response.data?.data || []);

      setServicios(data);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setError(`Error al cargar servicios: ${error.message}`);
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

  // ✅ Convierte la descripción larga en lista de items
  const parseDescripcion = (desc) => {
    if (!desc) return [];
    return desc
      .split(/\s*-\s*/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
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
            Somos tu lavadero de confianza. Cuidamos cada detalle de tu vehículo
            con productos premium y un acabado impecable.<br />
            <strong>Agendá tu cita en segundos.</strong>
          </motion.p>
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
        animate="visible"
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

        {error && (
          <div style={styles.error}>
            <strong>⚠️ Error:</strong> {error}
            <button onClick={() => cargarServicios()} style={styles.errorBtn}>
              Reintentar
            </button>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : servicios.length === 0 ? (
          <p style={styles.sinServicios}>No hay servicios disponibles para este tipo de vehículo.</p>
        ) : (
          <div style={styles.grid}>
            {servicios.map((item, index) => {
              const icons = [<FaWater key="water" />, <FaShieldAlt key="shield" />, <FaStar key="star" />];
              const items = parseDescripcion(item.descripcion);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={cardHover}
                  style={styles.card}
                >
                  <div style={styles.serviceIcon}>
                    {icons[index % icons.length]}
                  </div>
                  <h4 style={styles.cardTitle}>{item.nombre}</h4>

                  {/* ✅ Lista con viñetas */}
                  {items.length > 0 ? (
                    <ul style={styles.descList}>
                      {items.map((punto, i) => (
                        <li key={i} style={styles.descItem}>
                          <span style={styles.descBullet}>•</span>
                          <span style={styles.descText}>{punto}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={styles.cardDesc}>Sin descripción</p>
                  )}

                  <p style={styles.cardPrice}>${item.precio}</p>
                  <p style={styles.cardTime}>⏱️ {item.tiempo_base_minutos} min</p>
                  {item.tipo_vehiculo && item.tipo_vehiculo !== 'todos' && (
                    <p style={styles.cardTipo}>🚗 {item.tipo_vehiculo}</p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => seleccionarServicio(item)}
                    style={styles.agendarBtn}
                  >
                    📅 Agendar cita
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* SECCIÓN DE CONTACTO */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        style={styles.contactoSection}
      >
        <motion.h2 variants={fadeInUp} style={styles.contactoTitle}>
          📞 Contáctanos
        </motion.h2>
        <motion.p variants={fadeInUp} style={styles.contactoSub}>
          Estamos disponibles para atenderte por cualquiera de estos medios
        </motion.p>

        <div style={styles.contactoGrid}>
          {/* Teléfono / WhatsApp */}
          <motion.a
            variants={fadeInUp}
            whileHover={cardHover}
            href="https://wa.me/529993336921?text=Hola,%20quiero%20agendar%20una%20cita%20en%20HI%20PERFORMANCE"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.contactoCard}
          >
            <div style={styles.contactoIcon}>📞</div>
            <h4 style={styles.contactoCardTitle}>Teléfono / WhatsApp</h4>
            <p style={styles.contactoCardValue}>999 333 6921</p>
            <span style={styles.contactoCardHint}>Toca para escribirnos</span>
          </motion.a>

          {/* Dirección */}
          <motion.a
            variants={fadeInUp}
            whileHover={cardHover}
            href="https://maps.app.goo.gl/a2JeJ2gjLsoMcG9N7"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.contactoCard}
          >
            <div style={styles.contactoIcon}>📍</div>
            <h4 style={styles.contactoCardTitle}>Dirección</h4>
            <p style={styles.contactoCardValue}>C. 31 #87-A</p>
            <p style={styles.contactoCardSub}>97510 Temax, Yuc.</p>
            <span style={styles.contactoCardHint}>Ver en Google Maps</span>
          </motion.a>

          {/* Horario */}
          <motion.div
            variants={fadeInUp}
            style={styles.contactoCard}
          >
            <div style={styles.contactoIcon}>🕐</div>
            <h4 style={styles.contactoCardTitle}>Horario de atención</h4>
            <p style={styles.contactoCardValue}>Sábado: 8:30 am – 6:00 pm</p>
            <p style={styles.contactoCardValue}>Domingo: 8:00 am – 3:00 pm</p>
          </motion.div>
        </div>
      </motion.section>

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
// ESTILOS
// ==========================================
const styles = {
  container: {
    minHeight: '100vh',
  },
  headerSimple: {
    padding: '20px 30px',
    marginBottom: '20px',
  },
  welcomeText: {
    ...FONTS.subtitle,
    color: COLORS.textLight,
    textShadow: '0 2px 12px rgba(0,0,0,0.15)',
  },
  adminMessage: {
    ...CARDS.default,
    textAlign: 'center',
    padding: '60px 20px',
    maxWidth: '500px',
    margin: '40px auto',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    borderRadius: '32px',
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
  hero: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 'clamp(30px, 5vw, 60px) clamp(20px, 4vw, 40px)',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(12px)',
    borderRadius: '32px',
    marginBottom: '40px',
    border: '1px solid rgba(255,255,255,0.2)',
    flexWrap: 'wrap',
    gap: '30px',
  },
  heroContent: {
    flex: 1,
    minWidth: '280px',
  },
  heroTitle: {
    fontSize: 'clamp(1.8rem, 7vw, 3.5rem)',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '20px',
    lineHeight: 1.2,
    color: '#fff',
    textShadow: '0 4px 20px rgba(0,0,0,0.15)',
    wordBreak: 'break-word',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: '30px',
    lineHeight: 1.6,
    textShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  heroButtons: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #6A0DAD 0%, #8B5CF6 100%)',
    color: '#fff',
    border: 'none',
    padding: '16px 36px',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 25px rgba(106,13,173,0.4)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    letterSpacing: '0.5px',
    backdropFilter: 'blur(4px)',
  },
  btnOutline: {
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    border: '2px solid rgba(255,255,255,0.5)',
    padding: '14px 32px',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
    borderRadius: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  section: {
    padding: '40px 0',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    ...FONTS.title,
    textAlign: 'center',
    marginBottom: '10px',
    color: '#fff',
    textShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  sectionSub: {
    ...FONTS.small,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: '40px',
  },
  filtros: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
    flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(8px)',
    padding: '16px 24px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  filtroLabel: {
    ...FONTS.body,
    fontWeight: '600',
    color: '#fff',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  selectFiltro: {
    ...INPUTS.default,
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(4px)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
    maxWidth: '250px',
  },
  sinServicios: {
    ...FONTS.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    padding: '60px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '24px',
    backdropFilter: 'blur(8px)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
    gap: '30px',
    marginTop: '30px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '30px 25px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.3)',
    transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  serviceIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px',
    color: COLORS.primary,
    filter: 'drop-shadow(0 4px 12px rgba(106,13,173,0.2))',
  },
  cardTitle: {
    ...FONTS.subtitle,
    color: COLORS.primary,
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  cardDesc: {
    ...FONTS.body,
    color: COLORS.textGray,
    marginTop: '8px',
    lineHeight: 1.5,
  },
  // ✅ LISTA CON VIÑETAS
  descList: {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    textAlign: 'left',
  },
  descItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '14px',
    lineHeight: 1.4,
  },
  descBullet: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '1.4',
    flexShrink: 0,
  },
  descText: {
    color: COLORS.textGray,
    fontSize: '14px',
    textTransform: 'capitalize',
    letterSpacing: '0.2px',
  },
  cardPrice: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: COLORS.success,
    marginTop: '15px',
    textShadow: '0 2px 8px rgba(34,197,94,0.2)',
  },
  cardTime: {
    ...FONTS.small,
    color: COLORS.textGray,
    marginTop: '5px',
  },
  cardTipo: {
    ...FONTS.small,
    color: COLORS.primaryLight,
    marginTop: '8px',
    fontWeight: '600',
  },
  agendarBtn: {
    background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
    color: '#fff',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '50px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
    width: '100%',
    marginTop: '20px',
    fontSize: '16px',
    letterSpacing: '0.3px',
  },
  // MODAL AGENDAR
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 'clamp(10px, 3vw, 20px)',
  },
  cardAgendar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    maxWidth: '520px',
    width: '100%',
    padding: 'clamp(15px, 4vw, 35px)',
    borderRadius: '32px',
    boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  agendarTitle: {
    ...FONTS.title,
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: 'clamp(20px, 5vw, 26px)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    ...FONTS.body,
    fontWeight: '600',
    display: 'block',
    marginBottom: '6px',
    color: COLORS.textDark,
  },
  input: {
    ...INPUTS.default,
    backgroundColor: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(4px)',
    border: '2px solid rgba(229,231,235,0.5)',
  },
  confirmarBtn: {
    ...BUTTONS.secondary,
    width: '100%',
    marginTop: '15px',
    textAlign: 'center',
    borderRadius: '50px',
    padding: '14px',
    fontSize: 'clamp(15px, 4vw, 17px)',
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
    padding: '12px',
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: '14px',
    borderLeft: '4px solid #EF4444',
  },
  errorBtn: {
    marginLeft: '12px',
    padding: '6px 16px',
    background: COLORS.primary,
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  volverBtn: {
    ...BUTTONS.outline,
    marginBottom: '20px',
    borderRadius: '50px',
    padding: '10px 24px',
    fontSize: 'clamp(13px, 3.5vw, 15px)',
  },
  // CALENDARIO - RESPONSIVE
  calendarioContainer: {
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(8px)',
    borderRadius: '20px',
    padding: 'clamp(10px, 3vw, 18px)',
    marginBottom: '18px',
    border: '1px solid rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  calendarioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(8px, 2vw, 15px)',
    gap: '6px',
  },
  calendarioMes: {
    ...FONTS.subtitle,
    fontSize: 'clamp(13px, 3.5vw, 18px)',
    textTransform: 'capitalize',
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
    padding: '0 4px',
  },
  calendarioBtn: {
    ...BUTTONS.primary,
    padding: 'clamp(4px, 1.5vw, 8px) clamp(8px, 2.5vw, 18px)',
    fontSize: 'clamp(10px, 3vw, 14px)',
    borderRadius: '40px',
    minWidth: 'auto',
    flexShrink: 0,
  },
  calendarioGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 'clamp(2px, 0.8vw, 6px)',
  },
  calendarioDiaSemana: {
    textAlign: 'center',
    fontWeight: '700',
    padding: 'clamp(3px, 1vw, 8px) 2px',
    fontSize: 'clamp(8px, 2.2vw, 12px)',
    color: COLORS.textGray,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  calendarioDia: {
    textAlign: 'center',
    padding: 'clamp(3px, 1vw, 10px) 2px',
    borderRadius: 'clamp(6px, 2vw, 12px)',
    cursor: 'pointer',
    fontSize: 'clamp(10px, 2.8vw, 15px)',
    minHeight: 'clamp(26px, 7vw, 38px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontWeight: '500',
  },
  calendarioDiaVacio: {
    padding: 'clamp(3px, 1vw, 10px) 2px',
  },
  calendarioDiaDisponible: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    color: '#15803D',
    cursor: 'pointer',
  },
  calendarioDiaNoDisponible: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    color: '#bdbdbd',
    cursor: 'not-allowed',
  },
  calendarioDiaSeleccionado: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontWeight: '700',
    boxShadow: '0 4px 16px rgba(106,13,173,0.3)',
    transform: 'scale(1.05)',
  },
  fechaSeleccionada: {
    textAlign: 'center',
    marginTop: '12px',
    ...FONTS.small,
    color: COLORS.textDark,
    fontWeight: '600',
    fontSize: 'clamp(11px, 3vw, 14px)',
    padding: '0 4px',
    wordBreak: 'break-word',
  },
  // SECCIÓN DE CONTACTO
  contactoSection: {
    padding: '40px 0',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: '20px',
  },
  contactoTitle: {
    ...FONTS.title,
    textAlign: 'center',
    marginBottom: '10px',
    color: '#fff',
    textShadow: '0 2px 12px rgba(0,0,0,0.2)',
  },
  contactoSub: {
    ...FONTS.small,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: 'clamp(13px, 3vw, 15px)',
  },
  contactoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
    gap: '20px',
  },
  contactoCard: {
    background: 'linear-gradient(135deg, rgba(74,10,122,0.85) 0%, rgba(106,13,173,0.75) 100%)',
    backdropFilter: 'blur(16px)',
    borderRadius: '24px',
    padding: '30px 25px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    textDecoration: 'none',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  contactoIcon: {
    fontSize: '44px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
  },
  contactoCardTitle: {
    ...FONTS.subtitle,
    color: '#86EFAC',
    fontSize: '15px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  contactoCardValue: {
    ...FONTS.body,
    color: '#FFFFFF',
    fontSize: 'clamp(15px, 3.5vw, 18px)',
    fontWeight: '700',
    margin: 0,
    lineHeight: 1.4,
  },
  contactoCardSub: {
    ...FONTS.small,
    color: 'rgba(255,255,255,0.85)',
    fontSize: '14px',
    margin: 0,
  },
  contactoCardHint: {
    ...FONTS.small,
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    fontStyle: 'italic',
    marginTop: '8px',
  },
};

export default Home;