import React from 'react';
import { shallow } from 'enzyme';
import { ConfirmDeleteScript } from '../../../src/features/plugin-scripts/ConfirmDeleteScript';

describe('plugin-scripts/ConfirmDeleteScript', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginScripts: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ConfirmDeleteScript {...props} />
    );

    expect(
      renderedComponent.find('.plugin-scripts-confirm-delete-script').length
    ).toBe(1);
  });
});
