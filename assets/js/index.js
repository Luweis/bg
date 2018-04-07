import '../css/index.css';
import '../css/common/common.css';
import '../public/css/bootstrap.min.css';
import '../css/common/swiper-3.4.1.min.css'

import '../public/js/common';
import '../public/js/bootstrap.min';
import '../public/js/swiper-3.4.1.jquery.min';
import '../config/env';


var lastArticleCreateTimestamp = 0;
var ARTICLE_PAGE_SIZE = 7;
var DOCTOR_PAGE_SIZE = 10;
var articleIsQuerying = false;

$(function () {
    getBannerResource();
    queryArticle();
    getRecommendDoctor();
    $('.index-article-loadMore-button').on('click', function () {
        queryArticle();
    });
    $('.index-article-list').on('click','.index-article', function () {
        window.open(env.siteBaseUrl+'view/articleDetail.html?id=' + $(this).attr('data-id'));
    });
    $('.index-recommend-doctor-list').on('click', '.index-recommend-doctor', function () {
        var id = $(this).attr('data-id');
        window.open(env.siteBaseUrl + 'view/doctorHomePage.html?id=' + id);
    });
    $('.index-banner-right-item').on('click', function () {
        var path = $(this).attr('data-url');
        window.location.href = env.siteBaseUrl + path;
    })
});

function getBannerResource() {
    commonContainer.http({
        url: 'index/getBannerResources',
        success: function (response) {
            var data = response.resultBodyObject;
            if (data.length === 0) {
                return;
            }
            var eleStr = '';
            for (var i = 0; i < data.length; i++) {
                eleStr += generateSwiperItem(data[i]);
            }
            $('#indexSwiperWrapper').html(eleStr);
            var indexSwiper = new Swiper('.index-banner-swiper', {
                autoplay: 5000, //可选选项，自动滑动
                pagination: '.index-swiper-pagination',
                paginationClickable: true,
            });
        }
    })
}

function generateSwiperItem(bannerResource) {
    return '<div class="swiper-slide">' +
        '<img src="' + bannerResource.resourceUrl + '" alt="">' +
        '</div>'
}

function queryArticle() {
    if (articleIsQuerying) {
        return ;
    }
    articleIsQuerying = true;
    changeLoadMoreButtonStyle();
    commonContainer.http({
        url: 'index/queryArticleList',
        data: {
            pageSize: ARTICLE_PAGE_SIZE,
            lastArticleCreateTimestamp: lastArticleCreateTimestamp
        },
        success: function (response) {
            var articleList = response.resultBodyObject.rows;
            if (articleList.length === 0) {
                $('.index-article-loadMore-button').text('暂无更多数据');
                return;
            }
            lastArticleCreateTimestamp = articleList[articleList.length-1].createTimestamp;
            var eleStr = '';
            for (var i = 0; i < articleList.length; i++) {
                eleStr += generateArticleItem(articleList[i]);
            }
            $('.index-article-list').append(eleStr);
            articleIsQuerying = false;
            changeLoadMoreButtonStyle();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
            articleIsQuerying = false;
            changeLoadMoreButtonStyle();
        }
    })
}

function generateArticleItem(article) {
    var tagEle = article.tag ? '<div class="index-article-tag">' + article.tag + '</div>' : '';
    return '<div class="index-article row" data-id="' + article.id + '">' +
        '<div class="index-article-pic-wrap col-xs-4">' +
        '<img class="index-article-pic img-responsive" src="' + article.thumbnailUrl + '">' +
        tagEle +
        '</div>' +
        '<div class="index-article-text col-xs-8">' +
        '<div class="index-article-title">' +
        article.title +
        '</div>' +
        '<div class="index-article-desc">' +
        article.desc +
        '</div>' +
        '<div class="index-article-info">' +
        '<span>' + article.author + '</span>' +
        '<div class="index-article-readCount">' +
        '<span>阅读：</span>' +
        '<span>' + article.readCount + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function getRecommendDoctor() {
    commonContainer.http({
        url: 'index/queryRecommendDoctor',
        data: {
            pageSize: DOCTOR_PAGE_SIZE
        },
        success: function (response) {
            var doctorList = response.resultBodyObject.rows;
            if (doctorList.length === 0) {
                return;
            }
            var eleStr = '';
            for (var i = 0; i < doctorList.length; i++) {
                eleStr += generateDoctorItem(doctorList[i]);
            }
            $('.index-recommend-doctor-list').append(eleStr);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest, textStatus, errorThrown);
        }
    })
}

function generateDoctorItem(doctor) {
    return '<div class="index-recommend-doctor row" data-id="' + doctor.id + '">' +
        '<div class="index-recommend-doctor-head-wrap col-xs-2">' +
        '<img class="index-recommend-doctor-head img-responsive" src="' + commonContainer.resourceImageCompression(doctor.iconUrl, 50, 50) + '">' +
        '</div>' +
        '<div class="index-recommend-doctor-info col-xs-10">' +
        '<p class="index-recommend-doctor-title">' +
        '<span class="index-recommend-doctor-name">' + doctor.realName + '</span>' +
        '<span class="margin-left-10">' + doctor.title + '</span>' +
        '</p>' +
        '<p class="index-recommend-doctor-form">' +
        '<span>' + doctor.departmentName + '</span>' +
        '<span class="margin-left-10">' + doctor.hospitalName + '</span>' +
        '</p>' +
        '</div>' +
        '</div>'
}

function changeLoadMoreButtonStyle () {
    $('.index-article-loadMore-button').text(articleIsQuerying?'正在加载...':'浏览更多')
}
