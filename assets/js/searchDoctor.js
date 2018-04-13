/**
 * Created by lenovo on 2017/7/25.
 */
var doctorTypeEnum = {
    surgeryDoctor: 1,
    consultDoctor: 2,
    cooperationDoctor: 3,
    perPage: 10,
};



const block = $(function () {
    const params = getParams(location.search);
    if (params.page === undefined){
      params.page = 1;
  }
    const currentPage = params.page || 1;
    const pre = $('.searchDoctor-pagination-button-prev');
    const next = $('.searchDoctor-pagination-button-next');
    const total = Number($('#search-total-value').text());
    const totalPage = Math.ceil(total / doctorTypeEnum.perPage);
    if (currentPage == 1) {
        pre.hide();
    }else if (currentPage == totalPage){
        next.hide();
    }

    pre.on('click', function () {
      params.page = Number(params.page) - 1;
      window.location.href = `./search?${getQueryParams(params)}`;
    });
    next.on('click', () =>{
      params.page = Number(params.page) + 1;
      window.location.href = `./search?${getQueryParams(params)}`;
    })
});

function getParams(search) {
 search = search.replace(/\?/, '').replace(/&&/g,'&');
 search = decodeURIComponent(search);
 const params = {};
 const array = search.split('&') || [];
 array.map((item) =>{
     const keyValues = item.split('=');
     params[keyValues[0]] = keyValues[1];
 });
 return params;
}

function getQueryParams(obj) {
 return Object.keys(obj).map((key) => `${key}=${obj[key]}`).join('&');
}

export default block;

