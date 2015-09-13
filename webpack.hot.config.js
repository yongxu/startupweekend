var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var appRoot = path.join(__dirname, 'app');
var npmRoot = path.join(__dirname, 'node_modules');
var assetRoot = path.join(__dirname, 'assets');
var srcRoot = path.join(appRoot, 'src');
var scssRoot = path.join(appRoot, 'scss');


module.exports = {
  cache: true,
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    './app/src/app.jsx'
  ],
  output: {
    path: path.resolve('./build'),
    filename: 'bundle.js',
    publicPath: 'http://0.0.0.0:3000/build/'
  },
  resolve: {
  	extensions: ["",".js",".jsx"],
    alias:{
      "react": __dirname + '/node_modules/react',
      "react/addons": __dirname + '/node_modules/react/addons',
      'fonts': path.join(assetRoot,'fonts'),
      'images': path.join(assetRoot,'images'),
      'svgs': path.join(assetRoot,'svgs'),
      'styles': path.join(appRoot,'scss'),
      'mui': path.join(npmRoot,'material-ui/src')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      _: 'lodash'
    }),

//    new ExtractTextPlugin('styles.css')
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['react-hot', 'babel-loader?stage=0&optional=runtime'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'autoprefixer?browsers=last 2 versions']
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer?browsers=last 2 versions',
          "sass?outputStyle=expanded&" +
          "includePaths[]=" + npmRoot + "&" +
          "includePaths[]=" + scssRoot
        ]
      },
//      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader',
//            'css-loader?sourceMap!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'url-loader'
        ]
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
  }
};
