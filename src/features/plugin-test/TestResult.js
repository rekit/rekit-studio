import React, { Component } from 'react';
import { Icon } from 'antd';

export default class TestResult extends Component {
  static propTypes = {};

  renderNoResult() {
    return <div className="no-result">The test has not been run.</div>;
  }

  renderResult() {
    return (
      <ul>
        {[1, 2, 3, 4, 5].map(i => (
          <li key={i} className={i === 3 ? 'failed' : ''}>
            <Icon type={i === 3 ? 'close' : 'check'} />
            <label>handles action type correctly. <span className="time-spent"> (10ms)</span></label>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return <div className="plugin-test-test-result">{this.renderResult()}</div>;
  }
}
