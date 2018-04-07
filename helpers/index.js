const fse = require('fs-extra');
const path = require('path');

function getPath(filePath, suffix) {
  if (process.env.NODE_ENV === 'development') {
    return `/assets/${filePath}.${suffix}`;
  }

  const manifest = fse.readFileSync(path.resolve('./public/assets/manifest.json'), 'utf8');
  return JSON.parse(manifest)[`${filePath}.${suffix}`];
}

module.exports = {
  jsIncludeTag: (filePath) => {
    return `<script type="text/javascript" src="${getPath(filePath, 'js')}"></script>`;
  },
  cssIncludeTag: (filePath) => {
    return `<link type="text/css" rel="stylesheet" href="${getPath(filePath, 'css')}" />`;
  },
};
