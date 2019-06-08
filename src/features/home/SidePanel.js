import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dropdown, Icon, Menu, Modal, message } from 'antd';
import * as actions from './redux/actions';
import { SvgIcon } from '../common';
import { About, DemoAlert, ProjectExplorer } from './';
import plugin from '../../common/plugin';

export class SidePanel extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  };

  state = {
    aboutDialogVisible: process.env.REKIT_ENV === 'demo',
  };

  showAbout = () => {
    this.setState({
      aboutDialogVisible: true,
    });
  };

  hideAbout = () => {
    this.setState({
      aboutDialogVisible: false,
    });
  };

  getMenuItems() {
    const menuItems = [
      {
        icon: 'anticon-reload',
        iconColor: '#555',
        label: 'Reload Project Data',
        key: 'force-reload',
        order: 10,
      },
    ];
    plugin.getPlugins('menu.mainMenu.fillMenuItems').forEach(p => {
      p.menu.mainMenu.fillMenuItems(menuItems);
    });
    menuItems.sort((m1, m2) => m1.order || 1000 - m2.order || 1000);
    return menuItems;
  }

  handleMainMenuClick = evt => {
    plugin
      .getPlugins('menu.mainMenu.handleMenuClick')
      .forEach(p => p.menu.mainMenu.handleMenuClick(evt.key));
    switch (evt.key) {
      case 'force-reload': {
        const hide = message.loading('Reloading project data...', 0);
        this.props.actions.fetchProjectData({ force: true }).then(hide).catch(err => {
          hide();
          message.error('Failed to fetch project data.');
        });
        break;
      }
      case 'about':
        this.showAbout();
        break;
      default:
        break;
    }
  };

  renderMainMenu = () => {
    return (
      <Menu onClick={this.handleMainMenuClick} className="main-menu">
        {this.getMenuItems().map(mi => (
          <Menu.Item key={mi.key}>
            {mi.icon && (
              <span>
                <SvgIcon type={mi.icon} color={mi.iconColor} />
                {mi.label}
              </span>
            )}
          </Menu.Item>
        ))}
        <Menu.Item key="about">
          <Icon type="appstore-o" style={{ color: 'transparent' }} />
          About
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    // const { projectName, projectRoot, sidePanelWidth, demoAlertVisible } = this.props;
    // const prjName = projectName || projectRoot.split('/').pop();
    const demoAlertVisible = false;
    const { projectName } = this.props;
    return (
      <div className="home-side-panel dark-theme">
        <div className="header">
          <Link className="home-link" to="/" title={this.props.projectRoot}>
            <h5>
              <SvgIcon type="anticon-home" size={20} color="#999" /> {projectName}
            </h5>
          </Link>
          <Dropdown overlay={this.renderMainMenu()}>
            <label>
              <Icon type="ellipsis" style={{ fontSize: '20px', fontWeight: 'bold' }} />
            </label>
          </Dropdown>
        </div>
        <ProjectExplorer />
        {this.state.aboutDialogVisible && (
          <Modal
            visible
            maskClosable
            title=""
            footer=""
            width={process.env.REKIT_ENV === 'demo' ? '760px' : '360px'}
            onCancel={this.hideAbout}
            style={{ top: '50px' }}
          >
            <About />
          </Modal>
        )}
        {demoAlertVisible && <DemoAlert onClose={this.props.actions.hideDemoAlert} />}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return _.pick(state.home, ['projectName', 'projectRoot', 'sidePanelWidth', 'demoAlertVisible']);
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);
