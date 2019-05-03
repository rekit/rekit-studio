import React from 'react';
import { shallow } from 'enzyme';
import { GroupedDepsDiagram } from '../../../src/features/diagram/GroupedDepsDiagram';

describe('diagram/GroupedDepsDiagram', () => {
  it('renders node with correct class name', () => {
    const props = {
      diagram: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <GroupedDepsDiagram {...props} />
    );

    expect(
      renderedComponent.find('.diagram-grouped-deps-diagram').length
    ).toBe(1);
  });
});
