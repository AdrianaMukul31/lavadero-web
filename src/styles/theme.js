// src/styles/theme.js

// ==========================================
// SISTEMA DE ESPACIADO
// ==========================================
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
};

// ==========================================
// SISTEMA DE SOMBRAS
// ==========================================
export const SHADOWS = {
  xs: '0 1px 3px rgba(0,0,0,0.06)',
  sm: '0 2px 8px rgba(0,0,0,0.08)',
  md: '0 4px 20px rgba(106, 13, 173, 0.15)',
  lg: '0 8px 40px rgba(106, 13, 173, 0.25)',
  xl: '0 20px 60px rgba(106, 13, 173, 0.3)',
  glass: '0 8px 32px rgba(0,0,0,0.08)',
  glow: '0 0 30px rgba(106, 13, 173, 0.2)',
};

// ==========================================
// COLORES DE LA MARCA
// ==========================================
export const COLORS = {
  // Colores principales
  primary: '#6A0DAD',
  primaryDark: '#4A0A7A',
  primaryLight: '#8B5CF6',
  primaryGradient: 'linear-gradient(135deg, #6A0DAD 0%, #4A0A7A 100%)',
  primaryGradientLight: 'linear-gradient(135deg, #8B5CF6 0%, #6A0DAD 100%)',

  secondary: '#22C55E',
  secondaryDark: '#15803D',
  secondaryLight: '#86EFAC',
  secondaryGradient: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',

  silver: '#C0C0C0',
  silverLight: '#E5E7EB',
  silverDark: '#9CA3AF',

  // Colores de texto
  textLight: '#FFFFFF',
  textDark: '#1F2937',
  textGray: '#6B7280',
  textSilver: '#9CA3AF',
  textMuted: '#9CA3AF',

  // Colores de fondo
  background: '#F3F4F6',
  backgroundDark: '#E5E7EB',
  backgroundGradient: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
  white: '#FFFFFF',
  transparent: 'transparent',

  // Colores de estado
  success: '#22C55E',
  successLight: '#86EFAC',
  successDark: '#15803D',
  warning: '#F59E0B',
  warningLight: '#FCD34D',
  warningDark: '#B45309',
  error: '#EF4444',
  errorLight: '#FCA5A5',
  errorDark: '#B91C1C',
  info: '#3B82F6',
  infoLight: '#93C5FD',
  infoDark: '#1D4ED8',

  // Colores de glassmorphism
  glassBg: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.3)',
  glassBgDark: 'rgba(0, 0, 0, 0.2)',
  glassBorderDark: 'rgba(0, 0, 0, 0.1)',
};

// ==========================================
// SISTEMA DE BORDES
// ==========================================
export const BORDERS = {
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '24px',
    full: '9999px',
  },
  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px',
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    none: 'none',
  },
};

// ==========================================
// TIPOGRAFÍA
// ==========================================
export const FONTS = {
  // Títulos
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: COLORS.primary,
    letterSpacing: '0.5px',
    lineHeight: 1.2,
  },
  titleSmall: {
    fontSize: '20px',
    fontWeight: 700,
    color: COLORS.primary,
    letterSpacing: '0.3px',
    lineHeight: 1.3,
  },
  titleLarge: {
    fontSize: '32px',
    fontWeight: 800,
    color: COLORS.primary,
    letterSpacing: '1px',
    lineHeight: 1.1,
  },

  // Subtítulos
  subtitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: COLORS.textDark,
    lineHeight: 1.4,
  },
  subtitleSmall: {
    fontSize: '16px',
    fontWeight: 600,
    color: COLORS.textDark,
    lineHeight: 1.4,
  },
  subtitleLarge: {
    fontSize: '22px',
    fontWeight: 700,
    color: COLORS.textDark,
    lineHeight: 1.3,
  },

  // Cuerpo
  body: {
    fontSize: '16px',
    fontWeight: 400,
    color: COLORS.textDark,
    lineHeight: 1.6,
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.textDark,
    lineHeight: 1.5,
  },
  bodyLarge: {
    fontSize: '18px',
    fontWeight: 400,
    color: COLORS.textDark,
    lineHeight: 1.6,
  },

  // Textos pequeños
  small: {
    fontSize: '14px',
    fontWeight: 400,
    color: COLORS.textGray,
    lineHeight: 1.5,
  },
  tiny: {
    fontSize: '12px',
    fontWeight: 400,
    color: COLORS.textSilver,
    lineHeight: 1.4,
  },

  // Especiales
  hero: {
    fontSize: '48px',
    fontWeight: 800,
    color: COLORS.primary,
    letterSpacing: '2px',
    lineHeight: 1.1,
  },
  caption: {
    fontSize: '13px',
    fontWeight: 400,
    color: COLORS.textGray,
    lineHeight: 1.4,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textDark,
    lineHeight: 1.4,
    letterSpacing: '0.3px',
  },
};

