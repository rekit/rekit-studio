import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class OutputView extends Component {
  static propTypes = {
    tasks: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="tasks-output-view">
        Page Content: tasks/OutputView
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    tasks: state.tasks,
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
)(OutputView);
