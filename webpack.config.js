const path = require('path');

module.exports = {
    mode: 'development',
    // entry: glob.sync('./js/**/*.js'),
    entry: './js/src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch: true,
}
