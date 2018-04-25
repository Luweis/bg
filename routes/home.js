const router = require("koa-router")();
const process = require("process");
const http = require("../assets/utils");
const utils = require("../utils");
const help = require("../utils/help.js");
var cache = {};
function activeItem(index, current) {
  index !== current ? "test" : "";
}

function check(data, tip = "暂无") {
  return data ? data : tip;
}

const currentEnv = process.env.NODE_ENV === "development" ? "dev" : "pro";

const env = {
  dev: {
    controllerBaseUrl:
      "http://wechat.test.drbugu.com/test/drbugu/mainSite/door/api/",
    siteBaseUrl: "http://wechat.test.drbugu.com/"
  },
  pro: {
    controllerBaseUrl: "https://www.drbugu.com/drbugu/mainSite/door/api/",
    siteBaseUrl: "https://www.drbugu.com/"
  }
};

const baseApi = env[currentEnv].controllerBaseUrl;

// 获取推荐医生
function doctors(keyWord) {
  return http({
    url: `${baseApi}operationOrderController/getConsultDoctor`,
    config: {
      body: JSON.stringify({
        keyWord
      })
    }
  });
}

async function home(ctx) {
  const banners = await http({
    url: `${baseApi}index/getBannerResources`
  });
  const docs = await http({
    url: `${baseApi}consultDoctor/getRecommendDoctor`,
    config: {
      body: JSON.stringify({
        pageSize: 4
      })
    }
  });

  const docyy = await http({
    url: `${baseApi}operationOrderController/getConsultDoctor`,
    config: {
      body: JSON.stringify({
        pageSize: 4
      })
    }
  });

  const health = await http({
    url: `${baseApi}index/queryArticleList`,
    config: {
      body: JSON.stringify({
        pageSize: 4,
        lastArticleCreateTimestamp: 0
      })
    }
  });

  const ques = await http({
    url: `${baseApi}questionController/queryRelatedQuestionList`,
    config: {
      body: JSON.stringify({
        size: 4
      })
    }
  });

  const goods = await http({
    url: `${baseApi}healthyMallController/getInitPageData`,
    config: {
      body: JSON.stringify({
        size: 4
      })
    }
  });

  const disa = await http({
    url: `${baseApi}diseaseController/getIllnessList`,
    config: {
      body: JSON.stringify({
        pageSize: 4
      })
    }
  });

  //经典问答
  const answer = await http({
    url: `${baseApi}questionController/getQuestionList`,
    config: {
      body: JSON.stringify({
        keyWord: "",
        pageCount: 1
      })
    }
  });
  let params = {
    helpers: utils,
    banners: banners["resultBodyObject"] || [],
    docs: docs["resultBodyObject"]["rows"],
    yy: docyy["resultBodyObject"].rows,
    hl: health["resultBodyObject"].rows,
    gds: goods["resultBodyObject"]["equipmentList"], // 商品
    surgeryInsuranceList: goods["resultBodyObject"]["surgeryInsuranceList"], //保险
    ques, // 问答
    dis: disa["resultBodyObject"],
    qa: answer["resultBodyObject"].rows || [],
    help,
    index: 0
  };
  cache[ctx.url] = params;
  let html = ctx.render("index", params);
  console.log("异步更新数据");
  return html;
}
//主页
router.get("/", async ctx => {
  let params = cache[ctx.url];
  if (params) {
    home(ctx);
    console.log("读取缓存数据");
    return ctx.render("index", params);
  } else {
    await home(ctx);
  }
});

//医生列表页面
router.get("/doctor", async ctx => {
  const data = await http({
    url: `${baseApi}consultDoctor/getRecommendDoctor`,
    config: {
      body: JSON.stringify({
        pageSize: 30
      })
    }
  });

  return ctx.render('consultDoctor', {
    // helpers: utils,
    doctors: data['resultBodyObject']['rows'] || [],
    current: 1,
    activeItem,
    help,
    index: 1
  });
});

// 医生搜索页面结果页面
router.get("/doctor/search", async ctx => {
  const params = ctx.query || {};
  let doctorTypeList;
  if (params.searchType === "surgery") {
    doctorTypeList = [1, 3];
  } else {
    doctorTypeList = [2, 3];
  }

  const doctors = await http({
    url: `${baseApi}operationOrderController/getConsultDoctor`,
    config: {
      body: JSON.stringify({
        doctorTypeList,
        pageIndex: params.page || 1,
        pageSize: 10,
        query: params.query
      })
    }
  });

  return ctx.render("searchDoctor", {
    doctors: doctors["resultBodyObject"]["rows"],
    total: doctors["resultBodyObject"].total,
    help,
    index: -1
  });
});

//医生详情页
router.get("/doctor/:id", async ctx => {
  const id = ctx.url.split("/")[2];

  const doc = await http({
    url: `${baseApi}doctorHomePageController/initDoctorData`,
    config: {
      body: JSON.stringify({
        docId: id
      })
    }
  });

  return ctx.render("doctorHomePage", {
    doctorDetail: doc["resultBodyObject"]["doctorDetail"],
    relatedDocotrs: doc["resultBodyObject"]["relatedDocotrs"],
    check,
    help,
    index: -1
  });
});

//预约列表页面
router.get("/doctor-yy", async ctx => {
  const doctors = await http({
    url: `${baseApi}operationOrderController/getConsultDoctor`,
    config: {
      body: JSON.stringify({
        pageSize: 20
      })
    }
  });
  return ctx.render("operationOrder", {
    help,
    index: 2,
    doctors: doctors["resultBodyObject"].rows
  });
});

