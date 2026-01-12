export interface ThemeColors {
    background: {
        default: string;
        paper: string;
        sidebar: string;
    };
    text: {
        primary: string;
        secondary: string;
        disabled: string;
        inverse: string;
    };
    primary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };
    secondary: {
        main: string;
        light: string;
        dark: string;
        contrastText: string;
    };
    error: {
        main: string;
    };
    action: {
        hover: string;
        selected: string;
        disabled: string;
    };
    border: string;
}

export const lightTheme: ThemeColors = {
    background: {
        default: '#F4F6F8',
        paper: '#FFFFFF',
        sidebar: '#1E293B', // Slate 800
    },
    text: {
        primary: '#111827', // Gray 900
        secondary: '#6B7280', // Gray 500
        disabled: '#9CA3AF',
        inverse: '#FFFFFF',
    },
    primary: {
        main: '#3B82F6', // Blue 500
        light: '#60A5FA',
        dark: '#2563EB',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#10B981', // Emerald 500
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#EF4444', // Red 500
    },
    action: {
        hover: 'rgba(0, 0, 0, 0.04)',
        selected: 'rgba(0, 0, 0, 0.08)',
        disabled: 'rgba(0, 0, 0, 0.26)',
    },
    border: '#E5E7EB', // Gray 200
};

export const darkTheme: ThemeColors = {
    background: {
        default: '#111827', // Gray 900
        paper: '#1F2937', // Gray 800
        sidebar: '#111827',
    },
    text: {
        primary: '#F9FAFB', // Gray 50
        secondary: '#9CA3AF', // Gray 400
        disabled: '#6B7280',
        inverse: '#111827',
    },
    primary: {
        main: '#3B82F6', // Blue 500
        light: '#60A5FA',
        dark: '#2563EB',
        contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#10B981', // Emerald 500
        light: '#34D399',
        dark: '#059669',
        contrastText: '#FFFFFF',
    },
    error: {
        main: '#F87171', // Red 400
    },
    action: {
        hover: 'rgba(255, 255, 255, 0.08)',
        selected: 'rgba(255, 255, 255, 0.16)',
        disabled: 'rgba(255, 255, 255, 0.3)',
    },
    border: '#374151', // Gray 700
};

export const tokens = {
    spacing: (factor: number) => `${factor * 0.25}rem`, // 1 = 4px (0.25rem)
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
    },
    zIndex: {
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 9999, // Rule 16
    },
};
