// import commonContainer from '../../assets/public/js/common';
// import env from '../../assets/config/env';
// import Swiper from 'swiper';
//
//
// var consultDoctorData = {
//   PAGE_SIZE: 30,
//   ONE_PAGE_COUNT: 6,
//   ONE_ROW_COUNT: 2,
//   $consultDoctorSearch: $('#consultDoctorSearch')
// };
//
// const block = $(function () {
//   // 初始化Swiper
//   getAppointmentRecommendDoctor();
//
//   $('.consultDoctor-search-button').on('click', function () {
//     const searchWord = consultDoctorData.$consultDoctorSearch.val();
//     window.location.href =  `./doctor/search?query=${encodeURIComponent(searchWord)}`
//   });
//
//   $('.consultDoctor-search-button').on('click', function () {
//     const search = $('#consultDoctorSearch').val();
//     window.location.href = `./doctor/search?query=${encodeURIComponent(search)}`
//   });
//
// });
//
// function getAppointmentRecommendDoctor() {
//   commonContainer.http({
//     data: {pageSize: consultDoctorData.PAGE_SIZE},
//     url: 'consultDoctor/getRecommendDoctor',
//     success: function (response) {
//       var doctorList = response.resultBodyObject.rows;
//       if (doctorList.length === 0) {
//         return;
//       }
//       appendDoctorList(doctorList);
//       new Swiper('.swiper-container', {
//         pagination: {
//           el: '.swiper-pagination',
//         },
//         autoplay: true,
//       })
//     }
//   })
// }
//
// function appendDoctorList(doctorList) {
//   var allPageStr = '';
//
//   while (doctorList.length > 0) {
//     var onePageList = doctorList.splice(0, consultDoctorData.ONE_PAGE_COUNT);
//     allPageStr += generateOnePageEleStr(onePageList);
//   }
//
//   $('#consultDoctorSwiperWrapper').append(allPageStr);
// }
//
// function generateOnePageEleStr(onePageList) {
//   var onePageRowStr = '';
//
//   while (onePageList.length > 0) {
//     var onRowList = onePageList.splice(0, consultDoctorData.ONE_ROW_COUNT);
//     onePageRowStr += generateOneRowEleStr(onRowList);
//   }
//
//   return '<div class="swiper-slide">' + onePageRowStr +
//     '</div>';
// }
//
// function generateOneRowEleStr(onRowList) {
//   var oneRowStr = '';
//
//   for (var i = 0; i < onRowList.length; i++) {
//     oneRowStr += generateDoctorItem(onRowList[i]);
//   }
//
//   return '<div class="consultDoctor-recommend-doctor-row row">' + oneRowStr +
//     '</div>'
// }
//
// function generateDoctorItem(doctorItem) {
//   var appointmentButtonStr = '<div class="consultDoctor-recommend-doctor-appointment-button center-block">点我咨询</div>';
//
//   var expertDisease = doctorItem.expertDisease?doctorItem.expertDisease:'暂时没有更多';
//
//   return '<a class="consultDoctor-recommend-doctor-item col-sm-6" href="./doctor/' + doctorItem.id + '" target="_blank">' +
//     '<div class="row">' +
//     '<div class="consultDoctor-recommend-doctor-head-wrap col-xs-3">' +
//     '<img class="consultDoctor-recommend-doctor-head img-responsive center-block" src="' + commonContainer.resourceImageCompression(doctorItem.iconUrl, 78, 78) + '">' +
//     appointmentButtonStr +
//     '</div>' +
//     '<div class="consultDoctor-recommend-doctor-info col-xs-9">' +
//     '<div class="row">' +
//     '<span class="consultDoctor-recommend-doctor-name">' + doctorItem.realName + '</span>' +
//     '<span class="consultDoctor-recommend-doctor-info-title">' + doctorItem.title + '</span>' +
//     '</div>' +
//     '<div class="consultDoctor-recommend-doctor-hospital-wrap row">' +
//     '<span class="consultDoctor-recommend-doctor-department">' + doctorItem.departmentName + '</span>' +
//     '<span class="consultDoctor-recommend-doctor-hospital">' + doctorItem.hospitalName + '</span>' +
//     '</div>' +
//     '<div class="consultDoctor-recommend-doctor-expert-wrap row">' +
//     '<span>擅长：</span>' +
//     '<span class="consultDoctor-recommend-doctor-expert">' + expertDisease + '</span>' +
//     '</div>' +
//     '</div>' +
//     '</div>' +
//     '</a>'
// }
//
// export default block;
