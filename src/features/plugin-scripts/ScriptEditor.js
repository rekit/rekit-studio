import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Button } from 'antd';
import { FormBuilder } from '../common';
import { saveScript } from './redux/actions';
import { closePopover } from '../common/utils';

export class ScriptEditor extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    script: PropTypes.object.isRequired,
  };

  handleSubmit = evt => {
    evt.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      this.props.actions
        .saveScript(this.props.script.name, values.name, values.script)
        .then(() => {
          closePopover();
        })
        .catch(err => {
          if (_.get(err, 'response.status') === 400) {
            this.props.form.setFields({
              name: {
                value: values.name,
                errors: [new Error(_.get(err, 'response.data'))],
              },
            });
          }
        });
    });
  };

  render() {
    const { script } = this.props;
    const meta = {
      elements: [
        {
          key: 'name',
          placeholder: 'name',
          autoFocus: true,
          required: true,
          initialValue: script.name,
        },
        { key: 'script', placeholder: 'script', required: true, initialValue: script.script },
      ],
    };
    return (
      <Form
        onSubmit={this.handleSubmit}
        className="plugin-scripts-script-editor"
        style={{ width: '300px' }}
      >
        <FormBuilder meta={meta} form={this.props.form} />
        <div className="form-footer">
          <Button onClick={closePopover}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Ok
          </Button>
        </div>
      </Form>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {};
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ saveScript }, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(ScriptEditor));
