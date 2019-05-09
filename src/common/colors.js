import plugin from './plugin';

let colors = {};
export default (type, light) => {
  if (!colors) {
    colors = plugin.getPlugins('colors').reduce((prev, curr) => {
      Object.assign(prev, curr.colors);
      return prev;
    }, {});
  }

  return colors[type] || colors.file || '#888';
};
