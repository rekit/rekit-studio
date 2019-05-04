import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { getGroupedDepsDiagramData } from './selectors/getGroupedDepsDiagramData';
import colors from '../../common/colors';

const dummyData = {
  projectData: {
    diagram: {
      groups: [
        { id: 'g1', children: ['e1', 'e2'] },
        // { id: 'g2', children: ['e3', 'e4'] },
        // { id: 'g3', children: ['e5', 'e6'] },
      ],
    },
    elementById: {
      g1: { name: 'G1', id: 'g1', type: 'feature' },
      g2: { name: 'G2', id: 'g2', type: 'feature' },
      g3: { name: 'G3', id: 'g3', type: 'feature' },
      e1: { name: 'E1', id: 'e1', type: 'action' },
      e2: { name: 'E2', id: 'e2', type: 'component' },
      e3: { name: 'E3', id: 'e3', type: 'action' },
      e4: { name: 'E4', id: 'e4', type: 'component' },
      e5: { name: 'E5', id: 'e5', type: 'action' },
      e6: { name: 'E6', id: 'e6', type: 'component' },
    },
  },
};

export default class GroupedDepsDiagram extends Component {
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
    if (prevProps.elementById !== props.elementById) {
      this.updateDiagram();
    }
  }

  getSize() {
    const containerNode = this.d3Node;
    return Math.max(Math.min(containerNode.offsetWidth, containerNode.offsetHeight), 100);
  }

  // byId = id => this.props.elementById[id];

  // toShow = ele => {
  //   return (
  //     ele &&
  //     /^(file|component|action|routes)$/.test(ele.type) &&
  //     !['index.js', 'constants.js', 'actions.js', 'reducer.js'].includes(ele.name) &&
  //     (ele.type === 'file' ? /^js|jsx$/.test(ele.ext) : true)
  //   );
  // };

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
    this.pieBgGroup = this.svg.append('svg:g');
    this.linksGroup = this.svg.append('svg:g');
    this.nodesGroup = this.svg.append('svg:g');
    this.labelsGroup = this.svg.append('svg:g');

    this.tooltip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(d => d.name);
    this.svg.call(this.tooltip);

    this.updateDiagram();
  };

  updateDiagram = () => {
    const size = this.getSize();
    this.svg.attr('width', size).attr('height', size);
    this.diagramData = getGroupedDepsDiagramData({
      data: this.props.data,
      size,
    });
    const { nodes, links } = this.diagramData;
    console.log('diagramdata:', this.diagramData);
    this.drawPies(nodes);
    this.drawNodes(nodes);
    this.drawLabels(nodes);
    this.drawLinks(links);
  };

  drawNodes = nodes => {
    const drawNode = d3Selection => {
      d3Selection
        .attr('id', d => d.id)
        .attr('stroke-width', d => d.width)
        .attr('stroke', d => {
          // if (/v:container-/.test(d.type)) {
          //   return d3
          //     .color(colors(d.type.replace('v:container-', '')))
          //     .brighter(0.75)
          //     .hex();
          // }
          return colors(d.type);
        })
        .attr('fill', 'transparent')
        .attr('class', 'path-element-node od-path')
        .style('cursor', 'pointer')// d => (this.toShow(this.byId(d.id)) ? 'pointer' : 'default'))
        .attr('d', d => {
          const d3Path = d3.path();
          d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
          return d3Path;
        })
        .on('mouseover', this.hanldeNodeMouseover)
        .on('mouseout', this.handleNodeMouseout)
        .on('click', this.props.onNodeClick);
    };

    const allNodes = this.nodesGroup.selectAll('path').data(nodes);
    allNodes.exit().remove();
    drawNode(allNodes.enter().append('svg:path'));
    drawNode(allNodes);
  };

  drawLabels = nodes => {
    const labels = nodes
      .filter(n => n.isGroup)
      .map(f => ({
        id: `label-group-${f.name}`,
        text: f.name,
        href: f.id,
      }));
    const drawLabel = d3Selection => {
      const sss = d3Selection
        .style('font-size', 12)
        .style('fill', '#999')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .style('cursor', 'default')
        .attr('dy', this.diagramData.labelOffset || -10)
        .attr('class', d => `label-node feature-${d.id}`);
      // remove existing text path first, so that not duplicated.
      sss.select('textPath').remove();
      sss
        .append('textPath')
        .attr('xlink:href', d => `#${d.href}`)
        .style('text-anchor', 'start')
        .attr('startOffset', '0%')
        .text(d => d.text);
    };
    const labelNodes = this.labelsGroup.selectAll('text').data(labels);
    labelNodes.exit().remove();
    drawLabel(labelNodes.enter().append('svg:text'));
    drawLabel(labelNodes);
  };

  drawLinks = links => {
    const drawLink = d3Selection => {
      d3Selection
        .attr('id', d => `${d.source.id}-${d.target.id}`)
        .attr('marker-end', 'url(#marker)') // eslint-disable-line
        .attr('fill', 'transparent')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '1px')
        .attr(
          'class',
          d =>
            `path-link od-path ${d.source.feature === d.target.feature ? 'same-feature-dep' : ''}`,
        )
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
    const pies = nodes
      .filter(n => n.isGroup)
      .map(g => ({
        id: `${g.id}:pie`,
        width: g.radius - g.width * 1.5 - 2,
        x: g.x,
        y: g.y,
        startAngle: g.startAngle,
        endAngle: g.endAngle,
      }));

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
    if (this.toShow(this.byId(d.id))) this.tooltip.show(d, nodes[index]);
    this.highlightNode(d, nodes[index]);
  };

  handleNodeMouseout = (d, index, nodes) => {
    this.tooltip.hide(d);
    this.delightNode(d, nodes[index]);
  };

  highlightNode = (d, target) => {
    if (d.type.startsWith('v:container-')) return;

    this.nodesGroup.selectAll('path').attr('opacity', 0.1);
    this.linksGroup.selectAll('path').attr('opacity', 0.1);
    const paths = this.svg.selectAll('path.od-path');
    const { depsData } = this.diagramData;

    const toHighlight = data => {
      const { nodeById } = this.diagramData;
      const relEles = [
        ...(depsData.dependencies[data.id] || []),
        ...(depsData.dependents[data.id] || []),
      ];

      if (d.type === 'feature') {
        return (
          data.feature === d.name ||
          _.get(data, 'source.feature') === d.name || // link out
          _.get(data, 'target.feature') === d.name || // link in
          relEles.some(id => nodeById[id] && nodeById[id].feature === d.name)
        );
      } else {
        return (
          data.id === d.id || // itself
          data.name === d.feature || // feature node
          _.get(data, 'source.id') === d.id || // link out
          _.get(data, 'target.id') === d.id || // link in
          relEles.includes(d.id)
        );
      }
    };

    paths
      .filter(data => {
        if (!data) return false;
        return toHighlight(data);
      })
      .attr('opacity', 1);

    if (d.type === 'feature') {
      paths
        .filter(data => _.get(data, 'target.feature') === d.name)
        .style('stroke-dasharray', '3, 3');
    } else {
      paths.filter(data => _.get(data, 'target.id') === d.id).style('stroke-dasharray', '3, 3');
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
        className="diagram-overview-diagram"
        ref={node => {
          this.d3Node = node;
        }}
      />
    );
  }
}
