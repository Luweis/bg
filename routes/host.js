/**
 * 获取全部的网址
 */

const process = require("process");
const http = require("../assets/utils");
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

function searchDoctor(ctx) {
    let doctorTypeList;
    if (ctx === 2) {
      doctorTypeList = [1, 3];
    } else {
      doctorTypeList = [2, 3];
    }
    const list = http({
      url: `${baseApi}searchDoctorController/queryDoctor`,
      config: {
        body: JSON.stringify({
          doctorTypeList,
          pageIndex:1,
          pageSize: 10000,
          query: ''
        })
      }
    });
    return list;
  }
  function QuestionList() {
    const list = http({
      url: `${baseApi}questionController/getQuestionList`,
      config: {
        body: JSON.stringify({
          pageCount: 10000,
          keyWord: ''
        })
      }
    });
    return list;
  }

  function ArticleList() {
    const list = http({
      url: `${baseApi}index/queryArticleList`,
      config: {
        body: JSON.stringify({
         pageSize: 10000,
         lastArticleCreateTimestamp: 0
        })
      }
    });
    return list;
  }

  function InessList() {
    const list = http({
      url: `${baseApi}diseaseController/getIllnessList`,
      config: {
        body: JSON.stringify({
          size: 10000,
        })
      }
    });
    return list;
  }
  function mallList() {
    const list = http({
      url: `${baseApi}healthyMallController/getInitPageData`,
      config: {
        body: JSON.stringify({
        })
      }
    });
    return list;
  }
  
  
  
async function printUrl(){
    let host = 'https://www.drbugu.com/'
    //咨询医生
    searchDoctor(1).then(resp =>{
        let list = resp.resultBodyObject.rows || []
        let hosp = list.map(item=>`${host}doctor/${item.id}`)
        console.log(hosp.join('\n'))
    }) 
    //手术医生
    searchDoctor(2).then(resp =>{
        let list = resp.resultBodyObject.rows || []
        let hosp = list.map(item=>`${host}doctor/${item.id}?type=yy`)
        console.log(hosp.join('\n'))
    }) 
    
    //问答
    QuestionList().then(resp =>{
        let list = resp.resultBodyObject.rows || []
        let hosp = list.map(item=>`${host}interlocution/${item.questionData.topicId}`)
        console.log(hosp.join('\n'))
    })

    //疾病库
    InessList().then(resp =>{
        let list = resp.resultBodyObject || []
        let hosp = list.map(item=>`${host}disease/${item.id}`)
        console.log(hosp.join('\n'))
    })

    //商城
    mallList().then(resp =>{
        let list1 = resp.resultBodyObject.surgeryInsuranceList || []
        let list2 = resp.resultBodyObject.equipmentList || []

        list1 = list1.map(item=>`${host}mall/insurance/${item.id}`)
        list2 = list2.map(item=>`${host}mall/equipment/${item.id}`)
        console.log(list1.join('\n'))
        console.log(list2.join('\n'))

    })

    //文章
    ArticleList().then(resp =>{
        let list = resp.resultBodyObject.rows || []
        let hosp = list.map(item=>`${host}article/${item.id}`)
        // console.log(hosp.join('\n'))
    })

}

module.exports = {
    printUrl,
}
