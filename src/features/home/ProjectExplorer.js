import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Spin, Tree } from 'antd';
import scrollIntoView from 'dom-scroll-into-view';
import { SvgIcon } from '../common';
import { storage } from '../common/utils';
import { stickTab } from './redux/actions';
import { getTreeData } from './selectors/projectData';
import { ProjectExplorerContextMenu } from './';
import plugin from '../../common/plugin';
import element from '../../common/element';
import colors from '../../common/colors';
import icons from '../../common/icons';

const TreeNode = Tree.TreeNode;

export class ProjectExplorer extends Component {
  static propTypes = {
    projectData: PropTypes.object,
    treeData: PropTypes.array,
    actions: PropTypes.object.isRequired,
    elementById: PropTypes.object,
  };

  static defaultProps = {
    projectData: null,
    treeData: null,
    elementById: null,
  };

  constructor(props) {
    super(props);
    this.state.expandedKeys = storage.local.getItem('explorerExpandedKeys', [], true);
  }

  state = {
    selectedKey: null,
    expandedKeys: [],
  };

  eleById = id => this.props.elementById[id];

  getElementIdByUrl(pathname) {
    // selected tree node always maps to an url path
    const arr = pathname.split('/');
    if (arr[1] === 'element') return decodeURIComponent(arr[2]);
    return null;
  }

  getExpandedKeys() {
    return this.state.expandedKeys;
  }

  componentDidUpdate(prevProps) {
    const prevElementId = this.getElementIdByUrl(prevProps.router.location.pathname);
    const currElementId = this.getElementIdByUrl(this.props.router.location.pathname);
    if (prevElementId !== currElementId) {
      // element changed by url
      let ele = this.eleById(currElementId);
      const expandedKeys = [...this.state.expandedKeys];
      while (ele && ele.parent) {
        if (!_.includes(expandedKeys, ele.parent)) {
          expandedKeys.push(ele.parent);
        }
        ele = this.eleById(ele.parent);
      }
      this.setState(
        {
          selectedKey: currElementId,
          expandedKeys,
        },
        () => {
          setTimeout(() => {
            const targetNode = this.rootNode.querySelector('.ant-tree-node-selected');
            if (targetNode) {
              scrollIntoView(targetNode, this.rootNode, {
                onlyScrollIfNeeded: true,
                offsetTop: 50,
                offsetBottom: 50,
              });
            }
          }, 100);
        },
      );
    }
  }

  handleRightClick = evt => {
    this.ctxMenu.handleRightClick(evt);
  };

  handleSelect = (selected, evt) => {
    const key = evt.node.props.eventKey;
    const hasChildren = !!_.get(evt, 'node.props.children');

    let expandedKeys = this.state.expandedKeys;
    if (hasChildren) {
      if (expandedKeys.includes(key)) {
        expandedKeys = _.without(expandedKeys, key);
      } else {
        expandedKeys = [...expandedKeys, key];
      }
    }
    storage.local.setItem('explorerExpandedKeys', expandedKeys);
    const ele = this.eleById(key);
    if (ele && (ele.navigable || ele.type === 'file')) {
      // history.push(`/element/${encodeURIComponent(ele.id)}`);
      element.show(ele);
    }
    plugin.getPlugins('projectExplorer.handleSelect').forEach(p => {
      p.projectExplorer.handleSelect(key);
    });

    this.setState({
      selectedKey: key,
      expandedKeys,
    });
  };

  handleExpand = (expanded, evt) => {
    const key = evt.node.props.eventKey;
    let expandedKeys = this.state.expandedKeys;
    if (expandedKeys.includes(key)) {
      expandedKeys = _.without(expandedKeys, key);
    } else {
      expandedKeys = [...expandedKeys, key];
    }

    storage.local.setItem('explorerExpandedKeys', expandedKeys);
    this.setState({
      expandedKeys,
    });
  };

  handleTreeNodeDoubleClick = () => {
    setTimeout(this.props.actions.stickTab, 50);
  };

  assignCtxMenu = ctxMenu => {
    this.ctxMenu = ctxMenu;
  };

  renderTreeNodeIcon(nodeData) {
    if (_.has(nodeData, 'icon') && !nodeData.icon) return null;
    const iconProps = {
      type: nodeData.icon || icons(nodeData.type),
    };
    if (_.has(nodeData, 'iconColor')) {
      // If a an element defines iconColor, then use it, even its value is false/null
      if (nodeData.iconColor) iconProps.color = nodeData.iconColor;
    } else {
      // Ohterwise use system color
      iconProps.color = colors(nodeData.type);
    }
    return <SvgIcon {...iconProps} />
  }

  renderTreeNodeTitle(nodeData) {
    return (
      <span>
        {this.renderTreeNodeIcon(nodeData)}
        <label>
          {nodeData.name}
          {_.has(nodeData, 'count') ? ` (${nodeData.count})` : ''}
        </label>
        {nodeData.marks &&
          nodeData.marks.length &&
          nodeData.marks.map(mark => (
            <span
              key={mark.name}
              title={mark.description}
              className="mark"
              style={{ backgroundColor: mark.bgColor, ...mark.style }}
            >
              {mark.name}
            </span>
          ))}
      </span>
    );
  }
  // otherProps={{ onDoubleClick: () => console.log('tree node double click') }}

  renderTreeNode = (nodeData, depth = 1) => (
    <TreeNode
      key={nodeData.key}
      title={this.renderTreeNodeTitle(nodeData)}
      className={classnames(nodeData.className, `tree-node-depth-${depth}`)}
      isLeaf={!nodeData.children || !nodeData.children.length}
    >
      {nodeData.children && nodeData.children.map(d => this.renderTreeNode(d, depth + 1))}
    </TreeNode>
  );

  renderLoading() {
    return (
      <div className="home-project-explorer">
        <Spin />
      </div>
    );
  }

  render() {
    // const { features, srcFiles, featureById, treeData, searchKey } = this.props;

    if (!this.props.elementById) {
      return this.renderLoading();
    }

    const treeNodes = this.props.treeData.map(d => this.renderTreeNode(d));

    return (
      <div
        className="home-project-explorer"
        ref={node => {
          this.rootNode = node;
        }}
        onDoubleClick={this.handleTreeNodeDoubleClick}
      >
        {treeNodes.length > 0 ? (
          <Tree
            onRightClick={this.handleRightClick}
            defaultExpandParent={false}
            selectedKeys={[this.state.selectedKey]}
            expandedKeys={this.state.expandedKeys}
            onSelect={this.handleSelect}
            onExpand={this.handleExpand}
          >
            {treeNodes}
          </Tree>
        ) : (
          <div className="no-results">Project not found.</div>
        )}
        <ProjectExplorerContextMenu ref={this.assignCtxMenu} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  const prjData = state.home.projectData;
  return {
    projectData: prjData,
    router: state.router,
    elementById: prjData && prjData.elementById,
    treeData: prjData ? getTreeData(prjData) : null,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ stickTab }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectExplorer);
