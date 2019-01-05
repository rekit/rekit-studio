import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import { SvgIcon } from '../common';
import classnames from 'classnames';

export default class TestList extends Component {
  static propTypes = {
    tests: PropTypes.array.isRequired,
    runTest: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    status: PropTypes.object,
    current: PropTypes.string,
  };

  handleRunTest(name, evt) {
    evt.stopPropagation();
    this.props.runTest(name);
  }
  renderNoTest() {
    return <div className="no-tests">No tests choosed.</div>;
  }

  renderTestItem = test => {
    const passed = test.result && test.result.status === 'passed';
    const running = test.result && test.result.running;
    return (
      <li
        key={test.name}
        onClick={() => this.props.onSelect(test.name)}
        className={classnames(
          { selected: this.props.current === test.name, running },
          `test-${test.status}`
        )}
      >
        {running ? (
          <Icon type="loading-3-quarters" spin />
        ) : (
          <Icon type={passed ? 'check' : 'close'} />
        )}
        <label title={test.name}>{test.name}</label>
        <span className="hover-buttons">
          <Button ghost icon="file" className="icon-btn" size="small" title="Open test file" />
          <Button ghost icon="close" className="icon-btn" size="small" title="Remove from list" />
          <Button
            ghost
            icon="caret-right"
            className="icon-btn btn-run"
            size="small"
            title="Run the test"
            onClick={evt => this.handleRunTest(test.name, evt)}
          />
        </span>
      </li>
    );
  };
  render() {
    const { tests } = this.props;
    return (
      <div className="plugin-test-test-list">
        {tests.length ? <ul>{this.props.tests.map(this.renderTestItem)}</ul> : this.renderNoTest()}
      </div>
    );
  }
}
