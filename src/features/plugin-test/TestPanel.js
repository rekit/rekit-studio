import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class TestPanel extends Component {
  static propTypes = {
    pluginTest: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="plugin-test-test-panel">
        Page Content: test/TestPanel
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    pluginTest: state.pluginTest,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestPanel);
