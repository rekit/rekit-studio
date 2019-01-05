import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import Convert from 'ansi-to-html';
const convert = new Convert();

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
    return <div className="no-result">The test has not been run.</div>;
  }

  renderResult(result) {
    if (result.running) return this.renderRunning();
    return (
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
    );
  }

  renderFailed(result) {
    const failed = result.assertionResults.filter(res => res.status === 'failed');
    if (!failed.length) return null;
    return (
      <ul className="failed-list">
        {failed.map(res => {
          console.log(res);
          return (
            <li key={res.title} className="failed">
              <h3>
                <Icon type="close-circle" theme="filled" />
                <label>{res.title}</label>
              </h3>
              <p>
                {res.failureMessages.map(msg => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: convert
                        .toHtml(
                          msg
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/ /g, '&nbsp;')
                            .replace(/\n/g, '<br />')
                        )
                        .replace('#00A', '#1565C0')
                        .replace(/color:#555/g, 'color:#777'),
                    }}
                  />
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
