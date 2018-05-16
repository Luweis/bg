import $ from 'jquery';
import '../public/js/bootstrap.min'
import './form';

$('.operationOrder-search-button').on('click', function () {
  var searchWord = $('#operationOrderSearch').val();
  window.location.href = `./doctor?query=${encodeURIComponent(searchWord)}&searchType=surgery`
});

// yy-bg-ques-btn
$('.yy-bg-ques-btn').on('click', function (e) {

  var doctorName = $(e.target).siblings('.yy-banner-card-h3').text();
  var hospitalName = $(e.target).siblings('.yy-banner-card-short').last().text();
  var depName = $(e.target).siblings('.yy-banner-card-short').find('span').text();
  showModal(doctorName, hospitalName, depName, e);
});

$('.home-yy-shoushu').on('click', function (e) {
  var $paraent = $(e.target).parent('.bg-ques-card-head')
    .siblings('.bg-ques-card-content')
  var doctorName = $paraent
    .find('.name')
    .text().trim();
  var hospitalName = $paraent.find('.hospitalName').text().trim();
  var depName = $paraent.find('.departmentName').text().trim();
  showModal(doctorName, hospitalName, depName, e);
  e.preventDefault();
});

$('#ques-doctor-btn').on('click', function () {
  $('#queModal').modal().show();

});

$('.home-page-detail').on('click', function () {
  $('#operationModal').modal().show();
})

$("#doctor-home-detail").on('click', function (e) {
  var doctorName = $('#docName').text().trim();
  var hospitalName = $('#doc_hospitalName').text().trim();
  var depName = $('#doc_departmentName').text().trim();
    showModal(doctorName, hospitalName, depName, e);
})

function showModal(realName, department, hospitalName, e) {
  var evt = e ? e : window.event;
  evt.preventDefault();
  $('#doctorName').val(realName);
  $('#depName').val(department);
  $('#hospitalName').val(hospitalName);
  $("#operationModal").modal().show()
}


