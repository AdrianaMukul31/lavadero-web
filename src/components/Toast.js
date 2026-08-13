import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
  };

  const bgColors = {
    success: '#d4edda',
    error: '#f8d7da',
    warning: '#fff3cd',
    info: '#d1ecf1',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div style={{
      ...styles.container,
      borderLeft: `4px solid ${colors[type] || colors.success}`,
      backgroundColor: bgColors[type] || bgColors.success,
    }}>
      <span style={styles.icon}>{icons[type] || '✅'}</span>
      <span style={styles.message}>{message}</span>
      <button onClick={onClose} style={styles.closeBtn}>✕</button>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '280px',
    maxWidth: '450px',
    animation: 'slideIn 0.3s ease',
  },
  icon: {
    fontSize: '20px',
  },
  message: {
    flex: 1,
    fontSize: '15px',
    color: '#333',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#666',
    padding: '0 5px',
  },
};

// Agregar animación CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default Toast;