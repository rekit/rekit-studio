import React from 'react';
import { shallow } from 'enzyme';
import { OutputView } from '../../../src/features/plugin-scripts/OutputView';

describe('plugin-scripts/OutputView', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginScripts: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OutputView {...props} />
    );

    expect(
      renderedComponent.find('.plugin-scripts-output-view').length
    ).toBe(1);
  });
});
