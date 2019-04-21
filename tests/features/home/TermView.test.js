import React from 'react';
import { shallow } from 'enzyme';
import { TermView } from '../../../src/features/home/TermView';

describe('home/TermView', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TermView {...props} />
    );

    expect(
      renderedComponent.find('.home-term-view').length
    ).toBe(1);
  });
});
