const router = require("koa-router")();
const process = require("process");
const http = require("../assets/utils");
const utils = require("../utils");
const help = require("../utils/help.js");
var cache = {};
var common = {};

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
function doctors(keyWord){
  const doctors =  http({
    url: `${baseApi}operationOrderController/getConsultDoctor`,
    config: {
      body: JSON.stringify({
        keyWord,
        pageSize:8,
      })
    }
  });
 return  doctors
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
  //文章
  const health = await http({
    url: `${baseApi}index/queryArticleList`,
    config: {
      body: JSON.stringify({
        pageSize: 8,
        lastArticleCreateTimestamp: 0
      })
    }
  });

  //问答
  const ques = await http({
    url: `${baseApi}questionController/queryRelatedQuestionList`,
    config: {
      body: JSON.stringify({
        size: 5
      })
    }
  });

  //友情链接
  const footer_links = await http({
    url: `${baseApi}linkQueryController/getLink`,
    config: {
      body: JSON.stringify({
        size: 100
      })
    }
  });
  let links = footer_links["resultBodyObject"]["enumItems"] || [];
  common["links"] = links;

  const goods = await http({
    url: `${baseApi}healthyMallController/getInitPageData`,
    config: {
      body: JSON.stringify({
        size: 4
      })
    }
  });

  //疾病库
  const disa = await http({
    url: `${baseApi}diseaseController/getIllnessList`,
    config: {
      body: JSON.stringify({
        pageSize: 50
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
    index: 0,
    common
  };
  cache[ctx.url] = params;
  let html = ctx.render("index", params);
  return html;
}
//主页
router.get("/", async ctx => {
  let params = cache[ctx.url];
  if (params) {
    home(ctx);
    return ctx.render("index", params);
  } else {
    await home(ctx);
  }
});

//医生列表页面
router.get("/doctor", async ctx => {
  const page = ctx.query.page || 1;
  const query = ctx.query.query || "";
  let doctors = await searchDoctor(ctx);
  if (!doctors) {
    doctors = await http({
      url: `${baseApi}consultDoctor/getRecommendDoctor`,
      config: {
        body: JSON.stringify({
          pageSize: 36
        })
      }
    });

    // 模拟分页
    const currentIndex = ctx.query.page? ctx.query.page-1 : 0;
    const rows  = doctors["resultBodyObject"]["rows"].filter((item, index) =>{
      return index>=currentIndex && index<= currentIndex+5;
    });
    doctors["resultBodyObject"]["rows"] = rows;
    doctors["resultBodyObject"].total = 36;
  }

  return ctx.render("consultDoctor", {
    helpers: utils,
    doctors: doctors["resultBodyObject"]["rows"] || [],
    total: doctors["resultBodyObject"]["total"] || 0,
    current: 1,
    activeItem,
    help,
    index: 1,
    common,
    page,
    query
  });
});

// 医生搜索页面结果页面
router.get("/doctor/search", async ctx => {
  const params = ctx.query || {};
  let doctorTypeList;
  let html = "";
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
        pageSize: 8,
        query: params.query
      })
    }
  });
  return ctx.render("searchDoctor", {
    doctors: doctors["resultBodyObject"]["rows"],
    total: doctors["resultBodyObject"].total,
    help,
    index: -1,
    common
  });
});

//医生详情页
router.get("/doctor/:id", async ctx => {
  const id   = ctx.url.split("/")[2].split('?')[0];
  const type = ctx.query.type || '';
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
    index: -1,
    common,
    type
  });
});

function searchDoctor(ctx) {
  const query = ctx.query.query;
  if (!query) {
    return;
  }
  const params = ctx.query || {};
  let doctorTypeList;
  if (params.searchType === "surgery") {
    doctorTypeList = [2, 3];
  } else {
    doctorTypeList = [1, 3];
  }
  const doctors = http({
    url: `${baseApi}searchDoctorController/queryDoctor`,
    config: {
      body: JSON.stringify({
        doctorTypeList,
        pageIndex: params.page || 1,
        pageSize: 6,
        query: params.query
      })
    }
  });
  return doctors;
}

