import React from 'react';
import { shallow } from 'enzyme';
import { OtherFileElement } from '../../../src/features/home/OtherFileElement';

describe('home/OtherFileElement', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OtherFileElement {...props} />
    );

    expect(
      renderedComponent.find('.home-other-file-element').length
    ).toBe(1);
  });
});
