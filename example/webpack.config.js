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
            new RefineWebpackPlugin({
                template: './example/views/index.html',
                data: {
                    name: 'Alice'
                }
            }),
            new RefineWebpackPlugin({
                template: './example/views/second.html'
            })
        ]
    }
}