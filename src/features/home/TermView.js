import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { Terminal } from 'xterm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { npmList } from './redux/actions';

// let protocol, socketURL, socket, pid;

const terms = {};
const terminalOptions = {
  cols: 40,
  rows: 20,
  fontSize: 12,
  lineHeight: 1,
  cursorBlink: false,
  disableStdin: true,
  cursorStyle: 'block',
  fontFamily: "'Andale Mono', 'Courier New', 'Courier', monospace",
  theme: {
    foreground: '#7af950',
    background: '#080808',
  },
  screenKeys: true,
  applicationCursor: true,
  mouseEvents: true,
};

function createTerminal(node, id) {
  Terminal.applyAddon(attach);
  Terminal.applyAddon(fit);
  Terminal.applyAddon(winptyCompat);
  const term = new Terminal(terminalOptions);
  term.open(node);
  term.fit();
  term.focus();

  // fit is called within a setTimeout, cols and rows need this.
  return term;
}

export class TermView extends Component {
  static propTypes = {
    id: PropTypes.string,
    onload: PropTypes.func,
  };
  static defaultProps = {
    id: '_default_terminal',
    onload() {},
  };
  getTerm() {
    const { id } = this.props;
    if (!terms[id]) {
      const div = document.createElement('div');
      this.container.appendChild(div);
      terms[id] = createTerminal(div, id);
    }
    return terms[id];
  }
  componentDidMount() {
    const term = this.term = this.getTerm();
    setTimeout(() => {
      this.container.appendChild(term.element.parentNode);
      term.fit();
      term.focus();
      this.props.onload(term);
      term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    }, 10);
    this.props.actions.npmList();
  }

  componentDidUpdate() {
    const output = this.props.termViewOutput;
    output.forEach(text => this.term.write(text));
  }

  componentWillUnmount() {
    const term = this.getTerm();
    if (term) this.container.removeChild(term.element.parentNode);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  render() {
    return <div className="plugin-terminal-web-terminal" ref={n => (this.container = n)} />;
  }
}


function mapStateToProps(state) {
  return {
    termViewOutput: state.home.termViewOutput,
    // router: state.router,
    // location: state.router.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ npmList }, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TermView);
