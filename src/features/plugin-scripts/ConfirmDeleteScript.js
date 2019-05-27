import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, message } from 'antd';
import { deleteScript } from './redux/actions';
import { closePopover } from '../common/utils';

export class ConfirmDeleteScript extends Component {
  static propTypes = {
    pluginScripts: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    script: PropTypes.object.isRequired,
  };

  handleCancel = evt => {
    evt.stopPropagation();
    closePopover();
  }

  handleDelete = evt => {
    evt.stopPropagation();
    this.props.actions.deleteScript(this.props.script.name).catch(() => {
      message.error('Failed to delete the script ' + this.props.script.name);
    });
    closePopover();
  }

  render() {
    return (
      <div className="plugin-scripts-confirm-delete-script">
        <p>Are you sure to delete the script?</p>
        <div className="form-footer">
          <Button size="small" onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button
            size="small"
            type="danger"
            onClick={this.handleDelete}
          >
            Ok
          </Button>
        </div>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    pluginScripts: state.pluginScripts,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ deleteScript }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmDeleteScript);
