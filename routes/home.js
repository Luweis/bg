const router = require('koa-router')();
const process = require('process');
const http = require('../assets/utils');
const utils = require('../utils');

function activeItem(index, current) {
  index !== current? 'test': '';
}

function check(data, tip='暂无' ) {
 return data? data : tip;
}

const currentEnv = process.env.NODE_ENV === 'development'? 'pro' : 'dev'

const env = {
  dev: {
    controllerBaseUrl: 'http://wechat.test.drbugu.com/test/drbugu/mainSite/door/api/',
    siteBaseUrl: 'http://wechat.test.drbugu.com/'
  },
  pro: {
    controllerBaseUrl: 'https://www.drbugu.com/drbugu/mainSite/door/api/',
    siteBaseUrl: 'https://www.drbugu.com/'
  }
}

const baseApi = env[currentEnv].controllerBaseUrl;


//主页
router.get('/', async (ctx) => {

 const banners = await http({
   url: `${baseApi}index/getBannerResources`
 });

  const docs = await http({
    url: `${baseApi}consultDoctor/getRecommendDoctor`,
    config: {
      body: JSON.stringify({
        pageSize: 20
      })
    }
  });
  console.log(docs['resultBodyObject']['rows']);
 return ctx.render('index', {
   helpers: utils,
   banners: banners['resultBodyObject'],
   docs: docs['resultBodyObject']['rows']
 });
});

//医生列表页面
router.get('/doctor', async (ctx) => {
  const data = await http({
    url: `${baseApi}consultDoctor/getRecommendDoctor`,
    config:{
      body: JSON.stringify({
        pageSize: 30
      })
    }
  });

  return ctx.render('consultDoctor', {
    helpers: utils,
    doctors: data['resultBodyObject']['rows'],
    current: 1,
    activeItem
  })
});

// 医生搜索页面结果页面
 router.get('/doctor/search', async (ctx) =>{
   const params = ctx.query || {};
   const doctors = await http({
     url: `${baseApi}/SearchDoctorController/queryDoctor`,
     config:{
       body: JSON.stringify({
         doctorTypeList:[2,3],
         pageIndex: params.page || 1,
         pageSize: 10,
         query: params.query
       })
     }
   });

   console.log(doctors);
   return ctx.render('searchDoctor', {
     doctors: doctors['resultBodyObject']['rows'],
     total: doctors['resultBodyObject'].total
   });
 });

//医生详情页
router.get('/doctor/:id',async (ctx) => {
  const id = ctx.url.split('/')[2];

  const doc = await http({
    url: `${baseApi}doctorHomePageController/initDoctorData`,
    config: {
      body: JSON.stringify({
        docId: id
      })
    }
  });

  console.log(doc);
  return ctx.render('doctorHomePage', {
    doctorDetail: doc['resultBodyObject']['doctorDetail'],
    relatedDocotrs: doc['resultBodyObject']['relatedDocotrs'],
    check
  });
});


//预约列表页面
router.get('/doctor-yy', (ctx) => {
  return ctx.render('operationOrder')
});


module.exports = router;
