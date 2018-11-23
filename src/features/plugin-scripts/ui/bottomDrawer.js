import ScriptsManager from '../ScriptsManager';


const bottomDrawer = {
  getPanes() {
    return [
      {
        tab: 'Scripts',
        key: 'scripts',
        order: 5,
        component: ScriptsManager,
      },
    ];
  },
};

export default bottomDrawer;
