import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { clearOutput } from './redux/actions';
import { OutputView as HomeOutputView } from '../home/OutputView';

export class OutputView extends Component {
  static propTypes = {
    pluginScripts: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    output: PropTypes.array.isRequired,
  };

  clearOutput = () => {
    this.props.actions.clearOutput(this.props.name);
  };

  render() {
    const output = (this.props.output[this.props.name] || []).map((s, i) => ({ key: i, text: s }));
    const actions = { clearOutput: this.clearOutput };
    return <HomeOutputView output={output} actions={actions} type={`script-${this.props.name}`} />;
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    output: state.pluginScripts.output,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ clearOutput }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OutputView);
