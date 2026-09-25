import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.overlay}
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.icon}>⚠️</div>
          <h3 style={styles.title}>{title}</h3>
          <p style={styles.message}>{message}</p>
          
          <div style={styles.buttons}>
            <button onClick={onCancel} style={styles.cancelBtn}>
              Cancelar
            </button>
            <button onClick={onConfirm} style={styles.confirmBtn}>
              Sí, eliminar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
  },
  modal: {
    background: '#fff',
    padding: '35px 25px',
    borderRadius: '28px',
    boxShadow: '0 30px 90px rgba(0,0,0,0.4)',
    maxWidth: '380px',
    width: '90%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    fontSize: '50px',
    marginBottom: '15px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: '10px',
  },
  message: {
    fontSize: '15px',
    color: '#6B7280',
    marginBottom: '30px',
    lineHeight: 1.5,
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '50px',
    border: '2px solid #E5E7EB',
    background: '#fff',
    color: '#6B7280',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '15px',
  },
  confirmBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '50px',
    border: 'none',
    background: '#EF4444',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '15px',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
  },
};

export default ConfirmModal;