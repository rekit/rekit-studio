import React from 'react';
import { shallow } from 'enzyme';
import { ${ele.name} } from '../../../src/features/${_.kebabCase(ele.feature)}';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<${ele.name} />);
  expect(renderedComponent.find('.${_.kebabCase(ele.feature)}-${_.kebabCase(ele.name)}').length).toBe(1);
});
