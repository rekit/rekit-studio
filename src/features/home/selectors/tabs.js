import { createSelector } from 'reselect';
import plugin from '../../../common/plugin';

const pathnameSelector = state => state.router.location.pathname;
const elementByIdSelector = state => state.home.elementById;
const openTabsSelector = state => state.home.openTabs;

export const tabsSelector = createSelector(
  pathnameSelector,
  elementByIdSelector,
  openTabsSelector,
  (pathname, elementById, openTabs) => {
    if (!elementById) {
      return {};
    }
    let tab;
    plugin
      .getPlugins()
      .reverse()
      .some(p => {
        if (p.tab && p.tab.getTab) {
          tab = p.tab.getTab(pathname);
        }
        return !!tab;
      });

    if (!tab) {
      tab = {
        name: 'Not found',
        key: 'rekit:not-found',
      };
    }
    return { openTabs: [tab] };
  }
);
