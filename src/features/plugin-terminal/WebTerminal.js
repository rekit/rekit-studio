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
// let protocol, socketURL, socket, pid;

const terms = {};
const terminalOptions = {
  cols: 40,
  rows: 20,
  fontSize: 12,
  lineHeight: 1,
  cursorBlink: true,
  disableStdin: false,
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
  // Terminal.applyAddon(attach);
  // Terminal.applyAddon(fit);
  // Terminal.applyAddon(winptyCompat);
  const term = new Terminal(terminalOptions);
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(new WebLinksAddon());
  // terminal.open(containerElement);

  term.onResize(function(size) {
    if (!term.pid) {
      return;
    }
    var cols = size.cols,
      rows = size.rows,
      url = '/terminals/' + term.pid + '/size?cols=' + cols + '&rows=' + rows;

    fetch(url, {
      method: 'POST',
      headers: {
        authorization: window.__REKIT_TOKEN,
      },
    });
  });
  const location = document.location;
  const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
  let socketURL =
    protocol + location.hostname + (location.port ? ':' + location.port : '') + '/terminals/';

  term.open(node);
  // term.fit();
  fitAddon.fit();
  term.fit = () => fitAddon.fit();

  term.focus();

  // fit is called within a setTimeout, cols and rows need this.
  requestAnimationFrame(function() {
    fetch('/terminals?cols=' + term.cols + '&rows=' + term.rows, {
      method: 'POST',
      headers: {
        authorization: window.__REKIT_TOKEN,
      },
    }).then(function(res) {
      res.text().then(function(processId) {
        term.pid = processId;
        socketURL += processId;
        const socket = new WebSocket(socketURL, window.__REKIT_TOKEN);
        socket.onopen = () => {
          const attachAddon = new AttachAddon(socket);
          term.loadAddon(attachAddon);
          term._initialized = true;
        };
      });
    });
  });
  return term;
}

export default class WebTerminal extends Component {
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
    window.addEventListener('resize', this.handleWindowResize);

    const term = this.getTerm();
    setTimeout(() => {
      this.container.appendChild(term.element.parentNode);
      term.fit();
      term.focus();
      this.props.onload(term);
    }, 10);
  }

  componentWillUnmount() {
    const term = this.getTerm();
    if (term) this.container.removeChild(term.element.parentNode);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = _.debounce(() => {
    const term = this.getTerm();
    term.fit();
  }, 300);

  render() {
    return <div className="plugin-terminal-web-terminal" ref={n => (this.container = n)} />;
  }
}
