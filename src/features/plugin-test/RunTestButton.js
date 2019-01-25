import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Tooltip, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { addTestToList, runTest, selectTest } from './redux/actions';
import { setBottomDrawerVisible, setBottomDrawerTab } from '../home/redux/actions';

export class RunTestButton extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    file: PropTypes.string.isRequired,
    running: PropTypes.bool.isRequired,
  };
  handleRunTest = () => {
    const { file, actions } = this.props;
    actions.addTestToList(file);
    actions.runTest(file);
    actions.selectTest(file);
    actions.setBottomDrawerVisible(true);
    actions.setBottomDrawerTab('test');
  };

  render() {
    const { running } = this.props;
    return (
      <Tooltip
        key="tip-run-test"
        title={running ? 'Some test is running.' : 'Add current test to the test list and run it.'}
      >
        <Button size="small" onClick={this.handleRunTest} disabled={running}>
          <Icon type="caret-right" />
          Run Test
        </Button>
      </Tooltip>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    running: state.pluginTest.running,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      { addTestToList, runTest, setBottomDrawerVisible, setBottomDrawerTab, selectTest },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunTestButton);
