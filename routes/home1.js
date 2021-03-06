const router = require("koa-router")();
const process = require("process");
const http = require("../assets/utils");
const utils = require("../utils");
const help = require("../utils/help.js");
var cache   = {};
var common  = {};
var  defineHeader = {
      title:'在线咨询医生，快速预约手术，骨健康问题就找布骨医生',
      keywords:'三甲医院手术预约_专家_主任医生手术_床位预约_布谷鸟_布骨医生网',
      description:'做骨科手术就找布骨医生，权威专家主刀，为您提供疾病咨询、病床预约，手术预约，术后康复等健康服务，只要是骨骼问题，在这里轻松解决！'
}

function activeItem(index, current) {
  index !== current ? "test" : "";
}
function check(data, tip = "暂无") {
  return data ? data : tip;
}

const currentEnv = process.env.NODE_ENV === "development" ? "pro" : "pro";
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
        pageCount: 5,
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
    // ques, // 问答
    dis: disa["resultBodyObject"],
    qa: answer["resultBodyObject"].rows || [],
    common,
    head:{       
       ...defineHeader,
       title:'骨科医生咨询_骨科医院预约_骨健康医疗平台-布骨医生 ',
      keywords:'骨科医生免费咨询,骨科医院预约,骨健康,骨科平台,骨科专科',
      description:'做骨科手术就找布骨医生，专业的骨健康平台，权威骨科专家主刀，为您提供骨科疾病免费咨询、病床预约，骨科手术预约，术后康复等健康服务，只要是骨骼问题，在这里轻松解决！'
    },
    help,
    index: 0,
    
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
      return index>=currentIndex*6 && index<= currentIndex*6+5;
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
    common,
    head:{       
       ...defineHeader,    
    },
    help,
    index: 1,
    page,
    query,
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
  let doc_detail =  doc["resultBodyObject"]["doctorDetail"] || {}
  let realName = doc_detail.realName || ''
  let hospitalName = doc_detail.hospitalName || ''
  let title = doc_detail.title || ''
  let desc = doc_detail.desc || ''
  desc = `${desc.substring(0,100)}`
  return ctx.render("doctorHomePage", {
    doctorDetail: doc["resultBodyObject"]["doctorDetail"],
    relatedDocotrs: doc["resultBodyObject"]["relatedDocotrs"],
    check,
    help,
    index: -1,
    common,
    head:{
      ...defineHeader,
      title:`${realName}_${title}_${hospitalName}_布骨医生`,
      keywords:`${realName}_医生`,
      description:desc
    },
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
    doctorTypeList = [1, 3];
  } else {
    doctorTypeList = [2, 3];
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
      return index>=currentIndex*6 && index<= currentIndex*6+5;
    });
    doctors["resultBodyObject"]["rows"] = rows;
    doctors["resultBodyObject"].total = 36;
  }
  return ctx.render("operationOrder", {
    help,
    index: 2,
        common,  head:{...defineHeader,},
    page,
    doctors: doctors["resultBodyObject"].rows || [],
    total: doctors["resultBodyObject"].total || 0,
    query
  });
});

