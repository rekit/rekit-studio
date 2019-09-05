import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import SplitPane from 'rspv2/lib/SplitPane';
import Pane from 'rspv2/lib/Pane';
import { useRunScript, useStopScript, useSetCurrent } from './redux/hooks';
import { storage } from '../common/utils';
import { ScriptList } from './';
import { PtyOutput } from '../pty';
import { useClearOutput } from '../pty/redux/hooks';

function ScriptsManager() {
  const sizesState = storage.local.getItem('layoutSizes') || {};
  const sizes = sizesState['plugin-scripts-panel'] || [];
  const { running, runScript } = useRunScript();
  const { stopScript } = useStopScript();
  const { current = 'start', setCurrent } = useSetCurrent();
  const { clearOutput } = useClearOutput();
  const scripts = useSelector(state => state.pluginScripts.scripts);

  const handleStart = useCallback(
    name => {
      clearOutput(`run_script_${name}`);
      runScript(name);
    },
    [runScript, clearOutput],
  );

  const handleResizeEnd = (sizes) => {
    sizesState['plugin-scripts-panel'] = sizes;
    storage.local.setItem('layoutSizes', sizesState);
    window.dispatchEvent(new window.Event('resize'));
  };

  return (
    <div className="plugin-scripts-scripts-manager">
      <SplitPane onResizeEnd={handleResizeEnd}>
        <Pane minSize="100px" maxSize="80%" size={sizes[0] || '300px'}>
          <ScriptList
            scripts={scripts}
            onStart={handleStart}
            onStop={stopScript}
            onSelect={setCurrent}
            running={running}
            current={current}
          />
        </Pane>
        <Pane
          className={classnames('output-container', {
            'not-running': !running[current],
          })}
          size={sizes[1] || 1}
        >
          <PtyOutput id={`run_script_${current}`} />
        </Pane>
      </SplitPane>
    </div>
  );
}

export default ScriptsManager;

// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import classnames from 'classnames';
// import SplitPane from 'rspv2/lib/SplitPane';
// import Pane from 'rspv2/lib/Pane';
// import { runScript, stopScript, setCurrent } from './redux/actions';
// import { storage } from '../common/utils';
// import { ScriptList } from './';
// import { PtyOutput } from '../pty';
// import { clearOutput } from '../pty/redux/actions';

// export class ScriptsManager extends Component {
//   static propTypes = {
//     scripts: PropTypes.array.isRequired,
//     running: PropTypes.object.isRequired,
//     actions: PropTypes.object.isRequired,
//     current: PropTypes.string,
//   };

//   static defaultProps = {
//     current: 'start',
//   };

//   getSizesState() {
//     return storage.local.getItem('layoutSizes') || {};
//   }

//   handleResizeEnd = (paneId, sizes) => {
//     const sizesState = this.getSizesState();
//     sizesState[paneId] = sizes;
//     storage.local.setItem('layoutSizes', sizesState);
//     window.dispatchEvent(new window.Event('resize'));
//   };

//   handleStart = name => {
//     this.props.actions.clearOutput(`run_script_${name}`);
//     this.props.actions.runScript(name);
//   };
//   handleStop = name => {
//     this.props.actions.stopScript(name);
//   };
//   handleSelect = name => {
//     this.props.actions.setCurrent(name);
//   };

//   handleOnload = term => {
//     window.term = term;
//     this.term = term;
//   };

//   render() {
//     const sizes = this.getSizesState()['plugin-scripts-panel'] || [];
//     return (
//       <div className="plugin-scripts-scripts-manager">
//         <SplitPane onResizeEnd={sizes => this.handleResizeEnd('plugin-scripts-panel', sizes)}>
//           <Pane minSize="100px" maxSize="80%" size={sizes[0] || '300px'}>
//             <ScriptList
//               scripts={this.props.scripts}
//               onStart={this.handleStart}
//               onStop={this.handleStop}
//               onSelect={this.handleSelect}
//               running={this.props.running}
//               current={this.props.current}
//             />
//           </Pane>
//           <Pane
//             className={classnames('output-container', {
//               'not-running': !this.props.running[this.props.current],
//             })}
//             size={sizes[1] || 1}
//           >
//             <PtyOutput id={`run_script_${this.props.current}`} />
//           </Pane>
//         </SplitPane>
//       </div>
//     );
//   }
// }

// /* istanbul ignore next */
// function mapStateToProps(state) {
//   return {
//     scripts: state.pluginScripts.scripts,
//     running: state.pluginScripts.running,
//     current: state.pluginScripts.current,
//   };
// }

// /* istanbul ignore next */
// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators({ runScript, stopScript, setCurrent, clearOutput }, dispatch),
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(ScriptsManager);
