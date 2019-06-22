import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { getDepsOverviewDiagramData } from './selectors/getDepsOverviewDiagramData';
import colors from '../../common/colors';

export default class DepsOverviewDiagram extends Component {
  static propTypes = {
    onNodeClick: PropTypes.func,
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onNodeClick() {},
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDiagram);
    this.initDiagram();
  }

  componentWillUnmount() {
    this.tooltip.hide();
    window.removeEventListener('resize', this.updateDiagram);
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (prevProps.data !== props.data) {
      this.updateDiagram();
    }
  }

  getSize() {
    const containerNode = this.d3Node;
    return Math.max(Math.min(containerNode.offsetWidth, containerNode.offsetHeight), 100);
  }

  initDiagram = () => {
    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .on('mousemove', this.handleSvgMousemove);

    this.svg
      .append('svg:defs')
      .selectAll('marker')
      .data(['marker'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('class', d => `triangle-marker ${d}`)
      .attr('fill', '#ccc')
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    // this.groupsGroup = this.svg.append('svg:g');
    this.nodesGroup = this.svg.append('svg:g');
    this.pieBgGroup = this.svg.append('svg:g');
    this.linksGroup = this.svg.append('svg:g');
    this.labelsGroup = this.svg.append('svg:g');
    this.labelsGroup2 = this.svg.append('svg:g');

    this.tooltip = d3Tip()
      .attr('class', 'diagram-d3-tip')
      .offset([-10, 0])
      .html(d => d.name);
    this.svg.call(this.tooltip);

    this.updateDiagram();
  };

  updateDiagram = () => {
    const size = this.getSize();
    this.svg.attr('width', size).attr('height', size);
    this.diagramData = getDepsOverviewDiagramData({
      data: this.props.data,
      size,
    });
    const { nodes, links } = this.diagramData;
    this.drawPies(nodes);
    this.drawNodes(nodes);
    this.drawGroupLabels(nodes);
    this.drawLinks(links);
  };

  drawNodes = nodes => {
    const drawNode = d3Selection => {
      d3Selection
        .attr('id', d => d.id)
        .attr('stroke-width', d => d.width)
        .attr('stroke', d => {
          const color = colors(d.type);
          return d.isBg
            ? d3
                .color(colors(d.type))
                .brighter(1)
                .hex()
            : color;
        })
        .attr('fill', 'transparent')
        .attr('class', 'path-element-node od-path')
        .style('cursor', d => (d.clickable ? 'pointer' : 'default'))
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
          return d3Path;
        })
        .on('mouseover', this.hanldeNodeMouseover)
        .on('mouseout', this.handleNodeMouseout)
        .on('click', this.handleNodeClick);
    };

    const allNodes = this.nodesGroup.selectAll('path').data(nodes);
    allNodes.exit().remove();
    drawNode(allNodes.enter().append('svg:path'));
    drawNode(allNodes);
  };

  drawGroupLabels = nodes => {
    // Group labels
    const labels = nodes.filter(n => n.isGroup);
    const drawLabel = d3Selection => {
      const sss = d3Selection
        .style('font-size', d => d.width * 1.2)
        .style('fill', '#999')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('cursor', 'default')
        .attr('dy', this.diagramData.labelOffset || -10)
        .attr('class', d => `label-node feature-label-group-${d.name}`);
      // remove existing text path first, so that not duplicated.
      sss.select('textPath').remove();
      sss
        .append('textPath')
        .attr('xlink:href', d => `#${d.id}`)
        .style('text-anchor', 'start')
        .attr('startOffset', '0%')
        .text(d => d.name);
    };
    const labelNodes = this.labelsGroup.selectAll('text').data(labels);
    labelNodes.exit().remove();
    drawLabel(labelNodes.enter().append('svg:text'));
    drawLabel(labelNodes);
  };

  drawLabels2 = nodes => {
    // normal labels
    const labels2 = nodes.filter(n => !n.isGroup);
    const drawLabel2 = d3Selection => {
      d3Selection
        .style('font-size', 12)
        .style('fill', '#ddd')
        .style('background', '#333')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('cursor', 'default')
        .attr('text-anchor', 'left')
        .attr('transform', d => {
          const radius = d.radius + d.width;
          const angle = (d.startAngle + d.endAngle) / 2;
          const x = d.x + radius * Math.cos(angle);
          const y = d.y + radius * Math.sin(angle);
          const pos = { x, y, angle };
          return `translate(${pos.x}, ${pos.y}) rotate(${(pos.angle * 180) / Math.PI})`;
        })
        .text(d => d.name);
    };
    const labelNodes2 = this.labelsGroup2.selectAll('text').data(labels2);
    labelNodes2.exit().remove();
    drawLabel2(labelNodes2.enter().append('svg:text'));
    drawLabel2(labelNodes2);
  };

  drawLinks = links => {
    const { nodeById, noGroup } = this.diagramData;
    const drawLink = d3Selection => {
      d3Selection
        .attr('id', d => `${d.source}-${d.target}`)
        .attr('marker-end', 'url(#marker)') // eslint-disable-line
        .attr('fill', 'transparent')
        .attr('stroke', noGroup ? '#999' : '#ccc')
        .attr('stroke-width', '1px')
        .attr('class', d => {
          const source = nodeById[d.source];
          const target = nodeById[d.target];
          return `path-link od-path ${source.groupId === target.groupId ? 'same-group-dep' : ''}`;
        })
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.moveTo(d.x1, d.y1);
          d3Path.quadraticCurveTo(d.cpx, d.cpy, d.x2, d.y2);
          return d3Path;
        });
    };

    const linksNodes = this.linksGroup.selectAll('path').data(links);
    linksNodes.exit().remove();
    drawLink(linksNodes.enter().append('svg:path'));
    drawLink(linksNodes);
  };

  drawPies = nodes => {
    let pies;
    if (this.diagramData.noGroup) {
      pies = nodes
        .filter(n => n.isBg)
        .map(g => ({
          id: `${g.id}:pie`,
          width: g.radius - g.width * 0.5,
          x: g.x,
          y: g.y,
          startAngle: g.startAngle,
          endAngle: g.endAngle,
        }));
    } else {
      pies = nodes
        .filter(n => n.isGroup)
        .map(g => ({
          id: `${g.id}:pie`,
          width: g.radius - g.width * 1.5 - 2,
          x: g.x,
          y: g.y,
          startAngle: g.startAngle,
          endAngle: g.endAngle,
        }));
    }

    const drawPie = d3Selection => {
      d3Selection
        .attr('id', d => d.id)
        .attr('stroke-width', d => d.width)
        .attr('stroke', 'rgba(255, 255, 255, 0.1)')
        .attr('fill', 'transparent')
        .attr('class', 'group-pie-node')
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.width / 2, d.startAngle, d.endAngle);
          return d3Path;
        });
    };

    const pieNodes = this.pieBgGroup.selectAll('path').data(pies);
    pieNodes.exit().remove();
    drawPie(pieNodes.enter().append('svg:path'));
    drawPie(pieNodes);
  };

  hanldeNodeMouseover = (d, index, nodes) => {
    if (!d.isGroup) this.tooltip.show(d, nodes[index]);
    this.highlightNode(d, nodes[index]);
  };

  handleNodeMouseout = (d, index, nodes) => {
    if (!d.isGroup) this.tooltip.hide(d);
    this.delightNode(d, nodes[index]);
  };

  handleNodeClick = d => {
    // console.log('node click: ', d);
    if (d.clickable) this.props.onNodeClick(d.id);
  };

  highlightNode = (d, target) => {
    if (d.type.startsWith('v:container-')) return;
    const { depsData } = this.diagramData;

    this.nodesGroup.selectAll('path').attr('opacity', 0.1);
    this.linksGroup.selectAll('path').attr('opacity', 0.1);
    const paths = this.svg.selectAll('path.od-path');

    const toHighlight = {};

    // node itself
    toHighlight[d.id] = true;
    if (d.isGroup) {
      // if it's group, all of its children
      d.children.forEach(c => (toHighlight[c] = true));
    } else {
      // its group node
      toHighlight[d.groupId] = true;
    }
    // dependents or dependencies
    const deps = {};
    Object.keys(toHighlight).forEach(eid => {
      [...(depsData.dependencies[eid] || []), ...(depsData.dependents[eid] || [])].forEach(
        depId => {
          deps[depId] = true;
        },
      );
    });

    paths
      .filter(data => {
        if (!data) return false;
        if (toHighlight[data.id] || deps[data.id]) return true;
        // when hover on group, type bg node is highlighted
        if (d.isGroup && data.groupId === d.id && data.isBg) return true;
        // related links
        return data.source && data.target && (toHighlight[data.source] || toHighlight[data.target]);
      })
      .attr('opacity', 1);

    if (d.isGroup) {
      paths
        .filter(data => data.target && d.children.includes(data.target))
        .style('stroke-dasharray', '3, 3');
    } else {
      paths.filter(data => _.get(data, 'target') === d.id).style('stroke-dasharray', '3, 3');
    }
  };

  delightNode = (d, target) => {
    d3.select(target).attr('opacity', 1);
    d3.selectAll('path.od-path').attr('opacity', 1);
    this.linksGroup.selectAll('path').style('stroke-dasharray', '');
  };

  render() {
    return (
      <div
        className="diagram-deps-overview-diagram"
        ref={node => {
          this.d3Node = node;
        }}
      />
    );
  }
}
