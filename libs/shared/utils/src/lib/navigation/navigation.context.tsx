import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface NavItem {
    id: string;
    label: string;
    path: string;
    icon?: string;
    permission?: string;
    section: 'main' | 'settings' | 'user';
    order?: number;
}

interface NavigationContextType {
    items: NavItem[];
    registerNavItem: (item: NavItem) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Singleton registry to allow registration before React mounts (optional, but good for plugins)
const globalRegistry: NavItem[] = [];

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<NavItem[]>(globalRegistry);

    const registerNavItem = (item: NavItem) => {
        // Prevent duplicates
        if (globalRegistry.some((i) => i.id === item.id)) return;

        globalRegistry.push(item);
        // Sort by order/label
        globalRegistry.sort((a, b) => (a.order || 99) - (b.order || 99));

        // Update local state
        setItems([...globalRegistry]);
    };

    return (
        <NavigationContext.Provider value={{ items, registerNavItem }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

// Also export a helper for plugins to access outside strict context if needed
export const registerGlobalNavItem = (item: NavItem) => {
    if (globalRegistry.some((i) => i.id === item.id)) return;
    globalRegistry.push(item);
    // Note: State update won't happen until Provider re-renders or mounts
};
