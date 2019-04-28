import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Icon, Dropdown, Menu, Modal } from 'antd';
import scrollIntoView from 'dom-scroll-into-view';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import history from '../../common/history';
import { SvgIcon } from '../common';
import { closeTab, stickTab, moveTab, setTempTab, removePaths } from './redux/actions';
import { tabsSelector } from './selectors/tabs';
import editorStateMap from '../editor/editorStateMap';
import modelManager from '../editor/modelManager';
import { tabByPathname } from './utils';

const getListStyle = () => ({
  display: 'flex',
  padding: 0,
  overflow: 'auto',
});

const getTabPaths = tab => _.uniq([tab.urlPath, ...(tab.subTabs || []).map(t => t.urlPath)]);

// TabsBar is just UI reflection of URL history of Rekit Studio.
export class TabsBar extends Component {
  static propTypes = {
    openPaths: PropTypes.array.isRequired,
    historyPaths: PropTypes.array.isRequired,
    tempTabKey: PropTypes.string,
    actions: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    viewChanged: PropTypes.object.isRequired,
    elementById: PropTypes.object.isRequired,
  };

  static defaultProps = {
    tempTabKey: null,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      if (this.delayScroll) clearTimeout(this.delayScroll);
      this.delayScroll = setTimeout(this.scrollActiveTabIntoView, 100);
      this.updateTempKey(prevProps);
    }

