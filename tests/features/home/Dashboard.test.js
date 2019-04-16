import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Dashboard } from 'src/features/home/Dashboard';

describe('home/Dashboard', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: { features: [], featureById: {} },
      actions: {},
    };
    const renderedComponent = shallow(
      <Dashboard {...props} />
    );

    expect(
      renderedComponent.find('.home-home-page').getElement()
    ).to.exist;
  });
});
