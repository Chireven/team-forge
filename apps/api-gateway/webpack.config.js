const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

console.log('LOADING CUSTOM WEBPACK CONFIG');

module.exports = {
  externals: {
    argon2: 'commonjs argon2',
  },
  output: {
    path: join(__dirname, '../../dist/apps/api-gateway'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
    }),
  ],
};
