import React from 'react';
import { shallow } from 'enzyme';
import { PtyOutput } from '../../../src/features/pty/PtyOutput';

describe('pty/PtyOutput', () => {
  it('renders node with correct class name', () => {
    const props = {
      pty: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <PtyOutput {...props} />
    );

    expect(
      renderedComponent.find('.pty-pty-output').length
    ).toBe(1);
  });
});