// ==========================================
// BOTONES (mejorados y expandidos)
// ==========================================
export const BUTTONS = {
  // Tamaños
  sizes: {
    small: {
      padding: `${SPACING.sm} ${SPACING.md}`,
      fontSize: '14px',
      borderRadius: BORDERS.radius.md,
    },
    medium: {
      padding: `${SPACING.md} ${SPACING.lg}`,
      fontSize: '16px',
      borderRadius: BORDERS.radius.lg,
    },
    large: {
      padding: `${SPACING.lg} ${SPACING.xl}`,
      fontSize: '18px',
      borderRadius: BORDERS.radius.xl,
    },
  },

  // Variantes
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: BORDERS.radius.lg,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: SHADOWS.md,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    fontSize: '16px',
    letterSpacing: '0.3px',
    '&:hover': {
      backgroundColor: COLORS.primaryDark,
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.lg,
    },
    '&:active': {
      transform: 'translateY(0px)',
      boxShadow: SHADOWS.sm,
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: BORDERS.radius.lg,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    fontSize: '16px',
    letterSpacing: '0.3px',
    '&:hover': {
      backgroundColor: COLORS.secondaryDark,
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(34, 197, 94, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  outline: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
    border: `2px solid ${COLORS.primary}`,
    borderRadius: BORDERS.radius.lg,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    fontSize: '16px',
    letterSpacing: '0.3px',
    '&:hover': {
      backgroundColor: COLORS.primary,
      color: COLORS.textLight,
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.md,
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  danger: {
    backgroundColor: COLORS.error,
    color: COLORS.textLight,
    border: 'none',
    borderRadius: BORDERS.radius.lg,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    fontSize: '16px',
    letterSpacing: '0.3px',
    '&:hover': {
      backgroundColor: COLORS.errorDark,
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    color: COLORS.textLight,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: BORDERS.radius.lg,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    fontSize: '16px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.glass,
    },
    '&:active': {
      transform: 'translateY(0px)',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
};

// ==========================================
// TARJETAS (expandidas)
// ==========================================
export const CARDS = {
  default: {
    backgroundColor: COLORS.white,
    borderRadius: BORDERS.radius.md,
    boxShadow: SHADOWS.md,
    padding: SPACING.lg,
    border: `1px solid ${COLORS.silverLight}`,
    transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: SHADOWS.lg,
      borderColor: COLORS.primaryLight,
    },
  },
  primary: {
    backgroundColor: COLORS.white,
    borderRadius: BORDERS.radius.md,
    boxShadow: SHADOWS.md,
    padding: SPACING.lg,
    borderTop: `4px solid ${COLORS.primary}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: SHADOWS.lg,
    },
  },
  secondary: {
    backgroundColor: COLORS.white,
    borderRadius: BORDERS.radius.md,
    boxShadow: SHADOWS.md,
    padding: SPACING.lg,
    borderTop: `4px solid ${COLORS.secondary}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: SHADOWS.lg,
    },
  },
  glass: {
    backgroundColor: COLORS.glassBg,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: BORDERS.radius.lg,
    boxShadow: SHADOWS.glass,
    padding: SPACING.xl,
    border: `1px solid ${COLORS.glassBorder}`,
    transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: SHADOWS.lg,
      borderColor: 'rgba(255,255,255,0.5)',
    },
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: BORDERS.radius.md,
    padding: SPACING.lg,
    border: `2px solid ${COLORS.silverLight}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: COLORS.primary,
      boxShadow: SHADOWS.md,
    },
  },
  flat: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: SPACING.md,
    border: 'none',
    boxShadow: 'none',
  },
};

// ==========================================
// INPUTS (mejorados)
// ==========================================
export const INPUTS = {
  default: {
    border: `2px solid ${COLORS.silverLight}`,
    borderRadius: BORDERS.radius.md,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontSize: '16px',
    backgroundColor: COLORS.white,
    color: COLORS.textDark,
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: COLORS.primary,
      boxShadow: '0 0 0 4px rgba(106, 13, 173, 0.10)',
      outline: 'none',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      backgroundColor: COLORS.silverLight,
    },
    '&::placeholder': {
      color: COLORS.textSilver,
    },
  },
  error: {
    border: `2px solid ${COLORS.error}`,
    borderRadius: BORDERS.radius.md,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontSize: '16px',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    color: COLORS.textDark,
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: COLORS.error,
      boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.10)',
      outline: 'none',
    },
  },
  success: {
    border: `2px solid ${COLORS.success}`,
    borderRadius: BORDERS.radius.md,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontSize: '16px',
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    color: COLORS.textDark,
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: COLORS.success,
      boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.10)',
      outline: 'none',
    },
  },
  glass: {
    border: `1px solid ${COLORS.glassBorder}`,
    borderRadius: BORDERS.radius.md,
    padding: `${SPACING.md} ${SPACING.lg}`,
    fontSize: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(4px)',
    color: COLORS.textDark,
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
    '&:focus': {
      borderColor: COLORS.primary,
      boxShadow: '0 0 0 4px rgba(106, 13, 173, 0.10)',
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
};

// ==========================================
// EXPORTACIÓN PRINCIPAL
// ==========================================
const theme = {
  COLORS,
  FONTS,
  BUTTONS,
  CARDS,
  INPUTS,
  SPACING,
  SHADOWS,
  BORDERS,
};

export default theme;