import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeColors, lightTheme, darkTheme, tokens } from './tokens';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
    tokens: typeof tokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        return (localStorage.getItem('theme-mode') as ThemeMode) || 'light';
    });

    const toggleTheme = () => {
        setMode((prev) => {
            const newMode = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme-mode', newMode);
            return newMode;
        });
    };

    useEffect(() => {
        const root = document.documentElement;
        const theme = mode === 'light' ? lightTheme : darkTheme;

        // Inject CSS Variables dynamically
        Object.entries(flatObject(theme)).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value as string);
        });

        // Also inject some base styles for body background/color
        root.style.backgroundColor = theme.background.default;
        root.style.color = theme.text.primary;

    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, tokens }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Helper: Flattens object to create CSS var keys (e.g., text-primary)
function flatObject(obj: any, prefix = ''): Record<string, string> {
    return Object.keys(obj).reduce((acc: any, k) => {
        const pre = prefix.length ? prefix + '-' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flatObject(obj[k], pre + k));
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}
