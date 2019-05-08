import React from 'react';
import { shallow } from 'enzyme';
import { DepsOverviewDiagramView } from '../../../src/features/diagram/GroupedDepsDiagramView';

describe('diagram/DepsOverviewDiagramView', () => {
  it('renders node with correct class name', () => {
    const props = {
      diagram: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DepsOverviewDiagramView {...props} />
    );

    expect(
      renderedComponent.find('.diagram-grouped-deps-diagram-view').length
    ).toBe(1);
  });
});
