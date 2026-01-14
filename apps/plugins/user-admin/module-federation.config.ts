import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
    name: 'user_admin',
    exposes: {
        './Module': './src/remote-entry.ts',
    },
    shared: (name, config) => {
        // React Core: Strict Singletons
        if (['react', 'react-dom'].includes(name)) {
            return { singleton: true, strictVersion: true, requiredVersion: false };
        }

        // Router & Axios: Strict Singletons
        if (['react-router-dom', 'axios'].includes(name)) {
            return { singleton: true, strictVersion: true, requiredVersion: false };
        }

        // Shared Workspace Libs: Loose Singletons (Local libs)
        if (name.startsWith('@team-forge/shared/')) {
            return { singleton: true, strictVersion: false, requiredVersion: false };
        }

        return config;
    }
};

export default config;
