import TestPanel from '../TestPanel';
export { default as reducer } from '../redux/reducer';
export const name = 'terminal';

export const bottomDrawer = {
  getPanes() {
    return [
      {
        tab: 'Terminal',
        key: 'terminal',
        order: 30,
        component: TestPanel,
      },
    ];
  },
};
