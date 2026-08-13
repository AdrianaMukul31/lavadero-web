// src/styles/theme.js

export const COLORS = {
  // Colores de la marca HI PERFORMANCE
  primary: '#6A0DAD',       // Morado principal
  primaryDark: '#4A0A7A',   // Morado oscuro
  primaryLight: '#8B5CF6',  // Morado claro
  primaryGradient: 'linear-gradient(135deg, #6A0DAD 0%, #4A0A7A 100%)',
  
  secondary: '#22C55E',     // Verde principal
  secondaryDark: '#15803D', // Verde oscuro
  secondaryLight: '#86EFAC',// Verde claro
  secondaryGradient: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
  
  silver: '#C0C0C0',        // Plateado
  silverLight: '#E5E7EB',   // Plateado claro
  silverDark: '#9CA3AF',    // Plateado oscuro
  
  // Colores de texto
  textLight: '#FFFFFF',
  textDark: '#1F2937',
  textGray: '#6B7280',
  textSilver: '#9CA3AF',
  
  // Colores de fondo
  background: '#F3F4F6',
  backgroundGradient: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
  white: '#FFFFFF',
  
  // Colores de estado
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Sombras
  shadow: '0 4px 20px rgba(106, 13, 173, 0.15)',
  shadowStrong: '0 8px 40px rgba(106, 13, 173, 0.25)',
  shadowHover: '0 8px 40px rgba(106, 13, 173, 0.2)',
  
  // Bordes
  border: '2px solid #C0C0C0',
  borderLight: '1px solid #E5E7EB',
  borderRadius: '12px',
  borderRadiusSmall: '8px',
  borderRadiusLarge: '20px',
};

export const FONTS = {
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: '0.5px',
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
  tiny: {
    fontSize: '12px',
    color: COLORS.textSilver,
  },
};

export const BUTTONS = {
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: COLORS.primaryDark,
      transform: 'translateY(-2px)',
      boxShadow: COLORS.shadowStrong,
    },
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: COLORS.secondaryDark,
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)',
    },
  },
  outline: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: '10px',
    padding: '10px 22px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: COLORS.primary,
      color: COLORS.textLight,
      transform: 'translateY(-2px)',
    },
  },
  danger: {
    backgroundColor: COLORS.error,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: '10px',
    padding: '12px 24px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#DC2626',
      transform: 'translateY(-2px)',
    },
  },
};

export const CARDS = {
  default: {
    backgroundColor: COLORS.white,
    borderRadius: COLORS.borderRadius,
    boxShadow: COLORS.shadow,
    padding: '20px',
    border: COLORS.borderLight,
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: COLORS.shadowHover,
      borderColor: COLORS.primaryLight,
    },
  },
  primary: {
    backgroundColor: COLORS.white,
    borderRadius: COLORS.borderRadius,
    boxShadow: COLORS.shadow,
    padding: '20px',
    borderTop: `4px solid ${COLORS.primary}`,
  },
  secondary: {
    backgroundColor: COLORS.white,
    borderRadius: COLORS.borderRadius,
    boxShadow: COLORS.shadow,
    padding: '20px',
    borderTop: `4px solid ${COLORS.secondary}`,
  },
};

export const INPUTS = {
  default: {
    border: `2px solid ${COLORS.silverLight}`,
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '16px',
    backgroundColor: COLORS.white,
    color: COLORS.textDark,
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    ':focus': {
      borderColor: COLORS.primary,
      boxShadow: '0 0 0 4px rgba(106, 13, 173, 0.12)',
      outline: 'none',
    },
  },
};

export default {
  COLORS,
  FONTS,
  BUTTONS,
  CARDS,
  INPUTS,
};