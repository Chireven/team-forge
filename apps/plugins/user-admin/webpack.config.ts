import { composePlugins, withNx } from '@nx/webpack';
import { withReact } from '@nx/react';
import { withModuleFederation } from '@nx/module-federation/webpack';
import { ModuleFederationConfig } from '@nx/module-federation';

import baseConfig from './module-federation.config';

const config: ModuleFederationConfig = {
    ...baseConfig,
};

export default composePlugins(
    withNx(),
    withReact(),
    withModuleFederation(config, { dts: false }),
    (c) => {
        c.output = {
            ...c.output,
            publicPath: 'http://localhost:4201/',
            scriptType: 'text/javascript',
        };
        c.devServer = {
            ...c.devServer,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
        };
        return c;
    }
);
