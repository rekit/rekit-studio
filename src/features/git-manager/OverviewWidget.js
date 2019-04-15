import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class OverviewWidget extends Component {
  static propTypes = {
    gitManager: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="git-manager-overview-widget">
        <h3>Git Status</h3>
        <div className="widget-container">
          <div>Last commit: Nate Wang (6 April, 2019)</div>
          <p>Bug fixes.</p>
          <h6>Modified files</h6>
          <ul>
            <li>package.json</li>
            <li>src/features/home/HomePage.js</li>
            <li>src/features/home/HomePage.less</li>
            <li>src/common/rootReducer.js</li>
            <li>src/common/routeConfig.js</li>
          </ul>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    gitManager: state.gitManager,
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
)(OverviewWidget);
