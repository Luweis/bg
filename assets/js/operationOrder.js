import $ from 'jquery';
import '../public/js/bootstrap.min'
import './form';

var operationOrderData = {
    PAGE_SIZE: 30,
    ONE_PAGE_COUNT: 6,
    ONE_ROW_COUNT: 2,
    $operationOrderSearch: $('#operationOrderSearch')
};

$(function () {

    $('.operationOrder-search-button').on('click', function () {
        var searchWord = operationOrderData.$operationOrderSearch.val();
        window.location.href = `./doctor/search?query=${encodeURIComponent(searchWord)}&searchType=surgery`
    });

    $('.bg-ques-btn').on('click', function (e) {
        showModal();
      e.preventDefault();
    });

});



function showModal(realName, department, hospitalName, e) {
    var evt = e?e:window.event;
    evt.stopPropagation();
    // clearForm();
    $('#doctorName').val(realName);
    $('#depName').val(department);
    $('#hospitalName').val(hospitalName);
    $("#operationModal").modal().show()
}
