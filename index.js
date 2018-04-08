const path = require('path');
const sass = require('node-sass');
const helper = require('./helper');
const htmlMinifier = require('html-minifier');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const LoaderTargetPlugin = require('webpack/lib/LoaderTargetPlugin');
const NodeTemplatePlugin = require('webpack/lib/node/NodeTemplatePlugin');
const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');

const pluginName = 'RefineWebpack';
const resolveName = 'RefineResolve';
const compilerName = 'RefineCompiler';

module.exports = class RefineWebpackPlugin {

    /**
     * Constructor
     * @param {String|Object} options Pass options for plugins. If you pass a string. It will be set to input filename automaticly.
     */
    constructor(options) {
        // Detect if options just only file input
        if (typeof options === 'string')
            options = { input: options }

        // Merge with default options
        this.options = Object.assign({
            type: undefined,
            sassOptions: {},
            htmlOptions: {
                removeComments: true,
                collapseWhitespace: true,
                keepClosingSlash: true,
                minifyCSS: true,
                minifyJS: true,
            },
            data: {},
            input: path.resolve(__dirname, './index.html'),
            output: undefined,
        }, options);

        // Get input file extension
        this.extension = this.options.type || this.options.input.split('.').pop();

        // Mapping output file extension
        var extMap = {
            htm: 'html',
            html: 'html',
            scss: 'css',
            sacc: 'css'
        }

        // If output is not set, use input instead.
        this.options.output = this.options.filename || this.options.input.split('/').pop().split('.')[0] + '.' + extMap[this.extension];
    }

    apply(compiler) {
        compiler.hooks.make.tapAsync(pluginName, (compilation, callback) => {

            // Creating child compiler with params
            const childCompiler = compilation.createChildCompiler(compilerName, {
                filename: this.options.output
            });

            // Add plugins to make all this work
            new NodeTemplatePlugin(this).apply(childCompiler);
            new NodeTargetPlugin().apply(childCompiler);
            new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
            new SingleEntryPlugin(compiler.context, this.options.input, this.options.output).apply(childCompiler);
            new LoaderTargetPlugin('node').apply(childCompiler);

            // Add refine loader in child compiler
            childCompiler.hooks.normalModuleFactory.tap(compilerName, (normalModuleFactory) => {
                normalModuleFactory.hooks.afterResolve.tapAsync(pluginName, (result, callback) => {
                    result.loaders.push(
                        path.resolve(__dirname, './loader.js')
                    );
                    callback(null, result);
                });
            });

            // Needed for HMR. Even if your plugin don't support HMR,
            // this code seems to be always needed just in case to prevent possible errors
            childCompiler.hooks.compilation.tap(compilerName, (compilation) => {
                if (compilation.cache) {
                    if (!compilation.cache[compilerName]) {
                        compilation.cache[compilerName] = {};
                    }
                    compilation.cache = compilation.cache[compilerName];
                }
            });

            // Run child compilation
            childCompiler.runAsChild(callback);
        });

        compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {

            if (compilation.assets[this.options.output]) {
                // Evaluate source to get real content
                var asset = eval(compilation.assets[this.options.output].source());
                // Delete delete our asset from output
                delete compilation.assets[this.options.output];

                // Return result in callback
                var output = asset => {
                    compilation.assets[this.options.output] = {
                        source() { return asset; },
                        size() { return Buffer.byteLength(asset, 'utf8'); }
                    };
                    callback();
                }

                switch (this.extension) {

                    // Handle HTML content
                    case 'htm':
                    case 'html':
                        // Render data
                        asset = helper(asset, this.options.data);

                        // HTML-minifier
                        if (this.options.htmlOptions !== false)
                            asset = htmlMinifier.minify(asset, this.options.htmlOptions);

                        output(asset);
                        break;

                    // Handle SCSS/SASS content
                    case 'sass':
                    case 'scss':
                        // Set content will be handled by node-sass
                        this.options.sassOptions.data = asset;
                        sass.render(this.options.sassOptions, (err, result) => {
                            if (result) output(result.css); else output('');
                        });
                        break;
                }
            }
        });
    }
};