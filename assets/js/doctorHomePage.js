/**
 * Created by duyilun on 2017/7/25.
 */

var doctorHomePageData = {
    realName: '',
    department: '',
    hospitalName: ''
};

$(function () {
    commonContainer.initModelDlg("#orderForm", 400, 400, 'operationOrderForm.html');
    initDate();
});

function initDate() {
    var docId = commonContainer.getParam().id;
    if (!docId) {
        docId = 271;
    }
    commonContainer.http({
        url: 'doctorHomePageController/initDoctorData',
        data: {
            docId: docId
        },
        success: function (response) {
            var doctorDetail = response.resultBodyObject.doctorDetail;
            var relatedDocotrs = response.resultBodyObject.relatedDocotrs;
            var articleList = response.resultBodyObject.articles;
            console.log(response.resultBodyObject);
            $("#doc_iconUrl").attr('src', doctorDetail.iconUrl);
            if (doctorDetail.doctorType == "手术预约医生") {
                $("#doc_iconUrl").after("<div class='doctorHomePage-details-button-operation' onclick='showModal()'>手术预约</div>");
            }
            doctorHomePageData.realName = doctorDetail.realName;
            $("#docName").html(doctorDetail.realName);
            $("#docTitle").html(doctorDetail.title);
            doctorHomePageData.department = doctorDetail.departmentName;
            $("#doc_departmentName").html(doctorDetail.departmentName ? doctorDetail.departmentName : "暂无");
            doctorHomePageData.hospitalName = doctorDetail.hospitalName;
            $("#doc_hospitalName").html(doctorDetail.hospitalName ? doctorDetail.hospitalName : "暂无");
            $("#doc_hospitalSchedule").html(doctorDetail.hospitalSchedule ? doctorDetail.hospitalSchedule : "暂无");
            $("#doc_netSchedule").html(doctorDetail.netSchedule ? doctorDetail.netSchedule : "暂无");
            if (doctorDetail.doctorType == "咨询医生" && doctorDetail.binaryCodeUrl) {
                $('.doctorHomePage-qrcode-wrap').show();
                $("#doc_binaryCodeUrl").attr('src', doctorDetail.binaryCodeUrl);
            }
            $("#doc_desc").html(doctorDetail.desc ? doctorDetail.desc : "暂无");
            $("#doc_expertDisease").html(doctorDetail.expertDisease ? doctorDetail.expertDisease : "暂无");

            handleRelatedDoctor(relatedDocotrs);
            showArticleList(articleList);
        }
    });
}

function handleRelatedDoctor(dataArray) {
    $.each(dataArray, function (i, item) {
        $(".related-doctor").after("<div class='col-sm-9 col-sm-offset-3 doctorHomePage-padding-xs-0' onclick='reloadDoctorData(" + item.id + ")'><div class='doctorHomePage-related-doctor-list clearfix'>" +
            "<img src='" + item.iconUrl + "' class='doctorHomePage-related-doctor-list-img'/>" +
            "<div class='col-xs-9'>" +
            "<div class='row margin-left-5'>" +
            "<span class='doctorHomePage-list-doctor-name'>" + item.realName + "</span>" +
            "<span class='doctorHomePage-list-doctor-title'>" + item.title + "</span></div>" +
            "<div class='row doctorHomePage-list-doctor-dep'>" +
            "<span>" + item.departmentName + "</span>" +
            "<span class='margin-left-5'>" + item.hospitalName + "</span>" +
            "</div></div></div></div>"
        );
    });
}

function showArticleList(dataArray) {
    if (!dataArray || (dataArray && dataArray.length===0)) {
        $('.text-introduce:last').hide();
        return;
    }
    $.each(dataArray, function (i, item) {
        $(".text-introduce:last").after("<a href='articleDetail.html?id=" + item.id + "' class='col-sm-12 text-introduce-content'>.《" + item.title + "》</a>");
    });

}

function reloadDoctorData(docId) {
    window.location.href = env.siteBaseUrl + 'view/doctorHomePage.html?id=' + encodeURIComponent(docId);
}

function showModal() {
    clearForm();
    $('#doctorName').val(doctorHomePageData.realName);
    $('#depName').val(doctorHomePageData.department);
    $('#hospitalName').val(doctorHomePageData.hospitalName);
    $("#operationModal").modal("show");
}