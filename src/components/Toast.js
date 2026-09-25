import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <>
      {/* Fondo oscuro difuminado */}
      <div style={styles.overlay} onClick={onClose}></div>

      {/* Toast centrado */}
      <div style={styles.container}>
        <div
          style={{
            ...styles.iconCircle,
            backgroundColor: colors[type] || colors.success,
          }}
        >
          <span style={styles.icon}>{icons[type] || '✅'}</span>
        </div>

        <p style={styles.message}>{message}</p>

        <button
          onClick={onClose}
          style={{
            ...styles.closeBtn,
            backgroundColor: colors[type] || colors.success,
          }}
        >
          Entendido
        </button>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(4px)',
    zIndex: 9998,
    animation: 'fadeIn 0.25s ease',
  },
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '35px 28px',
    borderRadius: '24px',
    backgroundColor: '#fff',
    boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    minWidth: '280px',
    maxWidth: '380px',
    width: '88%',
    animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  iconCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '18px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
  icon: {
    fontSize: '36px',
    lineHeight: 1,
  },
  message: {
    fontSize: '16px',
    color: '#1F2937',
    fontWeight: '600',
    lineHeight: 1.5,
    margin: '0 0 22px 0',
    wordBreak: 'break-word',
  },
  closeBtn: {
    border: 'none',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    padding: '12px 36px',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
  },
};

// Animaciones CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes popIn {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;
if (!document.getElementById('toast-styles')) {
  styleSheet.id = 'toast-styles';
  document.head.appendChild(styleSheet);
}

export default Toast;