import React from 'react';
import { shallow } from 'enzyme';
import { DepsOverviewDiagram } from '../../../src/features/diagram/GroupedDepsDiagram';

describe('diagram/DepsOverviewDiagram', () => {
  it('renders node with correct class name', () => {
    const props = {
      diagram: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DepsOverviewDiagram {...props} />
    );

    expect(
      renderedComponent.find('.diagram-grouped-deps-diagram').length
    ).toBe(1);
  });
});