function GetChinese(strValue) {  
  if(strValue!= null && strValue!= ""){  
      var reg = /[\u4e00-\u9fa5]/g;   
      return strValue.match(reg).join("");  
  }  
  else  
      return "";  
}

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
  let title = (article["resultBodyObject"] || {}).title || ''
  title = `${title.substring(0,25)}_骨科疾病知识`
  let description = (article["resultBodyObject"] || {}).desc || ''
  let content = (article["resultBodyObject"] || {}).content || ''
  content = GetChinese(content)
  description = `${description}${content}`
  description = `${description.substring(0,100)}`
  let keywords = (article["resultBodyObject"] || {}).keyword || ''
  return ctx.render("articleDetail", {
    ats: article["resultBodyObject"],
    index: -1,
    common, 
    head:{
      ...defineHeader,
      title,
      description,
      keywords
    },
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
        pageCount: 8
      })
    }
  });
  const doctor = await doctors(keyWord);
  return ctx.render("interlocution", {
    helpers: utils,
    index: 3,
    common,
    head:{...defineHeader,},
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
  const id = ctx.url.split("/")[2] || 1;
  keyWord = decodeURIComponent(keyWord);
  const qa = await http({
    url: `${baseApi}questionController/getQuestionDetail`,
    config: {
      body: JSON.stringify({
        id
      })
    }
  });
  const ats = await aboutAts("");
  //推荐
  const relateAnswers = await http({
    url: `${baseApi}questionController/getQuestionList`,
    config: {
      body: JSON.stringify({
        pageCount: 8,
      })
    }
  });
  const doctor = await doctors("");

  let title = (qa["resultBodyObject"] || {}).questionData || ''
  title = title.content || ''
  title = `${title.substring(0,25)}_骨科在线咨询`

  let descriptions = (qa["resultBodyObject"] || {}).answerDatas || []
  let description = ''
  descriptions.forEach(element => {
    description =`${description}${element.content}`
  });
  description = `${description.substring(0,100)}`

  return ctx.render("interlocutionDetail", {
    helpers: utils,
    index: 3,
    common, 
    head:{
      ...defineHeader,
    },
    help,
    qa:[qa["resultBodyObject"] || {}],
    doctor:(doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || [],
    keyWord,
    ats: ats["resultBodyObject"], // 相关文章
    relateAnswers: relateAnswers["resultBodyObject"].rows
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
    head:{...defineHeader,},
    help,
    keyWord,
    diseases: resp["resultBodyObject"],
    doctor:
      (doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || []
  });
});

// 疾病详情
async function diseaseDetail(ctx){
  const id = ctx.url.split("/")[2] || 1;
  const index = ctx.url.split("/")[3] || 0;
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
        pageCount: 8,
      })
    }
  });
  let diseases = resp["resultBodyObject"] || {}
  let illnessName = diseases.illnessName
  let titles = ['介绍','病因','症状','检查','预防','治疗','鉴别诊断','并发症']
  let tabarString = titles[index]
  let t = ''
  let k = ''
  let d = ''
  if(index == 0){
    t = `【${illnessName}】_${illnessName}的病因症状_检查治疗_布骨医生`
       k = `${illnessName}病因,${illnessName}症状,${illnessName}检查,${illnessName}治疗方法`
       d = `布骨医生网向您详细介绍${illnessName}症状,${illnessName}治疗方法,${illnessName}该怎么办等问题,布骨医生的各地好评专家为您提供优质的在线咨询服务.`
  }else{
    t = `${illnessName}${tabarString}_布骨医生`
     k = `${illnessName}${tabarString}`
     d = `布骨医生网向您详细介绍${illnessName}${tabarString}等问题,布骨医生的各地好评专家为您提供优质的在线咨询服务.`
  }

  return ctx.render("illnessDetail", {
    helpers: utils,
    index: -1,
    common,
    head:{
      ...defineHeader,
      title:t,
      keywords:k,
      description:d
    },
    help,
    diseases: resp["resultBodyObject"] || {},
    doctor:
      (doctor["resultBodyObject"] && doctor["resultBodyObject"].rows) || [],
    qa: answer["resultBodyObject"].rows || [],
    tabar_index:index
  });
}

router.get("/disease/:id",async ctx => {
  await diseaseDetail(ctx)
})

router.get("/disease/:id/:index", async ctx => {
   await diseaseDetail(ctx)
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
    head:{...defineHeader,},
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
    common,  head:{...defineHeader,},
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
    head:{...defineHeader,},
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
    common,  head:{...defineHeader,},
    help
  });
});

//App下载
router.get("/download", async ctx => {
  return ctx.render("download", {
    helpers: utils,
    index: 9,
    common,
    head:{...defineHeader,},
    help
  });
});

router.get("/sorry", async ctx => {
  return ctx.render("sorry", {
    index: -1,
    common,  head:{...defineHeader,},
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
    head:{...defineHeader,},
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
    head:{...defineHeader,},
    help,
    content:resp['resultBodyObject']['content']
  });
});

router.get("/robots.txt", async ctx => {
  return ctx.render("robots.txt", {
   
  });
});

router.get("/sitemap.xml", async ctx => {
  return ctx.render("sitemap.xml", {
   
  });
});

const map = require('./map.js');
router.get("/map", async ctx => {
  const pw = ctx.query.pw || '';
  if(pw == '123456'){
    console.log('123456');
    map.printUrl()
  }
});



module.exports = router;
