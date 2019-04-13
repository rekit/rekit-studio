import React from 'react';
import { shallow } from 'enzyme';
import { TabsBar2Js } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TabsBar2Js />);
  expect(renderedComponent.find('.home-tabs-bar-2-js').length).toBe(1);
});
