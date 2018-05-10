import $ from 'jquery';
import '../public/js/bootstrap.min'
import './form';

$('.operationOrder-search-button').on('click', function () {
  var searchWord = $('#operationOrderSearch').val();
  window.location.href = `./doctor?query=${encodeURIComponent(searchWord)}&searchType=surgery`
});

// yy-bg-ques-btn
$('.yy-bg-ques-btn').on('click', function (e) {
  showModal();
  var val = $(e.target).siblings('.yy-banner-card-h3').text();
  $('#doctorName').val(val);
  e.preventDefault();
});

$('.home-yy-shoushu').on('click', function (e) {
  showModal();
  var val = $(e.target).parent('.bg-ques-card-head')
    .siblings('.bg-ques-card-content')
    .find('.name')
    .text();
  $('#doctorName').val(val);
  e.preventDefault();
});

$('#ques-doctor-btn').on('click',function () {
  $('#queModal').modal().show();
});

function showModal(realName, department, hospitalName, e) {
  var evt = e ? e : window.event;
  evt.stopPropagation();
  $('#doctorName').val(realName);
  $('#depName').val(department);
  $('#hospitalName').val(hospitalName);
  $("#operationModal").modal().show()
}
