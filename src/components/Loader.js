import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = ({ message = 'Cargando...' }) => {
  return (
    <div style={styles.container}>
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#007bff"
        ariaLabel="three-dots-loading"
        visible={true}
      />
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    padding: '20px',
  },
  message: {
    marginTop: '15px',
    color: '#666',
    fontSize: '16px',
  },
};

export default Loader;