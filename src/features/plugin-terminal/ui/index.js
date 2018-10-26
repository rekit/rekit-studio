import WebTerminal from '../WebTerminal';
export { default as reducer } from '../redux/reducer';
export { default as route } from '../route';

export const bottomDrawer = {
  getPanes() {
    return [
      {
        tab: 'Terminal',
        key: 'terminal',
        order: 20,
        component: WebTerminal,
      },
    ];
  },
};
