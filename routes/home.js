const router = require('koa-router')();
const koaBody = require('koa-body')();
const fetch = require('isomorphic-fetch');
const helpers = require('../helpers');

router.get('/', (ctx) => {
  return ctx.render('index', { helpers });
});

// router.post('/confirm_phone', koaBody, (ctx) => {
//   return fetch('https://www.ikcrm.com/supplier_applies/confirm_phone.json', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       supplier_apply: {
//         phone: ctx.request.body.phone,
//       }
//     }),
//   }).then(response => response.json()).then(stories => {
//     ctx.body = stories;
//   });
// });
//
// router.post('/verify_code', koaBody, (ctx) => {
//   return fetch('https://www.ikcrm.com/api/supplier_applies/verify_want_otp_code', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       supplier_apply: {
//         phone: ctx.request.body.phone,
//         want_otp_code: ctx.request.body.code,
//       }
//     }),
//   }).then(response => response.json()).then(stories => {
//     ctx.body = stories;
//   });
// });
//
// router.post('/create_lead', koaBody, (ctx) => {
//   return fetch('http://cms.ikcrm.com/api/soukebao/create_lead', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'ACCESS-TOKEN': '856eb07524822909d0f9712d3a3a80fa3697cd4c2400d985934618d681b9f6e0485f134f0f37e0c2f442222d18d9e343884da22c8b3a410479899de4fa6f7479',
//     },
//     body: `phone=${ctx.request.body.phone}&source=15&product_type=10&request_ip=${ctx.request.ip}`,
//   }).then(response => response.json()).then(stories => {
//     ctx.body = stories;
//   });
// });

module.exports = router;
