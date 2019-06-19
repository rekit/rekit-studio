import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SvgIcon from './SvgIcon';
import colors from '../../common/colors';
import icons from '../../common/icons';

export default class ElementIcon extends Component {
  static propTypes = {
    size: PropTypes.number,
    element: PropTypes.object,
  };

  static defaultPorps = {
    size: 16,
    element: null,
  };

  render() {
    const { element } = this.props;
    const newProps = { ...this.props };
    delete newProps.element;
    if (!element) return null;
    const iconType = _.has(element, 'icon') ? element.icon : icons(element.type);
    const iconColor = _.has(element, 'iconColor') ? element.iconColor : colors(element.type);
    if (!iconType) return null;
    return <SvgIcon {...newProps} type={iconType} color={iconColor} />;
  }
}
