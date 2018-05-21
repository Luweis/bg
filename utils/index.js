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

function fullChar2halfChar(str) {
  var result = '';
  for (i = 0; i < str.length; i++) {
    code = str.charCodeAt(i);//获取当前字符的unicode编码
    if (code >= 65281 && code <= 65373)//在这个unicode编码范围中的是所有的英文字母已经各种字符
    {
      result += String.fromCharCode(str.charCodeAt(i) - 65248);//把全角字符的unicode编码转换为对应半角字符的unicode码
    } else if (code == 12288)//空格
    {
      result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
module.exports = {
  jsIncludeTag: (filePath) => {
    return `<script type="text/javascript" src="${getPath(filePath, 'js')}"></script>`;
  },
  cssIncludeTag: (filePath) => {
    return `<link type="text/css" rel="stylesheet" href="${getPath(filePath, 'css')}" />`;
  },
  getParam,
  fullChar2halfChar,
};
