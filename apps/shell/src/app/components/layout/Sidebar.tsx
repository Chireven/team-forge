import React from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigation, NavItem } from '@team-forge/shared/utils';
import { useTheme } from '@team-forge/shared/ui';

export const Sidebar = () => {
    const { items } = useNavigation();
    const { tokens } = useTheme();

    const groupedItems = items.reduce((acc, item) => {
        const section = item.section || 'main';
        if (!acc[section]) acc[section] = [];
        acc[section].push(item);
        return acc;
    }, {} as Record<string, NavItem[]>);

    const styleLink = ({ isActive }: { isActive: boolean }) => ({
        display: 'block',
        padding: `${tokens.spacing(3)} ${tokens.spacing(4)}`,
        color: isActive ? 'var(--primary-light)' : 'var(--text-secondary)',
        borderLeft: isActive ? `3px solid var(--primary-main)` : '3px solid transparent',
        textDecoration: 'none',
        backgroundColor: isActive ? 'var(--action-selected)' : 'transparent',
        transition: 'all 0.2s',
    });

    return (
        <aside style={{
            width: '260px',
            height: '100vh',
            backgroundColor: 'var(--background-sidebar)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <div style={{ padding: tokens.spacing(6), borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ margin: 0, color: 'var(--text-inverse)' }}>Team Forge</h2>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto', paddingTop: tokens.spacing(4) }}>
                {Object.entries(groupedItems).map(([section, sectionItems]) => (
                    <div key={section} style={{ marginBottom: tokens.spacing(6) }}>
                        <div style={{
                            padding: `0 ${tokens.spacing(4)}`,
                            marginBottom: tokens.spacing(2),
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            color: 'var(--text-disabled)',
                            fontWeight: 600
                        }}>
                            {section}
                        </div>
                        {sectionItems.map((item) => (
                            <NavLink key={item.id} to={item.path} style={styleLink}>
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
};
