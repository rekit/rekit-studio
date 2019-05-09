import _ from 'lodash';
import { createSelector } from 'reselect';
import { getDepsData } from '../../home/selectors/projectData';

const padding = size => Math.max(size / 15, 20);
const nodeWidth = size => Math.max(size / 50, 6);

// Get node center position
const getPos = node => {
  const radius = node.radius - node.width / 2;
  const angle = (node.startAngle + node.endAngle) / 2;
  const x = node.x + radius * Math.cos(angle);
  const y = node.y + radius * Math.sin(angle);
  return { x, y, angle };
};

// Get the link data from source to target
const getLink = (source, target) => {
  const pos1 = getPos(source);
  const pos2 = getPos(target);
  const x1 = pos1.x;
  const y1 = pos1.y;
  const x2 = pos2.x;
  const y2 = pos2.y;

  const jx = (x1 + x2) / 2;
  const jy = (y1 + y2) / 2;

  // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
  const a = x2 - x1;
  const asign = a < 0 ? -1 : 1;
  const b = y2 - y1;

  const theta = Math.atan(b / a);

  // Find the point that's perpendicular to J on side
  const costheta = asign * Math.cos(theta);
  const sintheta = asign * Math.sin(theta);

  const radius = source.radius - source.width / 2;
  let ang = Math.abs(pos1.angle - pos2.angle);
  if (ang > Math.PI) ang = 2 * Math.PI - ang;
  ang /= 2;
  const d1 = Math.abs(radius * Math.cos(ang));
  // const d2 = radius - d1;
  const d2 = radius * Math.sin(ang);

  let d = d1;
  if (d > d2 * 2) d = d2 * 2;
  let s = pos1.angle;
  let t = pos2.angle;
  if (Math.abs(s - t) > Math.PI) {
    if (s < t) s += 2 * Math.PI;
    else t += 2 * Math.PI;
  }
  const m = s < t ? d : -d;

  const m1 = m * sintheta;
  const m2 = m * costheta;

  // Use c and d to find cpx and cpy
  const cpx = jx - m1;
  const cpy = jy + m2;

  return { x1, y1, x2, y2, cpx, cpy, source: source.id, target: target.id };
};

// Get each element's start angle and the degree of the angle.
const calcAngles = (eles, containerStart, containerAngle, gapRate, isCircle) => {
  // eleAngle * count + gap * gapCount = containerAngle
  // gap = eleAngle * gapRate
  // gapCount = isCircle ? count + 1 : count;

  const count = eles.length;
  const gapCount = isCircle ? count : count - 1;
  let gap;
  if (gapRate === 0) gap = 0;
  // when gapRate < 0, it means abolute angle value in degree
  else if (gapRate < 0) gap = (Math.PI * 2 * Math.abs(gapRate)) / 360;
  // when gapRate > 0, it means percent of the node angle
  else gap = containerAngle / (count / gapRate + gapCount);

  const leftAngle = containerAngle - gap * gapCount;
  let start = containerStart;
  const total = eles.reduce((p, c) => p + (c.weight || 1), 0);
  return eles.map((ele, index) => {
    const angle = ((ele.weight || 1) / total) * leftAngle;
    const res = {
      start,
      angle,
    };
    start = start + angle + gap;
    return res;
  });
};

const nodeById = {};
// Get the node diagram data
const getNode = (ele, angle, x, y, radius, width, groupName) => {
  return (nodeById[ele.id] = {
    id: ele.id,
    name: ele.name,
    type: ele.type,
    radius,
    width,
    startAngle: angle.start,
    endAngle: angle.start + angle.angle,
    x,
    y,
    groupName,
  });
};

// Groups sample data:
//  [{id: 'group1', children: ['child1', 'child2']}]
export const getDepsOverviewDiagramData = createSelector(
  state => state.data,
  state => getDepsData(state.data),
  state => state.size,
  (data, deps, size) => {
    // All nodes should be in the deps diagram.
    const byId = id => data.elementById[id];
    const x = size / 2;
    const y = size / 2;
    const nodes = [];

    let groups;
    let noGroup;
    let groupIdSeed = 0;
    let showBgNodes = true;
    if (data.groups && data.groups.length) {
      groups = data.groups.map(g => ({ ...g, weight: g.children.length }));
    } else if (data.elements && data.elements.length) {
      // no group diagram
      showBgNodes = _.uniq(data.elements.map(id => byId(id).type)).length > 1;
      noGroup = true;
      groups = [
        {
          id: 'vv:empty-group',
          name: '',
          noShow: true,
          isGroup: true,
          type: 'empty',
          children: data.elements,
        },
      ];
    } else {
      // empty diagram
      groups = [];
    }

    const radius = size / 2 - padding(size);
    const innerRadius = radius - nodeWidth(size) - 2;

    // Each startAngle and endAngle of groups
    const angles = calcAngles(groups, 0, Math.PI * 2, noGroup ? 0 : -3, true);
    groups.forEach((group, index) => {
      // Get group nodes
      const n = getNode(group, angles[index], x, y, radius, nodeWidth(size), group.name);
      n.isGroup = true;
      n.children = group.children;
      n.pos = getPos(n);
      if (!noGroup) nodes.push(n);

      // Get group's children nodes
      const angles2 = calcAngles(
        group.children,
        n.startAngle,
        n.endAngle - n.startAngle,
        0.2,
        noGroup ? true : false,
      );
      const bgNodes = [];
      let currentBgNode;
      group.children.forEach((cid, index2) => {
        const child = byId(cid);
        const n2 = getNode(
          {
            ...child,
            weight: 1,
          },
          angles2[index2],
          x,
          y,
          innerRadius,
          nodeWidth(size),
          group.name,
        );
        n2.pos = getPos(n2);
        n2.groupId = noGroup ? groupIdSeed++ : group.id;
        n2.clickable = true;
        nodes.push(n2);

        if (showBgNodes) {
          if (!currentBgNode || currentBgNode.type !== n2.type) {
            if (currentBgNode) {
              currentBgNode.pos = getPos(currentBgNode);
              bgNodes.push(currentBgNode);
            }
            currentBgNode = Object.assign({}, n2, {
              id: `bg-node-${group.name}-${n2.type}`,
              name: n2.type,
              clickable: false,
              isBg: true,
            });
          } else {
            currentBgNode.endAngle = n2.endAngle;
          }
        }
      });
      if (showBgNodes) {
        if (currentBgNode) bgNodes.push(currentBgNode);
        // Bg nodes should be render first so that it's in back
        nodes.unshift(...bgNodes);
      }
    });

    let links = [];
    const allElements = groups.reduce((p, c) => p.concat(c.children), []).map(byId);
    allElements.forEach(ele => {
      const eleDeps = deps.dependencies[ele.id] || [];
      eleDeps.forEach(dep => {
        const source = nodeById[ele.id];
        const target = nodeById[dep];
        if (source && target) links.push(getLink(source, target));
        // else console.error('overview diagram link: source or target not exist: ', ele.id, dep);
      });
    });

    links = _.uniqWith(links, _.isEqual);
    return {
      nodes,
      links,
      depsData: deps,
      nodeById,
      labelOffset: -nodeWidth(size),
      noGroup,
      showBgNodes,
    };
  },
);
