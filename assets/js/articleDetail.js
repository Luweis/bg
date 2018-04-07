/**
 * Created by constantine on 2017/7/27.
 */
var articleData = {
    id: '',
    SPECIAL_DOCTOR_ID: 4829
};
$(function () {
    articleData.id = commonContainer.getParam().id;
    queryArticle();
    $('.articleDetail-doctor-more').on('click', function () {
        window.location.href = env.siteBaseUrl + 'view/doctorHomePage.html?id=' + articleData.ownerId;
    });
});

function queryArticle() {
    commonContainer.http({
        data: {id: articleData.id},
        url: 'articleDetail/getArticleDetail',
        success: function (response) {
            var data = response.resultBodyObject;
            document.title = data.title?data.title:'在线咨询医生，快速预约手术，骨健康问题就找布骨医生';
            $('.articleDetail-title').text(data.title);
            $('.articleDetail-introduce').text(data.desc);
            $('.articleDetail-text').html(data.content);
            $('.articleDetail-tagList').html(generateTagListEle(data.tags));
            if (data.ownerId && data.ownerId!=articleData.SPECIAL_DOCTOR_ID) {
                $('.articleDetail-doctor-wrap').show();
                articleData.ownerId = data.ownerId;
                var expertDisease = data.expertDisease?data.expertDisease:'暂无介绍';
                $('.articleDetail-doctor-img').prop('src', commonContainer.resourceImageCompression(data.iconUrl, 78, 78));
                $('.articleDetail-doctor-name').text(data.realName);
                $('.articleDetail-doctor-title').text(data.professionalTitle);
                $('.articleDetail-doctor-hospital').text(data.hospitalName);
                $('.articleDetail-doctor-excel').text(expertDisease);
                $('.articleDetail-doctor-QRCode').prop('src', commonContainer.resourceImageCompression(data.binaryCodeUrl, 88, 88));
                $('.articleDetail-doctor').show();
            }
        }
    })
}

function generateTagListEle (tagsList) {
    var eleStr = '';
    if (tagsList.length === 0) {
        return eleStr;
    }
    for (var i=0;i<tagsList.length;i++) {
        eleStr += '<div class="articleDetail-label">' + tagsList[i] + '</div>'
    }
    return eleStr;
}