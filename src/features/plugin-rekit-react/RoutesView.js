import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'antd';

export class RoutesView extends Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
    devPort: PropTypes.number.isRequired,
  };

  getColumns() {
    return [
      {
        dataIndex: 'path',
        title: 'Path',
        render: path => (
          <a href={`http://localhost:${this.props.devPort}${path}`} target="_blank" rel="noopener noreferrer">
            {path}
          </a>
        ),
      },
      {
        dataIndex: 'component',
        title: 'Comonent',
        width: 360,
        // render: component => {
        //   const componentId = `v:src/features/f/`;
        //   return (
        //     <Link to={`/element/${encodeURIComponent(componentId)}`}>
        //       {component}
        //     </Link>
        //   );
        // },
      },
    ];
  }

  render() {
    return (
      <div className="plugin-rekit-react-routes-view">
        <div className="description">
          <p>
            This is a rough overview of routing config defined in a feature. To edit the rules,
            please modify the config directly.
          </p>
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={this.props.element.routes}
          size="small"
          pagination={false}
          rowKey="path"
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    devPort: state.home.projectData.devPort
  };
}

export default connect(
  mapStateToProps,
)(RoutesView);