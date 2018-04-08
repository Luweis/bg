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
    const currentPage = params.page || 1;
    const pre = $('.searchDoctor-pagination-button-prev');
    const next = $('.searchDoctor-pagination-button-next');
    const total = Number($('#search-total-value').text());
    const totalPage = Math.ceil(total / doctorTypeEnum.perPage);
    if (currentPage===1) {
        pre.hide();
    }else if (currentPage === totalPage){
        next.hide();
    }

    pre.on('click', function () {
        location.href = ``
    })
});

function getParams(search) {
 search = search.replace(/\?/, '').replace(/&&/g,'&');
 const params = {};
 const array = search.split('&') || [];
 array.map((item) =>{
     const keyValues = item.split('=');
     params[keyValues[0]] = keyValues[1];
 });
 return params;
}

// function initPagination (total) {
//     var totalPage = Math.ceil(total/10);
//      const pre = $('.searchDoctor-pagination-button-prev');
//      const next = $('.searchDoctor-pagination-button-next');;
//      if (totalPage<2) {
//          next.hide();
//      }else if(totalPage 10) {
//
//      }
// }

export default block;

