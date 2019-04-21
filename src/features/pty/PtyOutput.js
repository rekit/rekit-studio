import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as attach from 'xterm/lib/addons/attach/attach';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import { Terminal } from 'xterm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { clearOutput, npmList } from './redux/actions';

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
  Terminal.applyAddon(attach);
  Terminal.applyAddon(fit);
  Terminal.applyAddon(winptyCompat);
  const term = new Terminal(terminalOptions);
  term.open(node);
  term.fit();
  term.focus();
  return term;
}

export class PtyOutput extends Component {
  static propTypes = {
    id: PropTypes.string,
    output: PropTypes.object.isRequired,
    // clear: PropTypes.bool,
  };
  static defaultProps = {
    id: '_pty_default_output_terminal',
    // clear: false,
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
  }

  componentDidUpdate(prevProps) {
    const output = this.props.output[this.props.id];
    if (output && output.length) {
      output.forEach(text => this.term.write(text));
      this.props.actions.clearOutput(this.props.id);
    }
    if (prevProps.id !== this.props.id) {
      this.updateTerm();
    }
    // this.checkClear();
  }

  componentWillUnmount() {
    const term = this.getTerm();
    if (term) this.container.removeChild(term.element.parentNode);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  // checkClear() {
  //   if (this.props.clear) {

  //   }
  // }

  updateTerm() {
    if (this.term) this.container.removeChild(this.term.element.parentNode);
    const term = (this.term = this.getTerm());
    setTimeout(() => {
      this.container.appendChild(term.element.parentNode);
      term.fit();
    }, 10);
  }

  handleWindowResize = _.debounce(() => {
    console.log('window resize');
    // const term = this.getTerm();
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
    actions: bindActionCreators({ clearOutput, npmList }, dispatch),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PtyOutput);
