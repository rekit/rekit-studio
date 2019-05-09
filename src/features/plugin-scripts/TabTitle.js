import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class TabTitle extends Component {
  static propTypes = {
    running: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { running } = this.props;
    const runningCount = Object.keys(running).length;
    return (
      <span className="plugin-scripts-tab-title">
        Scripts{runningCount > 0 ? <span className="running-count">{runningCount}</span> : ''}
      </span>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    running: state.pluginScripts.running,
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
)(TabTitle);
