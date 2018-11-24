import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { runScript, stopScript } from './redux/actions';
import { ScriptList } from './';
import { OutputView } from './';

// const scripts = [
//   { name: 'start', script: 'node scripts/start.js' },
//   { name: 'build', script: 'node scripts/start.js' },
//   { name: 'test2', script: 'node scripts/start.js' },
//   { name: 'serveBuild', script: 'node scripts/start.js' },
//   { name: 'docs:build', script: 'node scripts/start.js' },
//   { name: 'publish', script: 'node scripts/start.js' },
// ];
export class ScriptsManager extends Component {
  static propTypes = {
    scripts: PropTypes.object.isRequired,
    running: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  // constructor(props) {
  //   super(props);
  // }

  state = {
    current: 'start',
  };

  handleStart = name => {
    console.log('start script', name);
    this.props.actions.runScript(name);
  };
  handleStop = name => {
    this.props.actions.stopScript(name);
  };
  handleSelect = name => {
    this.setState({ current: name });
  };

  handleOnload = term => {
    window.term = term;
    this.term = term;
  };

  render() {

    return (
      <div className="plugin-scripts-scripts-manager">
        <ScriptList
          scripts={this.props.scripts}
          onStart={this.handleStart}
          onStop={this.handleStop}
          onSelect={this.handleSelect}
          running={this.props.running}
          current={this.state.current}
        />
        <div className="output-container">
          <OutputView type="script" name={this.state.current} />
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    scripts: state.pluginScripts.scripts,
    running: state.pluginScripts.running,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ runScript, stopScript }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScriptsManager);
