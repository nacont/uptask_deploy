// PARA PODER ACCEDER AL FILESYSTEM
const path = require('path');
// IMPORTAMOS WEBPACK
const webpack = require('webpack');

module.exports = {
    // PUNTO DE ENTRADA
    entry: './public/js/app.js',
    // PUNTO DE SALIDA
    output: {
        // CREA UN bundle.js
        filename: 'bundle.js',
        // EN LA CARPETA
        path: path.join(__dirname, './public/dist')
    },
    module: {
        rules: [
            {
                // BUSCA TODOS LOS JS
                test: /\.m?js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}
