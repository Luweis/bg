const fse = require('fs-extra');
const path = require('path');

function getPath(filePath, suffix) {
  if (process.env.NODE_ENV === 'development') {
    return `/assets/${filePath}.${suffix}`;
  }

  const manifest = fse.readFileSync(path.resolve('./public/assets/manifest.json'), 'utf8');
  return JSON.parse(manifest)[`${filePath}.${suffix}`];
}

function getParam(url) {
  var local_url;
  if (url) {
      local_url = url;
  } else {
      local_url = document.location.href;
  }
  var data = local_url.split("?");
  data = data[1];
  var get_data = {};
  if (data) {
      data = data.split("&");
      data.forEach(function (i) {
          var j = i.split("=");
          get_data[j[0]] = decodeURIComponent(j[1]);
      });
  }
  return get_data;
}

module.exports = {
  jsIncludeTag: (filePath) => {
    return `<script type="text/javascript" src="${getPath(filePath, 'js')}"></script>`;
  },
  cssIncludeTag: (filePath) => {
    return `<link type="text/css" rel="stylesheet" href="${getPath(filePath, 'css')}" />`;
  },
  getParam,
};
