import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'antd';

export default class GlobalErrorBox extends Component {
  static propTypes = {
    buttonText: PropTypes.string,
    buttonCallback: PropTypes.func,
    message: PropTypes.string,
    description: PropTypes.string,
  };

  static defaultProps = {
    message: 'Fatal Error',
    description: 'Something went rong.',
    buttonText: null,
    buttonCallback() {},
  };

  renderDescription() {
    const { buttonText, buttonCallback, description } = this.props;
    const btn = buttonText ? (
      <Button type="ghost" onClick={buttonCallback}>
        {buttonText}
      </Button>
    ) : null;
    return (
      <div>
        <p>{description}</p>
        {btn}
      </div>
    );
  }
  render() {
    return (
      <div className="common-global-error-box">
        <Alert message={this.props.message} type="error" description={this.renderDescription()} />
      </div>
    );
  }
}
