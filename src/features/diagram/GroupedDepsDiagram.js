import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';

export class GroupedDepsDiagram extends Component {
  static propTypes = {
    diagram: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="diagram-grouped-deps-diagram">
        Page Content: diagram/GroupedDepsDiagram
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    diagram: state.diagram,
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
)(GroupedDepsDiagram);
