/**
 * Created by lenovo on 2017/7/25.
 */
var doctorTypeEnum = {
    surgeryDoctor: 1,
    consultDoctor: 2,
    cooperationDoctor: 3
};

var searchDoctorData = {
    $searchDoctorInput: $('#searchDoctorInput'),
    $doctorListContainer: $('.searchDoctor-doctorList'),
    PAGE_SIZE: 10,
    pageIndex: 1,
    ROW_SIZE:2,
    isLoading: false,
    searchType: {
        consult: [doctorTypeEnum.consultDoctor, doctorTypeEnum.cooperationDoctor],
        surgery: [doctorTypeEnum.surgeryDoctor, doctorTypeEnum.cooperationDoctor]
    },
    doctorTypeList: [],
    totalPage:0
};

$(function () {
    var param = commonContainer.getParam();
    searchDoctorData.doctorTypeList = searchDoctorData.searchType.consult;
    if (param.searchType) {
        searchDoctorData.doctorTypeList = searchDoctorData.searchType[param.searchType];
    }
    searchDoctorData.$searchDoctorInput.val(param.query);
    queryDoctor();

    $('.searchDoctor-search-button').on('click', function () {
        resetQueryCondition();
        // queryDoctor();
    });

    $('.searchDoctor-doctorList').on('click', '.searchDoctor-doctor-item', function () {
        window.location.href = env.siteBaseUrl + 'view/doctorHomePage.html?id=' + encodeURIComponent($(this).attr('data-id'));
    });

    $('.searchDoctor-pagination-button-next').on('click', function () {
        searchDoctorData.pageIndex++;
        changePaginationStatus();
    });

    $('.searchDoctor-pagination-button-prev').on('click', function () {
        searchDoctorData.pageIndex--;
        changePaginationStatus();
    });

    $('.searchDoctor-pagination-pageNumberList').on('click', 'span', function () {
        try {
           searchDoctorData.pageIndex = $(this).text();
            changePaginationStatus();
        } catch (e) {
            console.log(e)
        }
    })
});

function onEnterKeyDown (event) {
    var e = event || window.event;
    if (e.keyCode === 13) {
        resetQueryCondition();
    }
}

function queryDoctor() {
    commonContainer.http({
        data: {
            pageSize: searchDoctorData.PAGE_SIZE,
            pageIndex: searchDoctorData.pageIndex,
            query: searchDoctorData.$searchDoctorInput.val(),
            doctorTypeList: searchDoctorData.doctorTypeList
        },
        url: 'SearchDoctorController/queryDoctor',
        success: function (response) {
            var doctorList = response.resultBodyObject.rows;
            var total = response.resultBodyObject.total;
            showSearchResultCount(total);
            initPagination(total);
            if (doctorList.length === 0) {
                return;
            }
            var onePageEleStr = generateOnePageEleStr(doctorList);
            searchDoctorData.$doctorListContainer.empty();
            searchDoctorData.$doctorListContainer.append(onePageEleStr)
        }
    })
}

function resetQueryCondition() {
    window.location.search = 'query=' + encodeURIComponent(searchDoctorData.$searchDoctorInput.val())+'&searchType='+commonContainer.getParam().searchType;
    searchDoctorData.pageIndex = 1;
    if ($('#searchDoctorPagination').is(':hidden')) {
        $('#searchDoctorPagination').show();
    }
}

function generateDoctorItemStr (doctor) {
    return '<div class="searchDoctor-doctor-item col-sm-6" data-id="' + doctor.id + '">' +
        '<div class="row">' +
        '<div class="searchDoctor-doctor-head-wrap col-xs-3 center-block">' +
        '<img class="searchDoctor-doctor-head img-responsive" src="' + commonContainer.resourceImageCompression(doctor.iconUrl, 78, 78) + '">' +
        '</div>' +
        '<div class="searchDoctor-doctor-info col-xs-9">' +
        '<div>' +
        '<span class="searchDoctor-doctor-name">' + doctor.realName + '</span>' +
        '<span class="searchDoctor-doctor-title">' + doctor.title + '</span>' +
        '</div>' +
        '<div class="searchDoctor-doctor-hospital-wrap">' +
        '<span class="searchDoctor-doctor-department">' + doctor.departmentName + '</span>' +
        '<span class="searchDoctor-doctor-hospitalName">' + doctor.hospitalName + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
}

function generateOneRowEleStr (oneRowDoctorList) {
    var eleStr = '';
    for (var i=0;i<oneRowDoctorList.length;i++) {
        eleStr += generateDoctorItemStr(oneRowDoctorList[i]);
    }
    return '<div class="searchDoctor-doctor-row row">' + eleStr + '</div>';
}

function generateOnePageEleStr (onePageDoctorList) {
    var eleStr = '';
    while (onePageDoctorList.length > 0) {
        var onRowDoctorList = onePageDoctorList.splice(0, searchDoctorData.ROW_SIZE);
        eleStr += generateOneRowEleStr(onRowDoctorList);
    }
    return eleStr;
}

function showSearchResultCount(total) {
    var $tip = $('.searchDoctor-search-result-tip');
    $tip.text('布骨医生为您找到相关结果' + total + '个');
}

function initPagination (total) {
    var totalPage = Math.ceil(total/searchDoctorData.PAGE_SIZE);
    searchDoctorData.totalPage = totalPage;
    if (totalPage < 2) {
        $('.searchDoctor-pagination').hide();
    }
    var index = parseInt(searchDoctorData.pageIndex);
    var eleStr = '';
    var startNum = 1;
    var endNum = totalPage>10?10:totalPage;

    if (totalPage > 10 && (index > (totalPage-10))) {
        startNum = totalPage-9;
        endNum = totalPage;
    }

    if (totalPage > 10 && (index < (totalPage-10)) && index > 5) {
        startNum = index-4;
        endNum = index + 4;
    }

    for (var i=startNum;i<endNum+1;i++) {
        eleStr += '<span class="pageNumber-' + i + '">' + i + '</span>';
    }

    $('.searchDoctor-pagination-pageNumberList').empty().append(eleStr);
    $('.pageNumber-' + searchDoctorData.pageIndex).addClass('pageNumber-active');
}

function changePaginationStatus () {
    var $activeEle = $('.pageNumber-active');
    var index = searchDoctorData.pageIndex;
    if ($activeEle) {
        $activeEle.removeClass('pageNumber-active');
    }
    $('.pageNumber-' + index).addClass('pageNumber-active');

    if (index === 1) {
        $('.searchDoctor-pagination-button-prev').hide();
    } else {
        $('.searchDoctor-pagination-button-prev').show();
    }

    if (index === searchDoctorData.totalPage) {
        $('.searchDoctor-pagination-button-next').hide();
    } else {
        $('.searchDoctor-pagination-button-next').show();
    }

    queryDoctor();
}