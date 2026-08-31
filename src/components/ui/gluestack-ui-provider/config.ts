import { vars } from 'nativewind';

// Raw color values - update these and they sync everywhere
export const colors = {
  light: {
    '--primary': '#C8F135',
    '--primary-foreground': '#000000',
    '--card': '#141418',
    '--card-foreground': '#FFFFFF',
    '--secondary': '#1E1E26',
    '--secondary-foreground': '#FFFFFF',
    '--background': '#0C0C0F',
    '--popover': '#141418',
    '--popover-foreground': '#FFFFFF',
    '--muted': '#1E1E26',
    '--muted-foreground': '#8A8A9A',
    '--destructive': '#FF4B1F',
    '--destructive-foreground': '#FFFFFF',
    '--foreground': '#FFFFFF',
    '--border': '#1E1E26',
    '--input': '#252532',
    '--ring': '#C8F135',
    '--accent': '#2A2A34',
    '--accent-foreground': '#FFFFFF',
  },
  dark: {
    '--primary': '#C8F135',
    '--primary-foreground': '#000000',
    '--card': '#141418',
    '--card-foreground': '#FFFFFF',
    '--secondary': '#1E1E26',
    '--secondary-foreground': '#FFFFFF',
    '--background': '#0C0C0F',
    '--popover': '#141418',
    '--popover-foreground': '#FFFFFF',
    '--muted': '#1E1E26',
    '--muted-foreground': '#8A8A9A',
    '--destructive': '#FF4B1F',
    '--destructive-foreground': '#FFFFFF',
    '--foreground': '#FFFFFF',
    '--border': '#1E1E26',
    '--input': '#252532',
    '--ring': '#C8F135',
    '--accent': '#2A2A34',
    '--accent-foreground': '#FFFFFF',
  },
};

// Config for nativewind vars() - used by provider
export const config = {
  light: vars(colors.light),
  dark: vars(colors.dark),
};