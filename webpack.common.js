const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

    entry: {
  
        main: './src/index.js',
  
    },
    plugins: [

        new HtmlWebpackPlugin({
            template: "./src/template.html",
        }),
    
    ],
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.html$/i,
            loader: "html-loader",
          },
          {
            test: /\.(png|jpg|webp|svg|gif|jpeg)$/i,
            type: "asset/resource",
          }
        ]
      },
    output: {

        filename: '[name].js',
    
        path: path.resolve(__dirname, 'dist'),
    
        clean: true,
    
    },
    
}  