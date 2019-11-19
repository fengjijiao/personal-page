var datas = {
    isError: false,
    isLoading: false,
    oncheck: 0,
    username: ''
};
var vm = new Vue({
    el: 'form',
    data: datas
});
$(document).ready(function() {
    $('.ui.form').form({
        fields: {
            username: {
                identifier: 'username',
                rules: [{
                    type: 'regExp[/^[a-zA-z][a-zA-Z0-9_]{4,16}$/]',
                    prompt: '请输入5-16位的自定义用户名,且以字母开头,仅包含字母数字下划线!'
                }]
            },
            terms: {
                identifier: 'terms',
                rules: [{
                    type: 'checked',
                    prompt: '登记需要同意隐私策略!'
                }]
            }
        }
    });
});

function check(t) {
    if (t.value == '') {
        return;
    }
    datas.isLoading = true;
    $.post("/api/check_info", {
        type: 'username',
        content: t.value
    }, function(data) {
        datas.isLoading = false;
        //console.log(data);
        if (data.type) {
            datas.oncheck = 1;
            datas.isError = true;
            $(".ui.error.message").html("<ul class=\"list\"><li>" + data.msg + "</li></ul>");
            $(".ui.error.message").attr('style', 'display:block;');
        } else {
            datas.isError = false;
            if (datas.oncheck) {
                //console.log('ok');
                $(".ui.error.message").html("");
                $(".ui.error.message").attr('style', '');
                datas.oncheck = 0;
            }
        }
    }, "json");
    //console.log(datas.oncheck);
}

function signup() {
    datas.isLoading = true;
    $.post("/api/signup", {
        'username': datas.username,
        'uuid': UUID
    }, function(data) {
        if (data.type) {
            message(data.msg, '成功');
            add_user_information({
                username: datas.username
            });
            var blob = new Blob([data.uuids], {
                type: "text/plain;charset=utf-8"
            });
            saveAs(blob, "ifeng-auth.af");
            datas.isLoading = false;
            $("form").html("<div class=\"ui info message\"><i class=\"close icon\" onclick=\"javascript:$(this).parent().hide();\"></i>\r\n<div class=\"header\">登记成功</div><ul class=\"list\">\r\n<li>请下载载入文件,用于下次载入!</li>\r\n<li>载入文件是唯一登记凭证,不提供找回!</li>\r\n<li><a href=\"javascript:top.location=store.get('page_referer_uri');\">返回</a></li>\r\n<li><a href=\"javascript:top.location='\/';\">返回首页</a></li>\r\n</ul>\r\n</div>");
            //top.location=(document.referrer==null) ? document.referrer:'/';
        } else {
            message(data.msg, '错误');
            datas.isLoading = false;
        }
        //console.log(data);
    }, "json");
    return false;
}

function message(text, type) {
    $('.message>.header>.title').text(type);
    $('.message>.content>p').text(text);
    $('.ui.basic.modal.message').modal('show');
}

function count(o) {
    var t = typeof o;
    if (t == 'string') {
        return o.length;
    } else if (t == 'object') {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    }
    return false;
}