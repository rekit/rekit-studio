import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import enUS from 'antd/lib/locale-provider/en_US';
import { Alert, LocaleProvider, message, Modal, Spin } from 'antd';
import SplitPane from 'rspv2/lib/SplitPane';
import Pane from 'rspv2/lib/Pane';
import { hot } from 'react-hot-loader/root';

import { storage } from '../common/utils';
import { BottomDrawer, TabsBar, SidePanel, QuickOpen } from './';
import { DialogContainer } from '../core';
import { ModalContainer, NoPluginAlert } from './';
import { fetchProjectData } from './redux/actions';

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
    config: PropTypes.object,
    openTabs: PropTypes.array,
    projectDataNeedReload: PropTypes.bool.isRequired,
    fatalError: PropTypes.any,
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

  state = {
    missingPlugin: false,
  };

  componentDidMount() {
    this.props.actions.fetchProjectData({ initial: true }).then(data => {
      document.title = this.props.projectName;
    });
    if (window.__REKIT_NO_PLUGIN_FOR_APP_TYPE) {
      Modal.error({
        title: 'Plugin Missing: ' + window.__REKIT_NO_PLUGIN_FOR_APP_TYPE,
        className: 'home-app_no-plugin-alert',
        content: <NoPluginAlert plugin={window.__REKIT_NO_PLUGIN_FOR_APP_TYPE} />,
      });
      this.setState({ missingPlugin: window.__REKIT_NO_PLUGIN_FOR_APP_TYPE });
      window.__REKIT_NO_PLUGIN_FOR_APP_TYPE = false;
    }
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
    return <div className="home-app loading" />;
    // return (
    //   <div className="home-app loading">
    //     <Spin />
    //     <span style={{ marginLeft: 20 }}>Loading...</span>
    //   </div>
    // );
  }

  renderFatalError() {
    return (
      <div className="home-app fatal-error">
        <Alert
          type="error"
          message="Fatal Error"
          description={
            <div>
              <div>{this.props.fatalError}</div>
              <p>You may need to restart Rekit Studio.</p>
            </div>
          }
        />
      </div>
    );
  }

  render() {
    if (this.props.fatalError) {
      return this.renderFatalError();
    }
    if (!this.props.projectName) {
      return this.renderLoading();
    }
    console.log('redn333333er');
    if (window.ON_REKIT_STUDIO_LOAD) {
      window.ON_REKIT_STUDIO_LOAD(); // hide global loading mask
    }

    // if (!this.props.elementById) {
    //   // This seemes to not reached?
    //   return (
    //     <div className="home-app not-supported">
    //       <Alert
    //         message="Error: Application Type Not Supported"
    //         description={
    //           <span>
    //             It seems there's not any Rekit plugin installed to support the current application
    //             type:{' '}
    //             <span style={{ textDecoration: 'underline' }}>{this.props.config.appType}</span>.
    //             Please check and retry.
    //           </span>
    //         }
    //         type="error"
    //         showIcon
    //       />
    //     </div>
    //   );
    // }

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
          <ModalContainer />
          <QuickOpen />
          {this.state.missingPlugin && (
            <NoPluginAlert
              plugin={this.state.missingPlugin}
              onOk={() => this.setState({ missingPlugin: false })}
            />
          )}
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
      'config',
      'fatalError',
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

export default hot(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(App),
);
