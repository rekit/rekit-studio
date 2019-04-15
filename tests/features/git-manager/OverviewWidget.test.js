import React from 'react';
import { shallow } from 'enzyme';
import { OverviewWidget } from '../../../src/features/git-manager/Overview';

describe('git-manager/OverviewWidget', () => {
  it('renders node with correct class name', () => {
    const props = {
      gitManager: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OverviewWidget {...props} />
    );

    expect(
      renderedComponent.find('.git-manager-overview').length
    ).toBe(1);
  });
});
