import React from 'react';
import { shallow } from 'enzyme';
import { ElementIcon } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ElementIcon />);
  expect(renderedComponent.find('.common-element-icon').length).toBe(1);
});
