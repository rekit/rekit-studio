import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { GroupedDepsDiagram } from './';

export class GroupedDepsDiagramView extends Component {
  static propTypes = {
    projectData: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getGroups() {
    const prjData = this.props.projectData;
    const byId = id => prjData.elementById[id];
    const groups = Object.values(prjData.elementById)
      .filter(ele => ele.type === 'feature')
      .map(f => {
        return {
          id: f.id,
          children: f.children.reduce((p, c) => [...p, ...(byId(c).children || [])], []),
        };
      });
    return groups;
  }

  render() {
    const data = { groups: this.getGroups(), elementById: this.props.projectData.elementById };
    return <GroupedDepsDiagram data={data} />;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    projectData: state.home.projectData,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupedDepsDiagramView);
