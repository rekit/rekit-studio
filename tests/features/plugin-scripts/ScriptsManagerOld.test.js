import React from 'react';
import { shallow } from 'enzyme';
import { ScriptsManagerOld } from '../../../src/features/plugin-scripts';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ScriptsManagerOld />);
  expect(renderedComponent.find('.plugin-scripts-scripts-manager-old').length).toBe(1);
});
