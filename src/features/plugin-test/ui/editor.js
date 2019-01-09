import React from 'react';
import { RunTestButton } from '../';

export default {
  toolbar: {
    getButtons(file) {
      if (!/\.(test|spec)\.(j|t)sx?/.test(file)) return [];
      const buttons = [];
      buttons.push(
        <RunTestButton file={file} key="plugin-test-run-test-button" />
      );
      return buttons;
    },
  },
};
