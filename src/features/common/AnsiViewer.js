import React, { Component } from 'react';
import Convert from 'ansi-to-html';
const convert = new Convert();

export default class AnsiViewer extends Component {
  static propTypes = {};

  render() {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: convert
            .toHtml(
              this.props.text
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/ /g, '&nbsp;')
                .replace(/\n/g, '<br />')
            )
            .replace('#00A', '#1565C0')
            .replace(/color:#555/g, 'color:#777'),
        }}
      />
    );
  }
}
