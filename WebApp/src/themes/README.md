# Theme System

This directory contains all the theme configurations for the N8N WebApp.

## Structure

```
src/themes/
├── index.js          # Main export file
├── light.js          # Light theme
├── dark.js           # Dark theme
├── blue.js           # Ocean Blue theme
├── green.js          # Forest Green theme
├── purple.js         # Royal Purple theme
├── orange.js         # Sunset Orange theme
└── README.md         # This file
```

## Theme Structure

Each theme file exports a theme object with the following structure:

```javascript
export const themeName = {
  name: 'theme-name',           // Unique identifier
  displayName: 'Theme Name',    // Human-readable name
  colors: {
    primary: '#HEXCODE',        // Primary accent color
    secondary: '#HEXCODE',      // Secondary color
    background: '#HEXCODE',     // Main background
    surface: '#HEXCODE',        // Surface/panel background
    sidebar: '#HEXCODE',        // Sidebar background
    border: '#HEXCODE',         // Border color
    text: {
      primary: '#HEXCODE',      // Primary text color
      secondary: '#HEXCODE',    // Secondary text color
      muted: '#HEXCODE',        // Muted text color
    },
    node: {
      background: '#HEXCODE',   // Node background
      border: '#HEXCODE',       // Node border
      shadow: 'shadow-value',   // Node shadow
    },
    button: {
      primary: '#HEXCODE',      // Primary button color
      secondary: '#HEXCODE',    // Secondary button color
      hover: '#HEXCODE',        // Button hover color
    },
    flow: {
      background: '#HEXCODE',   // Flow canvas background
      grid: '#HEXCODE',         // Grid color
      nodeSelected: '#HEXCODE', // Selected node color
      edge: '#HEXCODE',         // Edge/connection color
    }
  },
  shadows: {
    small: 'shadow-value',      // Small shadow
    medium: 'shadow-value',     // Medium shadow
    large: 'shadow-value',      // Large shadow
  }
};
```

## Adding a New Theme

1. Create a new file `src/themes/your-theme.js`
2. Export a theme object following the structure above
3. Import and add it to `src/themes/index.js`
4. Add CSS variables to `src/index.css` for the new theme

### Example: Adding a Red Theme

```javascript
// src/themes/red.js
export const redTheme = {
  name: 'red',
  displayName: 'Crimson Red',
  colors: {
    primary: '#DC2626',
    secondary: '#6B7280',
    background: '#FEF2F2',
    surface: '#FEE2E2',
    sidebar: '#FECACA',
    border: '#FCA5A5',
    text: {
      primary: '#7F1D1D',
      secondary: '#B91C1C',
      muted: '#DC2626',
    },
    node: {
      background: '#FFFFFF',
      border: '#FCA5A5',
      shadow: '0 1px 3px 0 rgba(220, 38, 38, 0.1)',
    },
    button: {
      primary: '#DC2626',
      secondary: '#6B7280',
      hover: '#B91C1C',
    },
    flow: {
      background: '#FEF2F2',
      grid: '#FEE2E2',
      nodeSelected: '#FECACA',
      edge: '#DC2626',
    }
  },
  shadows: {
    small: '0 1px 2px 0 rgba(220, 38, 38, 0.1)',
    medium: '0 4px 6px -1px rgba(220, 38, 38, 0.15)',
    large: '0 10px 15px -3px rgba(220, 38, 38, 0.15)',
  }
};
```

Then update `src/themes/index.js`:

```javascript
import { redTheme } from './red';

export { redTheme } from './red';

export const themes = {
  // ... existing themes
  red: redTheme,
};
```

And add CSS variables to `src/index.css`:

```css
[data-theme="red"] {
  --bg-primary: #FEF2F2;
  --bg-secondary: #FEE2E2;
  --bg-sidebar: #FECACA;
  --text-primary: #7F1D1D;
  --text-secondary: #B91C1C;
  --text-muted: #DC2626;
  --border-color: #FCA5A5;
  --primary-color: #DC2626;
  --shadow-small: 0 1px 2px 0 rgba(220, 38, 38, 0.1);
  --shadow-medium: 0 4px 6px -1px rgba(220, 38, 38, 0.15);
  --shadow-large: 0 10px 15px -3px rgba(220, 38, 38, 0.15);
}
```

## Usage

Themes are automatically available in the theme selector dropdown. Users can switch between themes, and their preference is saved to localStorage.

## Best Practices

1. **Color Harmony**: Ensure colors work well together and maintain good contrast
2. **Accessibility**: Maintain sufficient contrast ratios for text readability
3. **Consistency**: Follow the established color structure for all themes
4. **Testing**: Test themes in both light and dark environments
5. **Naming**: Use descriptive names that reflect the theme's character 