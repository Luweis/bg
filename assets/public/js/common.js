var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?702d4c0afe1c5e6caaf694d124ad5763";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

$(function () {
    var NAR_HEIGHT = 320
    $('.header-menu').click(function () {
        var $nav = $('.header-nav');
        if (!$nav) {
            return;
        }
        if ($nav.is(':hidden')) {
            $nav.show().stop().animate({
                height: NAR_HEIGHT
            }, 500, 'swing');
            return;
        }
        if ($nav.is(':visible')) {
            $nav.stop().animate({
                height: 0
            }, 500, 'swing', function () {
                $nav.hide();
            });
        }
    });

    $('.nav-item, .header-a-logo').on('click', function () {
        var path = $(this).attr('data-url');
        window.location.href = env.siteBaseUrl + path;
        // window.open(env.siteBaseUrl + path, path);
    })
});

var commonContainer = {
    http: function (param) { //{method:'',data:{},url:'',success:function,error:function}
        $.ajax({
            type: param.method ? param.method : 'POST',
            url: env.controllerBaseUrl + param.url,
            data: JSON.stringify(param.data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: param.success,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (typeof param.error === 'function') {
                    param.error(XMLHttpRequest, textStatus, errorThrown);
                    return;
                }
                console.log(XMLHttpRequest, textStatus, errorThrown);
                alert('数据加载失败，请重试。');
            }
        })
    },
    getParam: function (url) {
        var local_url;
        if (url) {
            local_url = url;
        } else {
            local_url = document.location.href;
        }
        var data = local_url.split("?");
        data = data[1];
        var get_data = {};
        if (data) {
            data = data.split("&");
            data.forEach(function (i) {
                var j = i.split("=");
                get_data[j[0]] = decodeURIComponent(j[1]);
            });
        }
        return get_data;
    },
    resourceImageCompression: function (imageUrl, width, height, interfaceValue) {
        interfaceValue = ((interfaceValue === 0) || interfaceValue) ? interfaceValue : 1;
        if (width) {
            imageUrl += '?imageView2/' + interfaceValue + '/w/' + Math.floor(width * 2);
        }
        if (!height) {
            return imageUrl;
        }
        if (imageUrl.indexOf('?') > -1) {
            imageUrl += '/h/' + Math.floor(height * 2);
        } else {
            imageUrl += '?imageView2/' + interfaceValue + '/h/' + Math.floor(height * 2);
        }
        return imageUrl;
    },
    initModelDlg: function (id, width, height, htmlUrl) {
        $(id).html('');
        $.ajax({
            url: htmlUrl,
            data: {},
            type: 'get',
            async: true,
            dataType: 'text',
            success: function (data) {
                $(id).html(data);//先把内容填进去才可以选择获指定的内容
                // initDiv(id, width, height);
            }
        });
    },
    scrollIntoTargetEle: function (containerId, id) {
        $('#' + containerId).stop().animate({scrollTop: $("#"+id).offset().top}, 1000);
    }
};
