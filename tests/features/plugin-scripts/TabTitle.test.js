import React from 'react';
import { shallow } from 'enzyme';
import { TabTitle } from '../../../src/features/plugin-scripts/TabTitle';

describe('plugin-scripts/TabTitle', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginScripts: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TabTitle {...props} />
    );

    expect(
      renderedComponent.find('.plugin-scripts-tab-title').length
    ).toBe(1);
  });
});
