import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Table } from 'antd';
import { Link } from 'react-router-dom';

export default class RoutesView extends Component {
  static propTypes = {
    element: PropTypes.object.isRequired,
  };

  getColumns() {
    return [
      {
        dataIndex: 'path',
        title: 'Path',
        render: path => (
          <a href={`http://localhost:8080${path}`} target="_blank">
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
    console.log('routes: ', this.props.element.routes);
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
