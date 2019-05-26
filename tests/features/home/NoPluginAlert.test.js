import React from 'react';
import { shallow } from 'enzyme';
import { NoPluginAlert } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<NoPluginAlert />);
  expect(renderedComponent.find('.home-no-plugin-alert').length).toBe(1);
});
