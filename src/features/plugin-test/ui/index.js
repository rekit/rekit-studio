import TestPanel from '../TestPanel';
export { default as reducer } from '../redux/reducer';
export const name = 'terminal';

export const bottomDrawer = {
  getPanes() {
    return [
      {
        tab: 'Test',
        key: 'test',
        order: 30,
        component: TestPanel,
      },
    ];
  },
};