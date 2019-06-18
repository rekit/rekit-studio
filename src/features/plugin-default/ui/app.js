export default {
  processProjectData(prjData) {
    if (!prjData.elementById || !prjData.elements || !prjData.elements.length) {
      // no project data loaded
      // indicates the project appType has no corresponding plugin
      return;
    }
    const byId = id => prjData.elementById[id];
    // const normalEles = { file: true, folder: true };
    // function sortChildren(c1, c2) {
    //   c1 = byId(c1);
    //   c2 = byId(c2);
    //   if (c1.order !== c2.order) {
    //     if (c1.hasOwnProperty('order') && c2.hasOwnProperty('order')) return c1.order - c2.order;
    //     if (c1.hasOwnProperty('order')) return -1;
    //     if (c2.hasOwnProperty('order')) return 1;
    //   } else if (c1.type !== c2.type) {
    //     if (!normalEles[c1.type] && !normalEles[c2.type]) return c1.type.localeCompare(c2.type);
    //     if (!normalEles[c1.type]) return -1;
    //     if (!normalEles[c2.type]) return 1;
    //     if (c1.type === 'folder') return -1; // folder first
    //     return 1;
    //   }
    //   return c1.name.toLowerCase().localeCompare(c2.name.toLowerCase());
    // }
    Object.values(prjData.elementById).forEach(ele => {
      if (ele.parts) {
        ele.parts.forEach(part => {
          if (byId(part)) byId(part).owner = ele.id;
        });
      }
      if (ele.children && ele.children.forEach) {
        ele.children.forEach(cid => {
          const c = byId(cid);
          if (c) c.parent = ele.id;
        });
        // Virtual elements first if no order specified

        // ele.children.sort(sortChildren);
      }

      if (ele.icon) return;
      if (ele.type === 'file') {
        switch (ele.ext) {
          case 'js':
          case 'ts':
          case 'svg':
          case 'html':
          case 'json':
          case 'less':
            ele.icon = `file_type_${ele.ext}`;
            break;
          case 'png':
          case 'jpg':
          case 'jpeg':
          case 'gif':
            ele.icon = 'file_type_image';
            break;
          default:
            ele.icon = 'file';
            break;
        }
      } else if (ele.type === 'folder') {
        ele.icon = 'folder';
      }
    });
    // prjData.elements.sort(sortChildren);
  },
};
