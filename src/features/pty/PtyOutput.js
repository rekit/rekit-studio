import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import * as fit from 'xterm/lib/addons/fit/fit';
// import * as attach from 'xterm/lib/addons/attach/attach';
// import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { removeOutputFromStore, npmList } from './redux/actions';

const terms = {};
const terminalOptions = {
  fontSize: 12,
  lineHeight: 1,
  cursorBlink: false,
  disableStdin: true,
  cursorStyle: 'underline',
  fontFamily: "'Andale Mono', 'Courier New', 'Courier', monospace",
  theme: {
    foreground: '#ccc',
    background: '#080808',
    cursor: '#080808',
  },
  screenKeys: false,
  applicationCursor: true,
  mouseEvents: true,
};

function createTerminal(node, id) {
  // Terminal.applyAddon(attach);
  // Terminal.applyAddon(fit);
  // Terminal.applyAddon(winptyCompat);
  const term = new Terminal(terminalOptions);
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new WebLinksAddon());
  term.fit = () => fitAddon.fit();
  term.open(node);
  term.fit();
  term.focus();
  return term;
}

export class PtyOutput extends Component {
  static propTypes = {
    id: PropTypes.string,
    output: PropTypes.object.isRequired,
  };
  static defaultProps = {
    id: '_pty_default_output_terminal',
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
    window.addEventListener('resize', this.handleWindowResize);
    this.updateTerm();
    this.writeOutput();
    this.checkClear();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.updateTerm();
    }
    this.writeOutput();
    this.checkClear();
  }

  componentWillUnmount() {
    const term = this.getTerm();
    if (term) this.container.removeChild(term.element.parentNode);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  writeOutput() {
    const output = this.props.output[this.props.id];
    if (output && output.length) {
      output.forEach(text => this.term.write(text));
      this.props.actions.removeOutputFromStore(this.props.id);
    }
  }

  checkClear() {
    if (!this.props.output[this.props.id] && this.term) {
      this.term.clear();
    }
  }

  updateTerm() {
    if (this.term) this.container.removeChild(this.term.element.parentNode);
    const term = (this.term = this.getTerm());
    setTimeout(() => {
      this.container.appendChild(term.element.parentNode);
      term.fit();
    }, 10);
  }

  handleWindowResize = _.debounce(() => {
    if (this.term) this.term.fit();
  }, 300);

  render() {
    return <div className="pty-output" ref={n => (this.container = n)} />;
  }
}

function mapStateToProps(state) {
  return {
    output: state.pty.output,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ removeOutputFromStore, npmList }, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PtyOutput);
