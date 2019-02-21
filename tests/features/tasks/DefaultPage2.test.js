import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage2 } from '../../../src/features/tasks/DefaultPage';

describe('tasks/DefaultPage2', () => {
  it('renders node with correct class name', () => {
    const props = {
      tasks: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage2 {...props} />
    );

    expect(
      renderedComponent.find('.tasks-default-page').length
    ).toBe(1);
  });
});
