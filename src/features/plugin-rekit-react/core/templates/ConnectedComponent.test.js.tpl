import React from 'react';
import { shallow } from 'enzyme';
import { ${ele.name} } from '../../../src/features/${ele.feature}/${ele.name}';

describe('${ele.feature}/${ele.name}', () => {
  it('renders node with correct class name', () => {
    const props = {
      ${_.camelCase(ele.feature)}: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <${ele.name} {...props} />
    );

    expect(
      renderedComponent.find('.${_.kebabCase(ele.feature)}-${_.kebabCase(ele.name)}').length
    ).toBe(1);
  });
});
