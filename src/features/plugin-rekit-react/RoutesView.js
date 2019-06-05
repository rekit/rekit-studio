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
    const { devPort } = this.props;
    return [
      {
        dataIndex: 'path',
        title: 'Path',
        render: path => (
          <a
            href={`http://${document.location.hostname}:${devPort || 3000}${path}`}
            target="_blank"
            rel="noopener noreferrer"
          >
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
            please modify the code directly.
          </p>
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={this.props.element.routes}
          size="small"
          pagination={false}
          rowKey="path"
        />
        <p className="port-description">
          Note: Rekit finds the dev port of the app from package.json start script which includes
          the pattern PORT=xxx .
        </p>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    devPort: state.home.projectData.devPort,
  };
}

export default connect(mapStateToProps)(RoutesView);
