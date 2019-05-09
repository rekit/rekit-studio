import plugin from './plugin';

let icons;
export default type => {
  if (!icons) {
    icons = plugin.getPlugins('icons').reduce((prev, curr) => {
      Object.assign(prev, curr.icons);
      return prev;
    }, {});
  }
  return icons[type] || 'file';
};
