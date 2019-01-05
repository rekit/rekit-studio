import TestPanel from '../TestPanel';
export { default as reducer } from '../redux/reducer';
export const name = 'terminal';

export default {
  getPanes() {
    return [
      {
        tab: 'Tests',
        key: 'test',
        order: 30,
        component: TestPanel,
      },
    ];
  },
};
