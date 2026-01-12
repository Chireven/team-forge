import React, { ReactNode } from 'react';
import { usePermission } from '../contexts/permission.context';

interface RestrictedProps {
    to: string; // The permission ID required (e.g., 'task.delete')
    children: ReactNode;
    fallback?: ReactNode;
}

export const Restricted = ({ to, children, fallback = null }: RestrictedProps) => {
    const { hasPermission } = usePermission();

    if (hasPermission(to)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