    if (prevProps.elementById !== this.props.elementById) {
      this.closeNotExistingTabs(prevProps);
    }
  }

  updateTempKey(prevProps) {
    // If pathname opens a new tab, then it's a temp tab
    const prevOpenPaths = prevProps.openPaths;
    const { openPaths, location, actions, tempTabKey } = this.props;
    const { pathname } = location;
    const tabs = this.getTabs();
    const diff = _.difference(openPaths, prevOpenPaths);

    if (diff.length === 1 && diff[0] === pathname) {
      // Opened a new pathname
      const lastTab = _.last(tabs);
      if (!lastTab) return;
      if (
        lastTab.urlPath === pathname && // The last tab is a new one
        _.intersection(getTabPaths(lastTab), openPaths).length === 1 // The tab only have one child
      ) {
        //This is a new tab, then it's temp
        if (tempTabKey && tempTabKey !== lastTab.key) {
          // Close the last temp tab
          const tempTab = _.find(tabs, { key: tempTabKey });
          if (tempTab) actions.closeTab(tempTab);
        }
        actions.setTempTab(lastTab.key);
      }
    }
  }

  closeNotExistingTabs(prevProps) {
    // If openPaths has some paths not map to a tab, remove them
    const { openPaths, actions, historyPaths } = this.props;
    const tabs = this.getTabs();
    const allPaths = tabs.reduce((p, c) => p.push(...getTabPaths(c)) && p, []);
    const diff = _.difference(openPaths, allPaths);
    if (diff.length) actions.removePaths(diff);

    // Redirect if current pathname has no tab and the current tab element is just deleted (simple compare elementById)
    if (!tabByPathname()) {
      // It  means the current tab element was deleted
      historyPaths.some(p => {
        if (tabs.some(t => _.includes(getTabPaths(t), p))) {
          history.push(p);
          return true;
        }
        return false;
      });
    }
  }

  getTabByPathname(pathname) {
    return {};
  }

  getTabs() {
    const { openPaths, historyPaths, tempTabKey } = this.props;
    const currentPathname = this.props.location.pathname;
    const openTabs = _.compact(openPaths.map(tabByPathname));
    openTabs.forEach(t => {
      if (t.urlPath === currentPathname) t.isActive = true;
    });

    // Re-org tabs:
    // If some paths belong to one tab, corretly show them:
    // For example:
    // Open paths: [a1, b3, a2, a3, b1, b2]
    // History paths: [b2, b1, a2, a1, a3, b3]
    // Then [a1, b3, a2, a3, b1, b2] => [keyA, keyB] => [{a1, A2, a3}, {b3, b1, B2}] => [a2, b2]
    // Node: according to history paths, choose the recent one as the current tab
    const tabsByKey = {};
    openTabs.forEach(tab => {
      if (!tabsByKey[tab.key]) tabsByKey[tab.key] = {};
      tabsByKey[tab.key][tab.urlPath] = tab;
    });
    const newOpenTabs = _.uniq(openTabs.map(t => t.key)).map(tabKey => {
      const tabByPath = tabsByKey[tabKey];
      if (!tabByPath) return null;
      for (let i = 0; i < historyPaths.length; i++) {
        const p = historyPaths[i];
        if (tabByPath[p])
          return {
            ...tabByPath[p],
            isTemp: tabKey === tempTabKey,
            // isTemp: Object.values(tabByPath).length === 1 && p === tempPath, // if only one tab was show and it's tempPath then isTemp=true
          };
      }
      return null;
    });
    return _.compact(newOpenTabs);
  }

  getCurrentTab() {
    return _.find(this.getTabs(), t => t.isActive);
  }

  isChanged(tab) {
    if (tab.subTabs && tab.subTabs.length) return tab.subTabs.some(this.isSubTabChanged);
    return this.props.viewChanged[tab.urlPath];
  }

  isSubTabChanged = subTab => this.props.viewChanged[subTab.urlPath];

  scrollActiveTabIntoView = () => {
    delete this.delayScroll;
    if (!this.rootNode) return;
    const node = this.rootNode.querySelector('.tab.is-active');
    if (node) {
      scrollIntoView(node, this.rootNode, {
        allowHorizontalScroll: true,
        onlyScrollIfNeeded: true,
        offsetRight: 100,
        offsetLeft: 100,
      });
    }
    this.rootNode.scrollTop = 0; // Prevent vertical offset when switching tabs.
  };

  handleSelectTab = tab => {
    if (this.props.location.pathname !== tab.urlPath) history.push(tab.urlPath);
  };

  handleSelectSubTab = subTab => {
    if (this.props.location.pathname !== subTab.urlPath) history.push(subTab.urlPath);
  };

  handleClose = (evt, tab, force) => {
    if (evt && evt.stopPropagation) evt.stopPropagation();

    const { historyPaths, elementById, actions } = this.props;
    const doClose = () => {
      const ele = elementById[tab.key];
      if (ele) {
        // If it's an element, delete all editor cache
        const files = [];
        if (ele.type === 'file') files.push(ele.id);
        else if (ele.target) files.push(ele.target);
        if (ele.views) {
          files.push.apply(files, ele.views.map(v => v.target));
        }
        files.forEach(file => {
          if (!file) return;
          // TODO: this may not cover all posibilities for files under a tab
          delete editorStateMap[file];
          modelManager.reset(file);
        });
      }

      actions.closeTab(tab);
      const newHistoryPaths = [...historyPaths];
      _.pullAll(newHistoryPaths, [tab.urlPath, ...(tab.subTabs || []).map(t => t.urlPath)]);
      if (newHistoryPaths.length === 0) {
        history.push('/welcome');
      } else if (tab.isActive) {
        history.push(newHistoryPaths[0]);
      }
    };

    if (!force && this.isChanged(tab)) {
      Modal.confirm({
        title: 'Discard changes?',
        content: `Do you want to discard changes you made to ${tab.name}?`,
        okText: 'Discard',
        onOk: () => {
          doClose();
        },
        onCancel: () => {},
      });
    } else {
      doClose();
    }
  };

  handleDragEnd = result => {
    if (!result.source || !result.destination || result.source.index === result.destination.index) {
      return;
    }
    const tabs = this.getTabs();
    this.props.actions.moveTab(
      tabs[result.source.index],
      tabs[result.destination.index],
      result.source.index < result.destination.index,
    );
  };

  handleMenuClick = (tab, menuKey) => {
    const tabs = this.getTabs();
    switch (menuKey) {
      case 'close-others':
        tabs.filter(t => t.key !== tab.key).forEach(t => this.handleClose({}, t));
        break;
      case 'close-right':
        tabs.slice(_.findIndex(tabs, { key: tab.key }) + 1).forEach(t => this.handleClose({}, t));
        this.handleSelectTab(tab);
        break;
      case 'close-self':
        this.handleClose({}, tab);
        break;
      default:
        break;
    }
  };

  assignRef = node => {
    this.rootNode = node;
  };

  renderSubTabs = () => {
    const { pathname } = this.props.location;
    const currentTab = this.getCurrentTab();
    const hasSubTabs = currentTab && currentTab.subTabs && currentTab.subTabs.length > 0;
    if (!hasSubTabs) return null;
    let activeSubTabPath = pathname;
    if (!currentTab.subTabs.some(t => t.urlPath === pathname)) {
      const st = _.find(currentTab.subTabs, 'isDefault');
      if (st) activeSubTabPath = st.urlPath;
    }

    return (
      <div className="sub-tabs">
        {currentTab.subTabs.map(subTab => (
          <span
            key={subTab.key}
            className={classnames('sub-tab', {
              'is-active': activeSubTabPath === subTab.urlPath,
              'is-changed': this.isSubTabChanged(subTab),
            })}
            onClick={() => this.handleSelectSubTab(subTab)}
          >
            {subTab.name}
            {this.isSubTabChanged(subTab) ? <span style={{ color: '#108ee9' }}> *</span> : null}
          </span>
        ))}
      </div>
    );
  };

  renderTab = (tab, index) => {
    const getMenu = tab => (
      <Menu onClick={args => this.handleMenuClick(tab, args.key)}>
        <Menu.Item key="close-others">Close others</Menu.Item>
        <Menu.Item key="close-right">Close to the right</Menu.Item>
        <Menu.Item key="close-self">Close</Menu.Item>
      </Menu>
    );
    const iconStyle = tab.iconColor ? { fill: tab.iconColor } : null;
    return (
      <Draggable key={tab.key} draggableId={tab.key} index={index}>
        {provided => (
          <Dropdown overlay={getMenu(tab)} trigger={['contextMenu']} key={tab.key}>
            <span
              key={tab.key}
              onClick={() => this.handleSelectTab(tab)}
              onDoubleClick={() => this.props.actions.stickTab(tab.key)}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={classnames('tab', {
                'is-active': tab.isActive,
                'is-changed': this.isChanged(tab),
                'is-temp': tab.isTemp,
              })}
            >
              {tab.icon && <SvgIcon type={tab.icon} style={iconStyle} />}
              <label>{tab.name}</label>
              <Icon type="close" onClick={evt => this.handleClose(evt, tab)} />
            </span>
          </Dropdown>
        )}
      </Draggable>
    );
  };

  renderNothing() {
    return null;
  }

  render() {
    const tabs = this.getTabs();
    if (!tabs.length) {
      return this.renderNothing();
    }
    const currentTab = this.getCurrentTab();
    const hasSubTabs = currentTab && currentTab.subTabs && currentTab.subTabs.length > 0;
    return (
      <div className={classnames('home-tabs-bar', { 'has-sub-tabs': hasSubTabs })}>
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <Droppable droppableId="droppable" direction="horizontal">
            {provided => (
              <div
                className="main-tabs"
                ref={node => {
                  this.assignRef(node);
                  provided.innerRef(node);
                }}
                style={{ ...getListStyle() }}
              >
                {tabs.map(this.renderTab)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {this.renderSubTabs()}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    ..._.pick(state.home, [
      'openTabs',
      'openPaths',
      'historyPaths',
      'tempTabKey',
      'projectRoot',
      'historyTabs',
      'viewChanged',
      'elementById',
    ]),
    tabs: tabsSelector(state),
    location: state.router.location,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ closeTab, stickTab, moveTab, setTempTab, removePaths }, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabsBar);
