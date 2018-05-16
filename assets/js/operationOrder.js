import $ from 'jquery';
import '../public/js/bootstrap.min'
import './form';

$('.operationOrder-search-button').on('click', function () {
  var searchWord = $('#operationOrderSearch').val();
  window.location.href = `./doctor?query=${encodeURIComponent(searchWord)}&searchType=surgery`
});

// yy-bg-ques-btn
$('.yy-bg-ques-btn').on('click', function (e) {
  console.log('yyyyyyyyy')
  showModal();
  var dcotor = $(e.target).siblings('.yy-banner-card-h3').text();
  var depName = $(e.target).siblings('.yy-banner-card-short').find('span').text();
  var hospitalName = $(e.target).siblings('.yy-banner-card-short').last().text()
  $('#doctorName').val(dcotor);
  $('#hospitalName').val(hospitalName)
  $('#depName').val(depName)
  e.preventDefault();
});

$('.home-yy-shoushu').on('click', function (e) {
  console.log('yyyyyyyyy')
  showModal()
  var $paraent = $(e.target).parent('.bg-ques-card-head')
    .siblings('.bg-ques-card-content')
  var doctorName = $paraent
    .find('.name')
    .text().trim();
  var hospitalName = $paraent.find('.hospitalName').text().trim();
  var depName = $paraent.find('.departmentName').text().trim();
  $('#doctorName').val(doctorName);
  $('#hospitalName').val(hospitalName);
  $('#depName').val(depName);
  e.preventDefault();
});

$('#ques-doctor-btn').on('click',function () {
  $('#queModal').modal().show();

});

$('.home-page-detail').on('click',function () {
  $('#operationModal').modal().show();
})

function showModal(realName, department, hospitalName, e) {
  var evt = e ? e : window.event;
  evt.stopPropagation();
  $('#doctorName').val(realName);
  $('#depName').val(department);
  $('#hospitalName').val(hospitalName);
  $("#operationModal").modal().show()
}


