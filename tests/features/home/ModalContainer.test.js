import React from 'react';
import { shallow } from 'enzyme';
import { ModalContainer } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ModalContainer />);
  expect(renderedComponent.find('.home-dialog-placeholder').length).toBe(1);
});
