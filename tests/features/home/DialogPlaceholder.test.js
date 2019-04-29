import React from 'react';
import { shallow } from 'enzyme';
import { DialogPlaceholder } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DialogPlaceholder />);
  expect(renderedComponent.find('.home-dialog-placeholder').length).toBe(1);
});
