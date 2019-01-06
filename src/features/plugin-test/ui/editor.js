import React from 'react';
import { RunTestButton } from '../';

export default {
  toolbar: {
    getButtons(file) {
      const buttons = [];
      buttons.push(
        <RunTestButton file={file} />
      );
      return buttons;
    },
  },
};
