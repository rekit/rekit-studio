export default {
  overview: {
    processData(data) {
      const byId = id => data.elementById[id];
      Object.values(data.elementById)
        .filter(ele => ele.type === 'feature')
        .forEach(f => {
          const group = {
            id: f.id,
            name: f.name,
            type: 'feature',
            children: [],
          };

          const children = [...f.children];
          while (children.length) {
            const child = byId(children.pop());
            if (
              ['initial-state', 'routes'].includes(child.type) ||
              [
                'index.js',
                'constants.js',
                'actions.js',
                'route.js',
                'reducer.js',
                'style.less',
              ].includes(child.name)
            ) {
              continue;
            }
            if (child.children) {
              children.push.apply(children, child.children);
            } else if (child.type !== 'file' || child.deps) group.children.push(child.id);
          }
          data.groups.push(group);
        });
    },
  },
};
