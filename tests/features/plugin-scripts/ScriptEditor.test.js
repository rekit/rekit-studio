import React from 'react';
import { shallow } from 'enzyme';
import { ScriptEditor } from '../../../src/features/plugin-scripts/ScriptEditor';

describe('plugin-scripts/ScriptEditor', () => {
  it('renders node with correct class name', () => {
    const props = {
      pluginScripts: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ScriptEditor {...props} />
    );

    expect(
      renderedComponent.find('.plugin-scripts-script-editor').length
    ).toBe(1);
  });
});
