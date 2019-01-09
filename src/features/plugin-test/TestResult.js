import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { AnsiViewer } from '../common';

export default class TestResult extends Component {
  static propTypes = {
    result: PropTypes.object,
  };

  static defaultProps = {
    result: null,
  };

  renderRunning() {
    return (
      <div className="no-result">
        <Icon type="loading-3-quarters" spin /> The test is running.
      </div>
    );
  }

  renderNoResult() {
    return <div className="no-result">No tests found in the file, or it has not been run.</div>;
  }

  renderResult(result) {
    if (result.running) return this.renderRunning();
    const assertionResults = result.assertionResults;

    if (!assertionResults.length) {
      return (
        <div className="result-message">
          <AnsiViewer text={result.message} />
        </div>
      );
    }

    const failedNumber = assertionResults.filter(t => t.status === 'failed').length;
    const passedNumber = assertionResults.filter(t => t.status === 'passed').length;

    return (
      <React.Fragment>
        <h2>
          Result:{' '}
          <span className="result-summary">
            {failedNumber > 0 && <span className="error-text">{failedNumber} failed </span>}
            <span className="success-text">{passedNumber} passed</span> {assertionResults.length}{' '}
            total.
          </span>
          <span className="time-spent">
            ({result.endTime - result.startTime}
            ms)
          </span>
        </h2>
        <ul>
          {result.assertionResults.map(res => {
            const passed = res.status === 'passed';
            return (
              <li key={res.title} className={passed ? '' : 'failed'}>
                <Icon type={passed ? 'check' : 'close'} />
                <label>{res.title}</label>
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }

  renderFailed(result) {
    const failed = result.assertionResults.filter(res => res.status === 'failed');
    if (!failed.length) return null;
    return (
      <ul className="failed-list">
        {failed.map(res => {
          return (
            <li key={res.title} className="failed">
              <h3>
                <Icon type="close-circle" theme="filled" />
                <label>{res.title}</label>
              </h3>
              <p>
                {res.failureMessages.map(msg => (
                  <AnsiViewer text={msg} />
                ))}
              </p>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const { result } = this.props;
    return (
      <div className="plugin-test-test-result">
        {result ? this.renderResult(result) : this.renderNoResult()}
        {result && !result.running && this.renderFailed(result)}
      </div>
    );
  }
}
