export default {
  processProjectData(prjData) {
    if (!prjData.elementById || !prjData.elements || !prjData.elements.length) {
      // no project data loaded
      // indicates the project appType has no corresponding plugin
      return;
    }
    Object.values(prjData.elementById).forEach(ele => {
      if (ele.type === 'file') {
        switch (ele.ext) {
          case 'js':
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
  },
};
