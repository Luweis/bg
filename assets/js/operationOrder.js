/**
 * Created by duyilun on 2017/7/25.
 */
/**
 * Created by lenovo on 2017/7/24.
 */
var operationOrderData = {
    PAGE_SIZE: 30,
    ONE_PAGE_COUNT: 6,
    ONE_ROW_COUNT: 2,
    $operationOrderSearch: $('#operationOrderSearch')
};

$(function () {
    getAppointmentRecommendDoctor();
    commonContainer.initModelDlg("#operationOrderForm", 400, 400, 'operationOrderForm.html');

    $('.operationOrder-search-button').on('click', function () {
        var searchWord = operationOrderData.$operationOrderSearch.val();
        /*if (!searchWord) {
         return;
         }*/
        window.location.href = env.siteBaseUrl + 'view/searchDoctor.html?query=' + encodeURIComponent(searchWord) + '&searchType=surgery';
    });
    $('.operationOrder-book-button').on('click', function () {
        showModal();
    });

    $('.swiper-wrapper').on('click', '.operationOrder-recommend-doctor-item', function () {
        var id = $(this).attr('data-id');
        window.open(env.siteBaseUrl + 'view/doctorHomePage.html?id=' + id);
    })
});

function getAppointmentRecommendDoctor() {
    commonContainer.http({
        data: {pageSize: operationOrderData.PAGE_SIZE},
        url: 'operationOrderController/getConsultDoctor',
        success: function (response) {
            var doctorList = response.resultBodyObject.rows;
            if (doctorList.length === 0) {
                return;
            }
            appendDoctorList(doctorList);
            var operationOrderSwiper = new Swiper('.operationOrder-recommend-doctor', {
                pagination: '.operationOrder-swiper-pagination',
                paginationClickable: true
            })
        }
    })
}

function appendDoctorList(doctorList) {
    var allPageStr = '';

    while (doctorList.length > 0) {
        var onePageList = doctorList.splice(0, operationOrderData.ONE_PAGE_COUNT);
        allPageStr += generateOnePageEleStr(onePageList);
    }

    $('#operationOrderSwiperWrapper').append(allPageStr);
}

function generateOnePageEleStr(onePageList) {
    var onePageRowStr = '';

    while (onePageList.length > 0) {
        var onRowList = onePageList.splice(0, operationOrderData.ONE_ROW_COUNT);
        onePageRowStr += generateOneRowEleStr(onRowList);
    }

    return '<div class="swiper-slide">' + onePageRowStr +
        '</div>';
}

function generateOneRowEleStr(onRowList) {
    var oneRowStr = '';

    for (var i = 0; i < onRowList.length; i++) {
        oneRowStr += generateDoctorItem(onRowList[i]);
    }

    return '<div class="operationOrder-recommend-doctor-row row">' + oneRowStr +
        '</div>'
}

function generateDoctorItem(doctorItem) {
    var appointmentButtonStr = '';
    if (doctorItem.doctype !== 2) {
        appointmentButtonStr = '<div class="operationOrder-recommend-doctor-appointment-button center-block" onclick="showModal(\'' + doctorItem.realName +'\',\'' + doctorItem.departmentName +'\',\'' + doctorItem.hospitalName + '\')">预约手术</div>';
    }

    var expertDisease = doctorItem.expertDisease ? doctorItem.expertDisease : '暂时没有更多';

    return '<div class="operationOrder-recommend-doctor-item col-sm-6" data-id="' +　doctorItem.id +　'">' +
        '<div class="row">' +
        '<div class="operationOrder-recommend-doctor-head-wrap col-xs-3">' +
        '<img class="operationOrder-recommend-doctor-head img-responsive center-block" src="' + commonContainer.resourceImageCompression(doctorItem.iconUrl, 78, 78) + '">' +
        appointmentButtonStr +
        '</div>' +
        '<div class="operationOrder-recommend-doctor-info col-xs-9">' +
        '<div class="row">' +
        '<span class="operationOrder-recommend-doctor-name">' + doctorItem.realName + '</span>' +
        '<span class="operationOrder-recommend-doctor-info-title">' + doctorItem.title + '</span>' +
        '</div>' +
        '<div class="operationOrder-recommend-doctor-hospital-wrap row">' +
        '<span class="operationOrder-recommend-doctor-department">' + doctorItem.departmentName + '</span>' +
        '<span class="operationOrder-recommend-doctor-hospital">' + doctorItem.hospitalName + '</span>' +
        '</div>' +
        '<div class="operationOrder-recommend-doctor-expert-wrap row">' +
        '<span>擅长：</span>' +
        '<span class="operationOrder-recommend-doctor-expert">' + expertDisease + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
}

function showModal(realName, department, hospitalName, e) {
    var evt = e?e:window.event;
    evt.stopPropagation();
    clearForm();
    $('#doctorName').val(realName);
    $('#depName').val(department);
    $('#hospitalName').val(hospitalName);
    $("#operationModal").modal("show");
}