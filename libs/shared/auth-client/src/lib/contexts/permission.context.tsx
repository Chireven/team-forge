import React, { createContext, useContext, ReactNode } from 'react';

interface PermissionContextType {
    permissions: string[];
    isSuperAdmin: boolean;
    hasPermission: (permission: string) => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

// TODO: Connect this to the actual User Profile/JWT
const mockUser = {
    permissions: [] as string[],
    isSuperAdmin: false
};

export const PermissionProvider = ({ children, user = mockUser }: { children: ReactNode, user?: { permissions: string[], isSuperAdmin: boolean } }) => {

    const hasPermission = (permission: string) => {
        if (user.isSuperAdmin) return true;
        return user.permissions.includes(permission);
    };

    return (
        <PermissionContext.Provider value={{ permissions: user.permissions, isSuperAdmin: user.isSuperAdmin, hasPermission }}>
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermission must be used within a PermissionProvider');
    }
    return context;
};
