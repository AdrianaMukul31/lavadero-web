import React, { useState } from 'react';
import Login from './components/Login';
import Registro from './components/Registro';
import Home from './components/Home';
import MisCitas from './components/MisCitas';
import EditarPerfil from './components/EditarPerfil';
import AdminCitas from './components/AdminCitas';
import AdminServicios from './components/AdminServicios';
import AdminDashboard from './components/AdminDashboard';
import AdminClientes from './components/AdminClientes';
import AdminHorarios from './components/AdminHorarios';
import AdminVehiculos from './components/AdminVehiculos';
import AdminLimites from './components/AdminLimites';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [vista, setVista] = useState('home');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setVista(userData.rol === 'admin' ? 'admin-dashboard' : 'home');
    setMostrarRegistro(false);
    setMenuAbierto(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setMenuAbierto(false);
  };

  const cambiarVista = (vista) => {
    setVista(vista);
    setMenuAbierto(false);
  };

  if (mostrarRegistro) {
    return <Registro onRegistro={handleLogin} onVolver={() => setMostrarRegistro(false)} />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} onRegistro={() => setMostrarRegistro(true)} />;
  }

  const isAdmin = user.rol === 'admin';

  // Renderizar botones del menú según rol
  const renderMenuItems = () => {
    if (!isAdmin) {
      return (
        <>
          <button className="menu-item" onClick={() => cambiarVista('home')}>
            🏠 Servicios
          </button>
          <button className="menu-item" onClick={() => cambiarVista('mis-citas')}>
            📋 Mis Citas
          </button>
          <button className="menu-item" onClick={() => cambiarVista('editar-perfil')}>
            ✏️ Mi Perfil
          </button>
        </>
      );
    }

    return (
      <>
        <button className="menu-item" onClick={() => cambiarVista('admin-dashboard')}>
          📊 Dashboard
        </button>
        <button className="menu-item" onClick={() => cambiarVista('admin-clientes')}>
          👥 Clientes
        </button>
        <button className="menu-item" onClick={() => cambiarVista('admin-vehiculos')}>
          🚗 Vehículos
        </button>
        <button className="menu-item" onClick={() => cambiarVista('admin-citas')}>
          📋 Todas las Citas
        </button>
        <button className="menu-item" onClick={() => cambiarVista('admin-servicios')}>
          ⚙️ Servicios
        </button>
        <button className="menu-item" onClick={() => cambiarVista('admin-horarios')}>
          🕐 Horarios
        </button>
        <button className="menu-item" onClick={() => cambiarVista('admin-limites')}>
          📊 Límites
        </button>
      </>
    );
  };

  // Renderizar botones del nav (escritorio) según rol
  const renderNavButtons = () => {
    if (!isAdmin) {
      return (
        <>
          <button onClick={() => cambiarVista('home')} className={vista === 'home' ? 'active' : ''}>
            🏠 Servicios
          </button>
          <button onClick={() => cambiarVista('mis-citas')} className={vista === 'mis-citas' ? 'active' : ''}>
            📋 Mis Citas
          </button>
          <button onClick={() => cambiarVista('editar-perfil')} className={vista === 'editar-perfil' ? 'active' : ''}>
            ✏️ Mi Perfil
          </button>
        </>
      );
    }

    return (
      <>
        <button onClick={() => cambiarVista('admin-dashboard')} className={vista === 'admin-dashboard' ? 'active' : ''}>
          📊 Dashboard
        </button>
        <button onClick={() => cambiarVista('admin-clientes')} className={vista === 'admin-clientes' ? 'active' : ''}>
          👥 Clientes
        </button>
        <button onClick={() => cambiarVista('admin-vehiculos')} className={vista === 'admin-vehiculos' ? 'active' : ''}>
          🚗 Vehículos
        </button>
        <button onClick={() => cambiarVista('admin-citas')} className={vista === 'admin-citas' ? 'active' : ''}>
          📋 Todas las Citas
        </button>
        <button onClick={() => cambiarVista('admin-servicios')} className={vista === 'admin-servicios' ? 'active' : ''}>
          ⚙️ Servicios
        </button>
        <button onClick={() => cambiarVista('admin-horarios')} className={vista === 'admin-horarios' ? 'active' : ''}>
          🕐 Horarios
        </button>
        <button onClick={() => cambiarVista('admin-limites')} className={vista === 'admin-limites' ? 'active' : ''}>
          📊 Límites
        </button>
      </>
    );
  };

  return (
    <div>
      {/* Overlay (fondo oscuro) */}
      <div className={`menu-overlay ${menuAbierto ? 'open' : ''}`} onClick={() => setMenuAbierto(false)} />

      {/* Menú lateral (móvil) */}
      <div className={`side-menu ${menuAbierto ? 'open' : ''}`}>
        <div className="menu-header">
          <span className="brand">
            <span className="highlight">HI</span>
            <span className="silver">PERFORMANCE</span>
          </span>
        </div>
        {renderMenuItems()}
        <button className="menu-item logout" onClick={handleLogout}>
          🚪 Cerrar Sesión
        </button>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-title">
            <span className="highlight">HI</span>
            <span className="silver">PERFORMANCE</span>
          </div>

          {/* Botón hamburguesa (móvil) */}
          <button className="menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
            ☰
          </button>

          {/* Menú escritorio */}
          <div className="nav-links">
            {renderNavButtons()}
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <div className="app-container">
        {!isAdmin && vista === 'home' && <Home user={user} />}
        {!isAdmin && vista === 'mis-citas' && <MisCitas />}
        {!isAdmin && vista === 'editar-perfil' && <EditarPerfil user={user} onPerfilActualizado={setUser} />}

        {isAdmin && vista === 'admin-dashboard' && <AdminDashboard />}
        {isAdmin && vista === 'admin-clientes' && <AdminClientes />}
        {isAdmin && vista === 'admin-vehiculos' && <AdminVehiculos />}
        {isAdmin && vista === 'admin-citas' && <AdminCitas />}
        {isAdmin && vista === 'admin-servicios' && <AdminServicios />}
        {isAdmin && vista === 'admin-horarios' && <AdminHorarios />}
        {isAdmin && vista === 'admin-limites' && <AdminLimites />}
      </div>
    </div>
  );
}

export default App;