const path = require('path');
const webpack = require('webpack');
const wextManifest = require('wext-manifest');
const ZipPlugin = require('zip-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteWebpackPlugin = require('write-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtensionReloader = require('webpack-extension-reloader');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

const manifestInput = require('./src/manifest');

const viewsPath = path.join(__dirname, 'views');
const sourcePath = path.join(__dirname, 'src');
const destPath = path.join(__dirname, 'extension');
const nodeEnv = process.env.NODE_ENV || 'development';
const targetBrowser = process.env.TARGET_BROWSER;
const manifest = wextManifest[targetBrowser](manifestInput);

const extensionReloaderPlugin =
    nodeEnv === 'development'
        ? new ExtensionReloader({
              port: 9090,
              reloadPage: true,
              entries: {
                  // TODO: reload manifest on update
                  contentScript: 'contentScript',
                  background: 'background',
                  extensionPage: ['popup', 'options'],
              },
          })
        : () => {
              this.apply = () => {};
          };

const getExtensionFileType = browser => {
    if (browser === 'opera') {
        return 'crx';
    }

    if (browser === 'firefox') {
        return 'xpi';
    }

    return 'zip';
};

module.exports = {
    mode: nodeEnv,

    entry: {
        background: path.join(sourcePath, 'Background', 'index.ts'),
        contentScript: path.join(sourcePath, 'ContentScript', 'index.ts'),
        popup: './src/scripts/popup.js',
        options: './src/scripts/options.js',
        styles: [path.join(sourcePath, 'Popup', 'popup.scss'), path.join(sourcePath, 'Options', 'options.scss')],
    },

    output: {
        filename: 'js/[name].bundle.js',
        path: path.join(destPath, targetBrowser),
    },

    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)?$/,
                loader: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            context: './src/styles/',
                            outputPath: 'css/',
                        },
                    },
                    'extract-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            // eslint-disable-next-line global-require
                            plugins: [require('autoprefixer')()],
                        },
                    },
                    'resolve-url-loader',
                    'sass-loader',
                ],
            },
        ],
    },

    plugins: [
        new webpack.ProgressPlugin(),
        // for awesome-typescript-loader
        new CheckerPlugin(),
        // https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/518
        new FixStyleOnlyEntriesPlugin({ silent: true }),
        new webpack.EnvironmentPlugin(['NODE_ENV', 'TARGET_BROWSER']),
        // delete previous build files
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.join(process.cwd(), `extension/${targetBrowser}`),
                path.join(process.cwd(), `extension/${targetBrowser}.${getExtensionFileType(targetBrowser)}`),
            ],
            cleanStaleWebpackAssets: false,
            verbose: true,
        }),
        new HtmlWebpackPlugin({
            template: path.join(viewsPath, 'popup.html'),
            inject: 'body',
            chunks: ['popup'],
            filename: 'popup.html',
        }),
        new HtmlWebpackPlugin({
            template: path.join(viewsPath, 'options.html'),
            inject: 'body',
            chunks: ['options'],
            filename: 'options.html',
        }),
        // copy assets
        new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
        // write manifest.json
        new WriteWebpackPlugin([{ name: manifest.name, data: Buffer.from(manifest.content) }]),
        // plugin to enable browser reloading in development mode
        extensionReloaderPlugin,
    ],

    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
            }),
            new ZipPlugin({
                path: destPath,
                extension: `${getExtensionFileType(targetBrowser)}`,
                filename: `${targetBrowser}`,
            }),
        ],
    },
};
