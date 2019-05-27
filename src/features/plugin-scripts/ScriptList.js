import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SvgIcon } from '../common';

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
        <label title={script.script} className="script-content">{script.script}</label>
      </li>
    );
  };
  render() {
    return (
      <div className="plugin-scripts-script-list">
        {this.props.scripts.length === 0 && <p className="no-scripts">No scripts found or package.json is broken.</p>}
        <ul>{this.props.scripts.map(this.renderScriptItem)}</ul>
      </div>
    );
  }
}
