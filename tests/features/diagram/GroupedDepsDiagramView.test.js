import React from 'react';
import { shallow } from 'enzyme';
import { GroupedDepsDiagramView } from '../../../src/features/diagram/GroupedDepsDiagramView';

describe('diagram/GroupedDepsDiagramView', () => {
  it('renders node with correct class name', () => {
    const props = {
      diagram: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <GroupedDepsDiagramView {...props} />
    );

    expect(
      renderedComponent.find('.diagram-grouped-deps-diagram-view').length
    ).toBe(1);
  });
});
