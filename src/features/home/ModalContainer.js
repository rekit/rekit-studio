import React, { Component } from 'react';
import plugin from '../../common/plugin';

export default class ModalContainer extends Component {
  static propTypes = {};

  render() {
    const modals = plugin.getPlugins('getModals').reduce((prev, curr) => {
      return prev.concat(curr.getModals());
    }, []);
    return (
      <div className="home-modal-container">
        {modals.map((M, i) => (
          <M key={i} />
        ))}
      </div>
    );
  }
}
