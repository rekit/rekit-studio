import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane/lib/SplitPane';
import Pane from 'react-split-pane/lib/Pane';
import { runScript, stopScript } from './redux/actions';
import { storage } from '../common/utils';
import { ScriptList, OutputView } from './';

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

  // getListWidth() {
  //   return parseInt(storage.local.getItem('pluginScripts.listWidth') || 100, 10) || 100;
  // }

  getSizesState() {
    return storage.local.getItem('layoutSizes') || {};
  }

  handleResizeEnd = (paneId, sizes) => {
    const sizesState = this.getSizesState();
    sizesState[paneId] = sizes;
    storage.local.setItem('layoutSizes', sizesState);
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
    const sizes = this.getSizesState()['plugin-scripts-panel'] || [];
    return (
      <div className="plugin-scripts-scripts-manager">
        <SplitPane onResizeEnd={sizes => this.handleResizeEnd('plugin-scripts-panel', sizes)}>
          <Pane minSize="100px" maxSize="80%" size={sizes[0] || '300px'}>
            <ScriptList
              scripts={this.props.scripts}
              onStart={this.handleStart}
              onStop={this.handleStop}
              onSelect={this.handleSelect}
              running={this.props.running}
              current={this.state.current}
            />
          </Pane>
          <Pane className="output-container" size={sizes[1] || 1}>
            <OutputView type="script" name={this.state.current} />
          </Pane>
        </SplitPane>
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
