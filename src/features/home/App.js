import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import enUS from 'antd/lib/locale-provider/en_US';
import { Alert, LocaleProvider, message, Modal, Spin } from 'antd';
import SplitPane from 'rspv2/lib/SplitPane';
import Pane from 'rspv2/lib/Pane';
import { ErrorBoundary } from '../common';
import { storage } from '../common/utils';
import { BottomDrawer, TabsBar, SidePanel, QuickOpen } from './';
import { DialogContainer } from '../core';
import { fetchProjectData } from './redux/actions';
import plugin from '../../common/plugin';

/*
  This is the root component of your app. Here you define the overall layout
  and the container of the react router. The default one is a two columns layout.
  You should adjust it acording to the type of your app.
*/

export class App extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    elementById: PropTypes.object,
    openTabs: PropTypes.array,
    projectDataNeedReload: PropTypes.bool.isRequired,
    fetchProjectDataError: PropTypes.any,
    fetchProjectDataPending: PropTypes.bool.isRequired,
    bottomDrawerVisible: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    elementById: null,
    fetchProjectDataError: null,
    openTabs: [],
  };

  componentDidMount() {
    this.props.actions
      .fetchProjectData()
      .then(data => {
        document.title = this.props.projectName;
        if (_.get(data, 'config.appType') !== 'rekit-react') {
          // This is a very special check because rekit-react is a built-in plugin
          // It should be removed from UI side when app type is not rekit-react.
          plugin.removePlugin('rekit-react');
        }
        // For rendering tabs bar
        this.props.dispatch({
          type: '@@router/LOCATION_CHANGE',
          payload: this.props.location,
        });
      })
      .catch(err => {
        Modal.error({
          title: 'Failed to load project data',
          content: err && (err.message || err.toString()),
        });
      });
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.projectDataNeedReload &&
      !prevProps.projectDataNeedReload &&
      !this.props.fetchProjectDataError &&
      !this.props.fetchProjectDataPending
    ) {
      this.props.actions.fetchProjectData().catch(e => {
        console.log('failed to fetch project data: ', e);
        message.error('Failed to refresh project data');
      });
    }
  }

  getSizesState() {
    return storage.local.getItem('layoutSizes') || {};
  }

  handleResize = () => {
    window.dispatchEvent(new window.Event('resize'));
  };

  handleResizeEnd = (paneId, sizes) => {
    const sizesState = this.getSizesState();
    sizesState[paneId] = sizes;
    storage.local.setItem('layoutSizes', sizesState);
  };

  renderLoading() {
    return (
      <div className="home-app loading">
        <Spin />
        <span style={{ marginLeft: 20 }}>Loading...</span>
      </div>
    );
  }

  render() {
    if (!this.props.projectName) {
      return this.renderLoading();
    }

    if (!this.props.elementById) {
      return (
        <div className="home-app-no-data">
          <Alert
            message="Project type not supported."
            description="It seems not any Rekit plugin installed to support current app type, please check and retry."
            type="error"
            showIcon
          />
        </div>
      );
    }

    const { bottomDrawerVisible } = this.props;

    const sizes = this.getSizesState();
    const mainVerticalSizes = sizes['main-vertical'] || [];
    const rightHorizontalSizes = sizes['right-horizontal'] || [];
    return (
      <LocaleProvider locale={enUS}>
        <div className="home-app">
          <SplitPane
            split="vertical"
            onChange={this.handleResize}
            onResizeEnd={sizes => this.handleResizeEnd('main-vertical', sizes)}
          >
            <Pane minSize="50px" maxSize="60%" size={mainVerticalSizes[0] || '300px'}>
              <SidePanel />
            </Pane>
            <Pane className="right-pane" size={mainVerticalSizes[1] || 1}>
              <TabsBar />

              <SplitPane
                className="right-split-pane"
                split="horizontal"
                onChange={this.handleResize}
                onResizeEnd={sizes => this.handleResizeEnd('right-horizontal', sizes)}
              >
                <Pane size={rightHorizontalSizes[0] || 1}>{this.props.children}</Pane>
                {bottomDrawerVisible && (
                  <Pane size={rightHorizontalSizes[1] || '280px'} minSize="60px" maxSize="80%">
                    <BottomDrawer />
                  </Pane>
                )}
              </SplitPane>
              {!bottomDrawerVisible && (
                <div className="right-bottom-bar">
                  <BottomDrawer />
                </div>
              )}
            </Pane>
          </SplitPane>
          <DialogContainer />
          <QuickOpen />
        </div>
      </LocaleProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    ..._.pick(state.home, [
      'sidePanelWidth',
      'projectName',
      'elementById',
      'features',
      'openTabs',
      'projectDataNeedReload',
      'fetchProjectDataError',
      'fetchProjectDataPending',
      'bottomDrawerVisible',
    ]),
    // router: state.router,
    // location: state.router.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ fetchProjectData }, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
