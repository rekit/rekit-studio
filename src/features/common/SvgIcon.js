import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

// Load all svg files into svg sprite
const files = require.context('!svg-sprite-loader!../../svgicons', false, /.*\.svg$/);
files.keys().forEach(files);

let svgSymbols = null;

// Get all loaded svg icon symbols
function getSvgSymbols() {
  if (svgSymbols) return svgSymbols;
  svgSymbols = {};
  const svgSpriteNode = document.getElementById('__SVG_SPRITE_NODE__');
  if (svgSpriteNode) {
    _.forEach(svgSpriteNode.children, child => {
      svgSymbols[child.id] = true;
    });
  }
  return svgSymbols;
}

class SvgIcon extends Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    color: PropTypes.object,
    size: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    style: {},
  };

  render() {
    const { type } = this.props;
    const cssCls = `anticon common-svg-icon common-svg-icon-${type} ${this.props.className || ''}`;
    const props = { ...this.props };
    props.style = { ...props.style };
    if (props.size) {
      props.style.height = `${props.size}px`;
      props.style.width = `${props.size}px`;
    }
    if (props.color) {
      props.style.color = props.color;
    }
    delete props.className;
    delete props.type;
    delete props.size;
    delete props.color;

    const symbols = getSvgSymbols();
    if (!symbols[type] || /^anticon-/.test(type)) {
      return <Icon className={cssCls} type={type.replace(/^anticon-/, '')} {...props} />;
    }
    return (
      <i className={cssCls} {...props}>
        <svg xmlns="http://www.w3.org/2000/svg">
          <use xlinkHref={`#${type}`} />
        </svg>
      </i>
    );
  }
}

SvgIcon.getSvgSymbols = getSvgSymbols;
export default SvgIcon;
