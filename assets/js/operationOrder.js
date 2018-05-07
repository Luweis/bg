import $ from 'jquery';
import '../public/js/bootstrap.min'
import './form';

$('.operationOrder-search-button').on('click', function () {
  var searchWord = $('#operationOrderSearch').val();
  window.location.href = `./doctor?query=${encodeURIComponent(searchWord)}&searchType=surgery`
});

$('.yy-bg-ques-btn').on('click', function (e) {
  showModal();
  e.preventDefault();
});

$('.home-yy-shoushu').on('click', function (e) {
  showModal();
  e.preventDefault();
});

function showModal(realName, department, hospitalName, e) {
  var evt = e ? e : window.event;
  evt.stopPropagation();
  $('#doctorName').val(realName);
  $('#depName').val(department);
  $('#hospitalName').val(hospitalName);
  $("#operationModal").modal().show()
}
