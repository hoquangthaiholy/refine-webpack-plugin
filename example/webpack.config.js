const path = require('path')
const RefineWebpackPlugin = require('../index');

module.exports = env => {
    return {
        mode: env,
        entry: './example/app.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'app.js'
        },
        plugins: [
            new RefineWebpackPlugin('./example/views/index.html'),
            new RefineWebpackPlugin({
                input: './example/views/second.html',
                data: {
                    name: 'John'
                }
            }),
            new RefineWebpackPlugin({
                input: './example/scss/app.scss'
            })
        ]
    }
}