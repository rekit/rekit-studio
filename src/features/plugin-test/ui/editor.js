import React from 'react';
import { Tooltip, Button, Icon } from 'antd';
import { addTestToList, runTest } from '../redux/actions';
import store from '../../../common/store';

function handleRunTest(file) {
  store.dispatch(addTestToList(file));
  store.dispatch(runTest(file));
}

export default {
  toolbar: {
    getButtons(file) {
      const buttons = [];
      buttons.push(
        <Tooltip
          key="tip-run-test"
          title={<label>Add current test to the test list and run it.</label>}
        >
          <Button size="small" onClick={() => handleRunTest(file)}>
            <Icon type="caret-right" />
            Run Test
          </Button>
        </Tooltip>
      );
      return buttons;
    },
  },
};