//文章详情
router.get("/article/:id", async ctx => {
  const id = ctx.url.split("/")[2];
  const article = await http({
    url: `${baseApi}articleDetail/getArticleDetail`,
    config: {
      body: JSON.stringify({
        id: id
      })
    }
  });
  return ctx.render('articleDetail', {
    ats: article['resultBodyObject'],
    index: -1,
    help
  });
});

//经典问答
router.get("/interlocution", async ctx => {
  let keyWord = ctx.query.keyWord || "";
  keyWord = decodeURIComponent(keyWord);

  const qa = await http({
    url: `${baseApi}questionController/getQuestionList`,
    config: {
      body: JSON.stringify({
        keyWord: keyWord,
        pageCount: 1
      })
    }
  });

  const diseases = await http({
    url: `${baseApi}diseaseController/searchIllness`,
    config: {
      body: JSON.stringify({
        keyWord: keyWord
      })
    }
  });

  const doctor = doctors(keyWord);

  return ctx.render("interlocution", {
    helpers: utils,
    index: 3,
    help,
    qa: qa["resultBodyObject"]["rows"] || [],
    doctor:
      (doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || [],
    diseases: diseases["resultBodyObject"] || [],
    keyWord
  });
});

//疾病库
router.get("/disease", async ctx => {
  let keyWord = ctx.query.keyWord || "";

  keyWord = decodeURIComponent(keyWord);

  const param = utils.getParam(ctx.url);

  const resp = await http({
    url: `${baseApi}diseaseController/searchIllness`,
    config: {
      body: JSON.stringify({
        keyWord
      })
    }
  });

  //  推荐医生
  const doctor = await http({
    url: `${baseApi}operationOrderController/getConsultDoctor`,
    config: {
      body: JSON.stringify({
        keyWord
      })
    }
  });

  return ctx.render("jibinku", {
    helpers: utils,
    index: 5,
    help,
    keyWord,
    diseases: resp["resultBodyObject"],
    doctor:
      (doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || []
  });
});

// 疾病详情
router.get("/disease/:id", async ctx => {
  const id = ctx.url.split("/")[2] || 1;
  const resp = await http({
    url: `${baseApi}diseaseController/getDataById`,
    config: {
      body: JSON.stringify({
        id
      })
    }
  });

  const doctor = await http({
    url: `${baseApi}operationOrderController/getConsultDoctor`,
    config: {
      body: JSON.stringify({
        pageSize: 4
      })
    }
  });

  //经典问答
  const answer = await http({
    url: `${baseApi}questionController/getQuestionList`,
    config: {
      body: JSON.stringify({
        keyWord: "",
        pageCount: 1
      })
    }
  });

  return ctx.render("illnessDetail", {
    helpers: utils,
    index: -1,
    help,
    diseases: resp["resultBodyObject"] || [],
    doctor:
      (doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || [],
    qa: answer["resultBodyObject"].rows || []
  });
});

//健康商城
router.get('/mall',async (ctx) =>{
  const param = utils.getParam(ctx.url)
  const resp = await http({
    url: `${baseApi}healthyMallController/getInitPageData`,
    config: {
      body: JSON.stringify({})
    }
  });

  const insurances = resp['resultBodyObject']['surgeryInsuranceList'] || []
  const equipments  = resp['resultBodyObject']['equipmentList'] || []

  return ctx.render("mall", {
    helpers: utils,
    index: 6,
    help,
    insurances,
    equipments
  });
});

//布骨健康

let healthAll = [];
router.get('/health', async (ctx) => {

  const page = ctx.query.page || 1;

  let health = await http({
    url: `${baseApi}index/queryArticleList`,
    config: {
      body: JSON.stringify({
        pageSize: 10,
        lastArticleCreateTimestamp: new Date().valueOf(),
        page
      })
    }
  });


  const resp = await http({
    url: `${baseApi}diseaseController/getIllnessList`,
    config: {
      body: JSON.stringify({
        pageSize: 20
      }),
    }
  });

  health = health['resultBodyObject'].rows;
  if (page === 1){
    healthAll = health;
  } else {
    if (health.length > 0) {
      healthAll = [...healthAll, ...health];
    }
  }

  return ctx.render("health", {
    hos: [
      "北京人民解放军总医院",
      "北京积水潭医院",
      "北京协和医院",
      "上海市第六人民医院",
      "第四军医大学西京医院",
      "四川大学华西医院",
      "第二军医大学长征医院",
      "北京大学人民医院",
      "西京鼓楼医院"
    ],
    index: 4,
    hl: healthAll,
    dis: resp['resultBodyObject'] || [],
    help
  });
});

//商品详情
router.get("/mall/:type/:id", async ctx => {
  const id = ctx.url.split("/")[3] || "";
  const type = ctx.url.split("/")[2] || "";
  const url =
    type == "insurance"
      ? "healthyMallDetailController/getInsuranceDetail"
      : "healthyMallDetailController/getEquipmentDetail";
  const resp = await http({
    url: `${baseApi}${url}`,
    config: {
      body: JSON.stringify({
        id: id
      })
    }
  });
  return ctx.render("mallDetail", {
    helpers: utils,
    index: 7,
    help,
    model: resp["resultBodyObject"]
  });
});

//购买商品
router.get("/buy", async ctx => {
  const id = ctx.url.split("/").pop() || "";
  return ctx.render("buy", {
    helpers: utils,
    index: -1,
    help
  });
});

//关于我们
router.get("/about-us", async ctx => {
  return ctx.render("aboutUs", {
    helpers: utils,
    index: 8,
    help
  });
});

//App下载
router.get("/download", async ctx => {
  return ctx.render("download", {
    helpers: utils,
    index: 9,
    help
  });
});

router.get('/sorry', async (ctx) => {
  return ctx.render('sorry', {
    index: -1,
    help
  });
});

module.exports = router;
