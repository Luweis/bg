const fetch = require('isomorphic-fetch');

const config = {
  method: "POST",
  headers: {
    'Content-Type': 'application/json',
  }
}

function http(opt) {
  return fetch(opt.url, Object.assign({ },config, opt.config))
    .then(response => response.json()).catch(()=>{
         return {resultBodyObject:{}}
    });
}

module.exports = http
