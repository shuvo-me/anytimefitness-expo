import { vars } from 'nativewind';

// Raw color values - update these and they sync everywhere
export const colors = {
  light: {
    '--primary': '200 241 53', // lime #C8F135
    '--primary-foreground': '0 0 0',
    '--card': '20 20 24', // card #141418
    '--card-foreground': '255 255 255',
    '--secondary': '30 30 38', // border-subtle #1E1E26
    '--secondary-foreground': '255 255 255',
    '--background': '12 12 15', // background #0C0C0F
    '--popover': '20 20 24', // card #141418
    '--popover-foreground': '255 255 255',
    '--muted': '30 30 38', // border-subtle #1E1E26
    '--muted-foreground': '138 138 154', // text-muted #8A8A9A
    '--destructive': '255 75 31', // alert-red #FF4B1F
    '--destructive-foreground': '255 255 255',
    '--foreground': '255 255 255',
    '--border': '30 30 38', // border-subtle #1E1E26
    '--input': '30 30 38', // border-subtle #1E1E26
    '--ring': '200 241 53', // lime #C8F135
    '--accent': '42 42 52', // subtle hover surface
    '--accent-foreground': '255 255 255',
  },
  dark: {
    '--primary': '200 241 53', // lime #C8F135
    '--primary-foreground': '0 0 0',
    '--card': '20 20 24', // card #141418
    '--card-foreground': '255 255 255',
    '--secondary': '30 30 38', // border-subtle #1E1E26
    '--secondary-foreground': '255 255 255',
    '--background': '12 12 15', // background #0C0C0F
    '--popover': '20 20 24', // card #141418
    '--popover-foreground': '255 255 255',
    '--muted': '30 30 38', // border-subtle #1E1E26
    '--muted-foreground': '138 138 154', // text-muted #8A8A9A
    '--destructive': '255 75 31', // alert-red #FF4B1F
    '--destructive-foreground': '255 255 255',
    '--foreground': '255 255 255',
    '--border': '30 30 38', // border-subtle #1E1E26
    '--input': '30 30 38', // border-subtle #1E1E26
    '--ring': '200 241 53', // lime #C8F135
    '--accent': '42 42 52', // subtle hover surface
    '--accent-foreground': '255 255 255',
  },
};

// Config for nativewind vars() - used by provider
export const config = {
  light: vars(colors.light),
  dark: vars(colors.dark),
};