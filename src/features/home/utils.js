import plugin from '../../common/plugin';

// Get tab by pathname
export const tabByPathname = pathname => {
  pathname = pathname || document.location.pathname;
  const tabPlugins = plugin.getPlugins('tab.getTab').reverse();

  let tab = null;
  tabPlugins.some(p => {
    tab = p.tab.getTab(pathname);
    return !!tab;
  });
  return tab;
};
