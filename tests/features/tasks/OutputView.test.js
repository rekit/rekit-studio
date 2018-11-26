import React from 'react';
import { shallow } from 'enzyme';
import { OutputView } from '../../../src/features/tasks/OutputView';

describe('tasks/OutputView', () => {
  it('renders node with correct class name', () => {
    const props = {
      tasks: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <OutputView {...props} />
    );

    expect(
      renderedComponent.find('.tasks-output-view').length
    ).toBe(1);
  });
});
