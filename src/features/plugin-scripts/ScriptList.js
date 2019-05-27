import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from 'antd';
import { SvgIcon, FormBuilder } from '../common';
import { ScriptEditor, ConfirmDeleteScript } from './';

export default class ScriptList extends Component {
  static propTypes = {
    scripts: PropTypes.array.isRequired,
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    running: PropTypes.object,
    current: PropTypes.string,
  };

  renderScriptItem = script => {
    const running = this.props.running[script.name];
    return (
      <li
        key={script.name}
        onClick={() => this.props.onSelect(script.name)}
        className={this.props.current === script.name ? 'selected' : ''}
      >
        {!running ? (
          <SvgIcon
            type="start"
            size={16}
            title="Start"
            onClick={() => this.props.onStart(script.name)}
          />
        ) : (
          <SvgIcon
            type="stop"
            size={16}
            title="Stop"
            onClick={() => this.props.onStop(script.name)}
          />
        )}
        <label>{script.name}</label>
        <label title={script.script} className="script-content">
          {script.script}
        </label>
        <span className="hover-buttons">
          <Popover
            placement="top"
            title="Edit Script"
            trigger="click"
            content={<ScriptEditor script={script} />}
          >
            <Button ghost icon="edit" className="icon-btn" size="small" title="Edit" />
          </Popover>
          <Popover
            placement="top"
            trigger="click"
            content={<ConfirmDeleteScript script={script} />}
          >
            <Button ghost icon="close" className="icon-btn" size="small" title="Delete" />
          </Popover>
        </span>
      </li>
    );
  };
  render() {
    return (
      <div className="plugin-scripts-script-list">
        <div className="script-list-header">
          Total scripts: {this.props.scripts.length}
          <Popover
            placement="top"
            title="New Script"
            trigger="click"
            destroyTooltipOnHide
            content={<ScriptEditor script={{ name: '', script: '' }} />}
          >
            <Button icon="plus" title="New Script" className="icon-btn" />
          </Popover>
        </div>
        <ul>{this.props.scripts.map(this.renderScriptItem)}</ul>
        {this.props.scripts.length === 0 && (
          <p className="no-scripts">No scripts found or package.json is broken.</p>
        )}
      </div>
    );
  }
}
