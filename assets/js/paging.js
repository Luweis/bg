import '../../assets/public/js/paging.min';
import { getParams, getQueryParams } from "./searchDoctor";

const path = location.pathname;
const currentPage = getParams(location.search).page || 1;
const total = +$('.pc-banner-show').attr('data-total');
const totalPage = Math.ceil(total/6);

$('#box').paging({
  initPageNo: currentPage,
  totalPages: totalPage,
  totalCount: '合计'+ total+'条数据',
  slideSpeed: 600,
  callback: function(page) {

    if (currentPage == page) return
    const params = getParams(location.search);
    params.page = page;
    const qs = getQueryParams(params);
    location.href = `${path}${qs}`
  }
});

$('.yy-search-btn').on('click', () =>{

  const query = $('#consultDoctorSearch').val().trim();
  const params = { query }
  if (path === '/doctor-yy'){
    params['searchType'] = "surgery";
  }
  const qs = getQueryParams(params);
  location.href = `${path}${qs}`
});

$('.swiper-button-next').on('click', () =>{

  if (currentPage >= totalPage) return;
  const params = getParams(location.search);
  params.page = +currentPage + 1;
  const s = getQueryParams(params);
  location.href = `${path}${s}`;

});

$('.swiper-button-prev').on('click', () =>{
  if (currentPage <= 1) return;
    const params = getParams(location.search);
    params.page = +currentPage - 1;
    const s = getQueryParams(params);
    location.href = `${path}${s}`;

});
