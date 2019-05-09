import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from './redux/actions';
import { DepsOverviewDiagram } from './';
import getElementsForDepsDiagram from './selectors/getElementsForDepsDiagram';
import element from '../../common/element';
import plugin from '../../common/plugin';

export class DepsOverviewDiagramView extends Component {
  static propTypes = {
    projectData: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getData() {
    const data = { groups: [], elements: [], elementById: this.props.projectData.elementById };
    plugin.getPlugins('diagram.overview.processData').forEach(p => {
      p.diagram.overview.processData(data);
    });
    if (!data.groups.length && !data.elements.length) {
      data.elements = getElementsForDepsDiagram(data.elementById);
    }
    return data;
  }

  handleNodeClick = eleId => {
    element.show(eleId);
  };

  render() {
    return <DepsOverviewDiagram data={this.getData()} onNodeClick={this.handleNodeClick} />;
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
)(DepsOverviewDiagramView);
