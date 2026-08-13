// src/constants/theme.ts

export const COLORS = {
  // Colores de la marca HI PERFORMANCE
  primary: '#6A0DAD',       // Morado principal
  primaryDark: '#4A0A7A',   // Morado oscuro
  primaryLight: '#8B5CF6',  // Morado claro
  secondary: '#22C55E',     // Verde principal
  secondaryDark: '#15803D', // Verde oscuro
  secondaryLight: '#86EFAC',// Verde claro
  silver: '#C0C0C0',        // Plateado
  silverLight: '#E5E7EB',   // Plateado claro
  silverDark: '#9CA3AF',    // Plateado oscuro
  
  // Colores de texto
  textLight: '#FFFFFF',
  textDark: '#1F2937',
  textGray: '#6B7280',
  
  // Colores de fondo
  background: '#F3F4F6',
  white: '#FFFFFF',
  
  // Colores de estado
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const FONTS = {
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.textDark,
  },
  body: {
    fontSize: '16px',
    color: COLORS.textDark,
  },
  small: {
    fontSize: '14px',
    color: COLORS.textGray,
  },
};

export const BUTTONS = {
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: COLORS.primaryDark,
      transform: 'scale(1.02)',
      boxShadow: '0 4px 15px rgba(106, 13, 173, 0.4)',
    },
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: COLORS.secondaryDark,
      transform: 'scale(1.02)',
      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
    },
  },
  outline: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '8px',
    padding: '10px 22px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: COLORS.primary,
      color: COLORS.textLight,
    },
  },
};

export const CARDS = {
  default: {
    backgroundColor: COLORS.white,
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    padding: '20px',
    border: `1px solid ${COLORS.silverLight}`,
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 25px rgba(106, 13, 173, 0.15)',
      borderColor: COLORS.primaryLight,
    },
  },
};

export default {
  COLORS,
  FONTS,
  BUTTONS,
  CARDS,
};