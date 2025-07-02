import { lightTheme } from './light';
import { darkTheme } from './dark';
import { blueTheme } from './blue';
import { greenTheme } from './green';
import { purpleTheme } from './purple';
import { orangeTheme } from './orange';
import { slateTheme } from './slate';
import { roseTheme } from './rose';
import { tealTheme } from './teal';
import { indigoTheme } from './indigo';
import { amberTheme } from './amber';

// Export individual themes
export { lightTheme } from './light';
export { darkTheme } from './dark';
export { blueTheme } from './blue';
export { greenTheme } from './green';
export { purpleTheme } from './purple';
export { orangeTheme } from './orange';
export { slateTheme } from './slate';
export { roseTheme } from './rose';
export { tealTheme } from './teal';
export { indigoTheme } from './indigo';
export { amberTheme } from './amber';

// Export all themes as an object
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  blue: blueTheme,
  green: greenTheme,
  purple: purpleTheme,
  orange: orangeTheme,
  slate: slateTheme,
  rose: roseTheme,
  teal: tealTheme,
  indigo: indigoTheme,
  amber: amberTheme,
};

// Export theme names for easy access
export const themeNames = {
  LIGHT: 'light',
  DARK: 'dark',
  BLUE: 'blue',
  GREEN: 'green',
  PURPLE: 'purple',
  ORANGE: 'orange',
  SLATE: 'slate',
  ROSE: 'rose',
  TEAL: 'teal',
  INDIGO: 'indigo',
  AMBER: 'amber',
};

// Export default theme
export const defaultTheme = darkTheme; 