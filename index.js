const path = require('path');
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

    constructor(options = {}) {

        // Default options
        this.options = {
            minify: {
                removeAttributeQuotes: true,
                removeComments: true,
                collapseWhitespace: true,
                keepClosingSlash: true,
                minifyCSS: true,
                minifyJS: true,
            },
            template: path.resolve(__dirname, './index.html'),
            outputFilename: undefined,
            data: {}
        };

        // Merge options
        for (var option in options) { this.options[option] = options[option]; }

        // If outputFilename is not available, use template filename instead.
        this.options.outputFilename = this.options.outputFilename || this.options.template.replace(/^.*[\\\/]/, '');
    }

    apply(compiler) {
        compiler.hooks.make.tapAsync(pluginName, (compilation, callback) => {

            // Creating child compiler with params
            const childCompiler = compilation.createChildCompiler(compilerName, {
                filename: this.options.outputFilename
            });

            // Add plugins to make all this work
            new NodeTemplatePlugin(this).apply(childCompiler);
            new NodeTargetPlugin().apply(childCompiler);
            new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
            new SingleEntryPlugin(compiler.context, this.options.template, this.options.outputFilename).apply(childCompiler);
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

            if (compilation.assets[this.options.outputFilename]) {
                var asset = eval(compilation.assets[this.options.outputFilename].source());
                // Delete delete our asset from output
                delete compilation.assets[this.options.outputFilename];

                // Render data
                asset = helper(asset, this.options.data);

                // HTML-minifier
                if (this.options.minify !== false)
                    asset = htmlMinifier.minify(asset, this.options.minify);

                // Return HTML result
                compilation.assets[this.options.outputFilename] = {
                    source() { return asset; },
                    size() { return Buffer.byteLength(asset, 'utf8'); }
                };
            }

            callback();
        });
    }
};