//预约列表页面
router.get("/doctor-yy", async ctx => {
  const page = ctx.query.page ? ctx.query.page : 1;
  const query = ctx.query.query || "";
  let doctors = await searchDoctor(ctx);
  if (!doctors) {
    doctors = await http({
      url: `${baseApi}operationOrderController/getConsultDoctor`,
      config: {
        body: JSON.stringify({
          pageSize: 36
        })
      }
    });
    // 模拟分页
    const currentIndex = ctx.query.page? ctx.query.page-1 : 0;
    const rows  = doctors["resultBodyObject"]["rows"].filter((item, index) =>{
      return index>=currentIndex && index<= currentIndex+5;
    });
    doctors["resultBodyObject"]["rows"] = rows;
    doctors["resultBodyObject"].total = 36;
  }
  return ctx.render("operationOrder", {
    help,
    index: 2,
    common,
    page,
    doctors: doctors["resultBodyObject"].rows || [],
    total: doctors["resultBodyObject"].total || 0,
    query
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

  return ctx.render("articleDetail", {
    ats: article["resultBodyObject"],
    index: -1,
    common,
    help
  });
});

const aboutAts = keyWord => {
  return http({
    url: `${baseApi}questionController/queryRelatedArticle`,
    config: {
      body: JSON.stringify({
        keyWord,
        pageCount: 5
      })
    }
  });
};

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
  const doctor = await doctors(keyWord);
  return ctx.render("interlocution", {
    helpers: utils,
    index: 3,
    common,
    help,
    qa: qa["resultBodyObject"]["rows"] || [],
    doctor:
      (doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || [],
    keyWord
  });
});

//经典问答详情
router.get("/interlocution/:id", async ctx => {
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
  const ats = await aboutAts("");
  //相关问答
  const relateAnswers = await http({
    url: `${baseApi}questionController/queryRelatedQuestionList`,
    config: {
      body: JSON.stringify({
        // keyWord,
        pageCount: 1,
        pageSize:8,
      })
    }
  });
  const first = qa["resultBodyObject"]["rows"][0];
  const doctor = await doctors("");
  return ctx.render("interlocutionDetail", {
    helpers: utils,
    index: 3,
    common,
    help,
    qa:[first] || [],
    doctor:(doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || [],
    keyWord,
    ats: ats["resultBodyObject"], // 相关文章
    relateAnswers: relateAnswers["resultBodyObject"]
  });
});

//疾病库
router.get("/disease", async ctx => {
  let keyWord = ctx.query.query || "";
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
        keyWord,
        pageSize: 8
      })
    }
  });

  return ctx.render("jibinku", {
    helpers: utils,
    index: 5,
    common,
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

  const keyWord = resp['resultBodyObject'].illnessName || ''
  const doctor = await doctors(keyWord)

  //经典问答
  const answer = await http({
    url: `${baseApi}questionController/getQuestionList`,
    config: {
      body: JSON.stringify({
        keyWord: keyWord,
        pageCount: 1,
        pageSize:8
      })
    }
  });
  return ctx.render("illnessDetail", {
    helpers: utils,
    index: -1,
    common,
    help,
    diseases: resp["resultBodyObject"] || [],
    doctor:
      (doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || [],
    qa: answer["resultBodyObject"].rows || []
  });
});

//健康商城
router.get("/mall", async ctx => {
  const resp = await http({
    url: `${baseApi}healthyMallController/getInitPageData`,
    config: {
      body: JSON.stringify({})
    }
  });

  const insurances = resp["resultBodyObject"]["surgeryInsuranceList"] || [];
  const equipments = resp["resultBodyObject"]["equipmentList"] || [];

  return ctx.render("mall", {
    helpers: utils,
    index: 6,
    common,
    help,
    insurances,
    equipments,
    banners: [
      {
        resourceUrl: "/assets/images/mall_detail_1.jpg"
      },
      {
        resourceUrl: "/assets/images/shop_banner.png"
      }
    ]
  });
});

//布骨健康
let healthAll = [];
router.get("/health", async ctx => {
  const page = ctx.query.page || 1;
  const query = ctx.query.query || '';
  let health = []
  if (query) {
    health = await http({
      url: `${baseApi}articleDetail//queryArticleByKeyLabel`,
      config: {
        body: JSON.stringify({
          pageSize: 1000,
          keyWord: query,
          pageIndex:1
        })
      }
    });
    health = health["resultBodyObject"];
  }else {
    health = await http({
      url: `${baseApi}index/queryArticleList`,
      config: {
        body: JSON.stringify({
          pageSize: 1000,
          lastArticleCreateTimestamp: new Date().valueOf(),
          page
        })
      }
    });
    health = health["resultBodyObject"].rows;
  }
  let tags = []
  if(query){
    tags = [{'tagName':query}]
  }else{
    const resp = await http({
      url: `${baseApi}articleDetail/queryArticleLabel`,
      config: {
        body: JSON.stringify({
          pageSize: 50
        })
      }
    });
    tags = resp["resultBodyObject"] || []
  }

  if (page === 1) {
    healthAll = health;
  } else {
    if (health.length > 0) {
      healthAll = [...healthAll, ...health];
    }
  }
  return ctx.render("health", {
    index: 4,
    common,
    hl: healthAll,
    dis: tags,
    help,
    query
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
  const model = resp["resultBodyObject"];
  return ctx.render("mallDetail", {
    helpers: utils,
    index: 7,
    common,
    help,
    model,
    banners: model.productBannerResourcesList || []
  });
});

//购买商品
router.get("/buy", async ctx => {
  const id = ctx.url.split("/").pop() || "";
  return ctx.render("buy", {
    helpers: utils,
    index: -1,
    common,
    help
  });
});

//App下载
router.get("/download", async ctx => {
  return ctx.render("download", {
    helpers: utils,
    index: 9,
    common,
    help
  });
});

router.get("/sorry", async ctx => {
  return ctx.render("sorry", {
    index: -1,
    common,
    help
  });
});


async function center(ctx,type){
  const resp = await http({
    url: `${baseApi}healthyController/queryHealthyCenter`,
    config: {
      body: JSON.stringify({
        "articleType":type
      })
    }
  });
  return ctx.render("centerList", {
    index: -1,
    common,
    help,
    list:resp['resultBodyObject']['rows'] || []
  });
}

router.get("/healthy-center", async ctx => {
  await center(ctx,10)
});

router.get("/join-us", async ctx => {
  await center(ctx,11)
});

router.get("/center/:id", async ctx => {
  const id   = ctx.url.split("/")[2].split('?')[0];
  const resp = await http({
    url: `${baseApi}healthyController/getHealthyCenterDetail`,
    config: {
      body: JSON.stringify({
        id,
      })
    }
  });
  return ctx.render("centerDetail", {
    index: -1,
    common,
    help,
    content:resp['resultBodyObject']['content']
  });
});
module.exports = router;
