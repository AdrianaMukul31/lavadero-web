import React from 'react';

const Logo = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { height: 40, fontSize: 16 },
    medium: { height: 60, fontSize: 20 },
    large: { height: 100, fontSize: 28 },
    xlarge: { height: 140, fontSize: 34 },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div style={styles.container}>
      <img 
        src="/logo43.png"
        alt="HI PERFORMANCE - Detallado Automotriz"
        style={{
          height: currentSize.height,
          width: 'auto',
          objectFit: 'contain',
          maxWidth: '100%',
        }}
        onError={(e) => {
          console.error('❌ Error al cargar el logo:', e.target.src);
          e.target.style.display = 'none';
        }}
      />
      {showText && (
        <div style={{...styles.text, fontSize: currentSize.fontSize }}>
          <span style={styles.brand}>HI</span>
          <span style={styles.highlight}>PERFORMANCE</span>
          <span style={styles.sub}>DETALLADO AUTOMOTRIZ</span>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  brand: {
    color: '#22C55E',
    fontSize: '1em',
    letterSpacing: '2px',
    fontWeight: '900',
  },
  highlight: {
    color: '#C0C0C0',
    fontSize: '1em',
    letterSpacing: '2px',
    fontWeight: '900',
  },
  sub: {
    color: '#9CA3AF',
    fontSize: '0.45em',
    fontWeight: '600',
    letterSpacing: '3px',
    marginTop: '2px',
  },
};

export default Logo;