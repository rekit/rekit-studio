import React from 'react';
import { shallow } from 'enzyme';
import { DefaultPage } from '../../../src/features/tasks/DefaultPage';

describe('tasks/DefaultPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      tasks: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <DefaultPage {...props} />
    );

    expect(
      renderedComponent.find('.tasks-default-page').length
    ).toBe(1);
  });
});
