import React from 'react';
import TabTitle from '../TabTitle';
import ScriptsManager from '../ScriptsManager';


const bottomDrawer = {
  getPanes() {
    return [
      {
        title: <TabTitle />,
        key: 'scripts',
        order: 5,
        component: ScriptsManager,
      },
    ];
  },
};

export default bottomDrawer;
