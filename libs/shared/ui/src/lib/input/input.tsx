import React from 'react';
import './input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className, id, ...props }: InputProps) => {
    return (
        <div className={`ui-input-group ${className || ''}`}>
            {label && <label htmlFor={id} className="ui-label">{label}</label>}
            <input id={id} className={`ui-input ${error ? 'ui-input-error' : ''}`} {...props} />
            {error && <span className="ui-error">{error}</span>}
        </div>
    );
};
