const path = require('path');
const webpack = require('webpack');
const DEBUG = process.argv.includes('--release');
// postcss plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const plugins = [
new webpack.optimize.OccurrenceOrderPlugin(),
];

if(DEBUG){
	console.log('###########################\n## Debug mode is enabled ##\n###########################');
} else {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({ compress: { screw_ie8: true, warnings: false } }),
		new webpack.optimize.AggressiveMergingPlugin()
		);
}

module.exports = [
	{
		entry: {
			'js/app':       './src/js/app.js',
		},
		output: {
			path: path.join(__dirname, './docs/'),
			filename: '[name].js'
		},
		module: {
			rules: [
				{
					test: /\.js$|\.tag$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['env']
						}
					}
				}
			]
		},
		resolve: {
			extensions: ['*', '.js']
		},
		plugins: plugins
	},
	{
		entry: {
			'css/style':       './src/sass/style.scss',
		},
		output: {
			path: path.join(__dirname, './docs/'),
			filename: '[name].css'
		},
		module: {
			rules: [
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: [
							{
								loader: 'css-loader?-url!postcss-loader!sass-loader',
								options: {
									url: false,
									minimize: !DEBUG
								}
							},
							"sass-loader"
						]
					})
				}
			]
		},
		plugins: [
			new ExtractTextPlugin({
				filename: '[name].css'
			})
		]
	}
];
