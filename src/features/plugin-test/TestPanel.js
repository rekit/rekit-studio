import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane/lib/SplitPane';
import Pane from 'react-split-pane/lib/Pane';
import { Button, Icon } from 'antd';
import { storage } from '../common/utils';
import {
  listAllTest,
  clearTestList,
  selectTest,
  removeTestFromList,
  runTest,
} from './redux/actions';
import { TestList } from './';
import { TestResult } from './';

export class TestPanel extends Component {
  static propTypes = {
    pluginTest: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getSizesState() {
    return storage.local.getItem('layoutSizes') || {};
  }

  getTests() {
    const { testList, testResult } = this.props.pluginTest;
    return testList.map(s => ({ name: s, result: testResult[s] }));
  }

  handleResizeEnd = (paneId, sizes) => {
    const sizesState = this.getSizesState();
    sizesState[paneId] = sizes;
    storage.local.setItem('layoutSizes', sizesState);
  };

  handleRunAll = () => {
    const { elementById, actions } = this.props;
    actions.listAllTest(elementById);
    actions.runTest();
  };

  handleRunList = () => {
    const { pluginTest, actions } = this.props;
    actions.runTest(pluginTest.testList);
  };
  handleRunFailed = () => {
    const { pluginTest, actions } = this.props;
    const { testList, testResult } = pluginTest;
    actions.runTest(testList.filter(t => testResult[t] && testResult[t].status === 'failed'));
  };

  renderToolbar() {
    const { running, testResult } = this.props.pluginTest;
    const tests = this.getTests();
    if (running) {
      const runningNumber = tests.filter(t => testResult[t.name] && testResult[t.name].running)
        .length;
      return (
        <div className="test-panel-toolbar tests-running">
          <Icon type="loading-3-quarters" spin /> Running {runningNumber} test{' '}
          {runningNumber > 0 ? 'files' : 'file'}
          ...
        </div>
      );
    }
    const failedNumber = tests.filter(
      t => testResult[t.name] && testResult[t.name].status === 'failed'
    ).length;
    const passedNumber = tests.filter(
      t => testResult[t.name] && testResult[t.name].status === 'passed'
    ).length;
    return (
      <div className="test-panel-toolbar">
        <Button
          icon="caret-right"
          ghost
          size="small"
          title="Run all tests in the project."
          className="btn-run-all"
          onClick={this.handleRunAll}
        >
          Run all
        </Button>
        <Button
          icon="caret-right"
          ghost
          size="small"
          className="btn-run-list"
          title="Run all tests in below list."
          onClick={this.handleRunList}
        >
          Run list
        </Button>
        {failedNumber > 0 && (
          <Button
            icon="caret-right"
            ghost
            size="small"
            className="btn-run-failed"
            title="Run tests failed during last run."
            onClick={this.handleRunFailed}
          >
            Run failed ({failedNumber})
          </Button>
        )}
        <Button
          icon="close"
          ghost
          size="small"
          className="btn-clear-list"
          title="Clear tests in the list."
          onClick={this.props.actions.clearTestList}
        >
          Clear list
        </Button>
        {tests.length > 0 && (
          <span className="result-summary">
            {failedNumber > 0 && <span className="error-text">{failedNumber} failed </span>}
            <span className="success-text">{passedNumber} passed</span> {tests.length} total.
          </span>
        )}
      </div>
    );
  }
  render() {
    const sizes = this.getSizesState()['plugin-test-panel'] || [];

    const tests = this.getTests();
    const { currentTest, testResult } = this.props.pluginTest;
    return (
      <div className="plugin-test-test-panel">
        {this.renderToolbar()}
        <SplitPane
          onResizeEnd={sizes => this.handleResizeEnd('plugin-test-panel', sizes)}
          className="split-pane"
        >
          <Pane minSize="100px" maxSize="80%" size={sizes[0] || '300px'}>
            <TestList
              current={this.props.pluginTest.currentTest}
              removeTestFromList={this.props.actions.removeTestFromList}
              tests={tests}
              status={{}}
              selectTest={this.props.actions.selectTest}
              runTest={this.props.actions.runTest}
            />
          </Pane>
          <Pane className="output-container" size={sizes[1] || 1}>
            <TestResult result={testResult[currentTest] || null} />
          </Pane>
        </SplitPane>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    pluginTest: state.pluginTest,
    elementById: state.home.elementById,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { listAllTest, clearTestList, removeTestFromList, runTest, selectTest },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestPanel);
