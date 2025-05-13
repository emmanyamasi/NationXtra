import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#6200EE',
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#000000',
    border: '#E0E0E0',
    notification: '#FF0000',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#BB86FC',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#FF5555',
  },
};

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);