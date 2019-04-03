module.exports = function(api) {
  const presets = ['react-app'];
  const plugins = [];
  if (api.env('development')) {
    plugins.push('react-hot-loader/babel', '@babel/plugin-syntax-dynamic-import');
  }
  plugins.push('lodash');
  return { presets, plugins };
};
// "babel": {
//   "presets": [
//     "react-app"
//   ],
//   "plugins": [
//     "react-hot-loader/babel",
//     "@babel/plugin-syntax-dynamic-import",
//     "lodash"
//   ]
// },
