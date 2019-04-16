import React from 'react';
import { shallow } from 'enzyme';
import { DiagramWidget } from '../../../src/features/diagram';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DiagramWidget />);
  expect(renderedComponent.find('.diagram-diagram-widget').length).toBe(1);
});
