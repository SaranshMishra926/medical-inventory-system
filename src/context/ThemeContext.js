import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('meditrack-theme');
    if (savedTheme) {
      return JSON.parse(savedTheme);
    }
    return {
      mode: 'dark',
      accentColor: '#8B5CF6',
      fontFamily: 'Inter',
      density: 'comfortable',
      fontSize: 'medium'
    };
  });

  // Apply theme changes to document
  useEffect(() => {
    // Apply dark/light mode
    document.documentElement.classList.toggle('dark', theme.mode === 'dark');
    
    // Apply accent color via CSS custom properties
    document.documentElement.style.setProperty('--accent-primary', theme.accentColor);
    document.documentElement.style.setProperty('--accent-secondary', adjustColor(theme.accentColor, -20));
    
    // Apply font family
    document.documentElement.style.setProperty('--font-family', theme.fontFamily);
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.setProperty('--font-size', fontSizeMap[theme.fontSize]);
    
    // Apply density
    const densityMap = {
      compact: '0.75rem',
      comfortable: '1rem',
      spacious: '1.25rem'
    };
    document.documentElement.style.setProperty('--spacing-scale', densityMap[theme.density]);
    
    // Save to localStorage
    localStorage.setItem('meditrack-theme', JSON.stringify(theme));
    
    // Force re-render by updating document title (triggers React re-render)
    document.title = `MediTrack - ${theme.mode === 'dark' ? 'Dark' : 'Light'} Mode`;
  }, [theme]);

  const updateTheme = (updates) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    const defaultTheme = {
      mode: 'dark',
      accentColor: '#8B5CF6',
      fontFamily: 'Inter',
      density: 'comfortable',
      fontSize: 'medium'
    };
    setTheme(defaultTheme);
  };

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const value = {
    theme,
    updateTheme,
    resetTheme,
    adjustColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
