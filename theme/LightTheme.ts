import type { ThemeTypes } from '@/types/themeTypes/ThemeType'

const PurpleTheme: ThemeTypes = {
  name: 'PurpleTheme',
  dark: false,
  variables: {
    'border-color': '#eeeeee',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#5D87FF',
    secondary: '#49BEFF',
    info: '#539BFF',
    success: '#13DEB9',
    accent: '#FFAB91',
    warning: '#FFAE1F',
    error: '#FA896B',
    muted: '#5a6a85',
    lightprimary: '#ECF2FF',
    lightsecondary: '#E8F7FF',
    lightsuccess: '#E6FFFA',
    lighterror: '#FDEDE8',
    lightwarning: '#FEF5E5',
    textPrimary: '#2A3547',
    textSecondary: '#2A3547',
    borderColor: '#e5eaef',
    inputBorder: '#000',
    containerBg: '#ffffff',
    hoverColor: '#f6f9fc',
    surface: '#fff',
    'on-surface-variant': '#fff',
    grey100: '#F2F6FA',
    grey200: '#EAEFF4'
  }
}
const YellowTheme: ThemeTypes = {
  name: 'YellowTheme',
  dark: false,
  variables: {
    'border-color': '#eeeeee',
    'carousel-control-size': 10
  },
  colors: {
    primary: '#ffb400',
    secondary: '#8a8d93',
    info: '#16b1ff',
    success: '#56ca00',
    accent: '#FFEA33',
    warning: '#ffb400',
    error: '#ff4c51',
    muted: '#5a6a85',
    lightprimary: '#ECF2FF',
    darkprimary: '#F39F3A',
    lightsecondary: '#E8F7FF',
    lightsuccess: '#E6FFFA',
    lighterror: '#FDEDE8',
    lightwarning: '#FEF5E5',
    textPrimary: '#2A3547',
    textSecondary: '#2A3547',
    borderColor: '#e5eaef',
    inputBorder: '#000',
    containerBg: '#ffffff',
    hoverColor: '#f6f9fc',
    surface: '#fff',
    'on-surface-variant': '#eeeeee',
    grey100: '#f0f2f8',
    grey200: '#eeeeee'
  }
}
export { PurpleTheme, YellowTheme }
