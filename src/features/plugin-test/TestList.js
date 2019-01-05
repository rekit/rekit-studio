import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'antd';
import { SvgIcon } from '../common';

export default class TestList extends Component {
  static propTypes = {
    tests: PropTypes.array.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    status: PropTypes.object,
    current: PropTypes.string,
  };

  renderNoTest() {
    return <div className="no-tests">No tests choosed.</div>;
  }

  renderTestItem = test => {
    const status = this.props.status[test.name];
    return (
      <li
        key={test.name}
        onClick={() => this.props.onSelect(test.name)}
        className={this.props.current === test.name ? 'selected' : ''}
      >
        <Icon type="check" />
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
