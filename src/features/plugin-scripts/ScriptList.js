import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from 'antd';
import classnames from 'classnames';
import { SvgIcon } from '../common';
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
        className={classnames({ selected: this.props.current === script.name, running })}
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
            trigger="click"
            destroyTooltipOnHide
            content={<ScriptEditor title="Edit Script" script={script} />}
          >
            <Button
              ghost
              icon="edit"
              className="icon-btn"
              size="small"
              title="Edit"
              onClick={evt => evt.stopPropagation()}
            />
          </Popover>
          <Popover
            placement="top"
            trigger="click"
            content={<ConfirmDeleteScript script={script} />}
          >
            <Button
              ghost
              icon="close"
              className="icon-btn"
              size="small"
              title="Delete"
              onClick={evt => evt.stopPropagation()}
            />
          </Popover>
        </span>
      </li>
    );
  };
  render() {
    return (
      <div className="plugin-scripts-script-list">
        
        <ul>{this.props.scripts.map(this.renderScriptItem)}</ul>
        <div className="script-list-toolbar">
          <Popover
            placement="top"
            trigger="click"
            destroyTooltipOnHide
            content={<ScriptEditor title="New Script" script={{ name: '', script: '' }} />}
          >
            <Button icon="plus" title="New Script" className="icon-btn">New Script</Button>
          </Popover>
        </div>
      </div>
    );
  }
}
