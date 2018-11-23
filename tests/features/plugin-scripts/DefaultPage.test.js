import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/plugin-scripts/DefaultPage';

describe('plugin-scripts/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginScripts: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.plugin-scripts-default-page').length
    ).toBe(1);
  });
});
