import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = uuidv4();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-dismiss logic (Rule 16)
        // Success/Info auto-dismiss. Error/Warning persist (unless user dismisses).
        // Simplifying: Success = 3s. Others = 5s. Errors = manual?
        // Rule says: Success/Info auto-dismiss. Error/Warning MUST persist.

        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                removeToast(id);
            }, 5000); // 5 seconds
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999, // Rule 16 The God Layer
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {toasts.map((t) => (
                    <div key={t.id} style={{
                        minWidth: '300px',
                        padding: '16px',
                        borderRadius: '6px',
                        backgroundColor: t.type === 'error' ? 'var(--error-main)' : 'var(--background-paper)',
                        color: t.type === 'error' ? 'white' : 'var(--text-primary)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderLeft: `4px solid ${t.type === 'success' ? 'var(--secondary-main)' :
                                t.type === 'warning' ? '#F59E0B' :
                                    t.type === 'error' ? 'white' : 'var(--primary-main)'
                            }`
                    }}>
                        <span>{t.message}</span>
                        <button
                            onClick={() => removeToast(t.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                marginLeft: '12px',
                                opacity: 0.7
                            }}
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
