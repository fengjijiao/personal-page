document.oncontextmenu = function(event) {
    if (window.event) {
        event = window.event;
    }
    try {
        var the = event.srcElement;
        if (!((the.tagName.toLowerCase() == "input" && the.type.toLowerCase() == "url") || the.tagName.toLowerCase() == "textarea" || the.tagName.toLowerCase() == "input")) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
} //屏蔽右键菜单
document.onpaste = function(event) {
    if (window.event) {
        event = window.event;
    }
    try {
        var the = event.srcElement;
        if (!((the.tagName.toLowerCase() == "input" && the.type.toLowerCase() == "url") || the.tagName.toLowerCase() == "textarea" || the.tagName.toLowerCase() == "input")) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
} //屏蔽粘贴
document.oncopy = function(event) {
    if (window.event) {
        event = window.event;
    }
    try {
        var the = event.srcElement;
        if (!((the.tagName.toLowerCase() == "input" && the.type.toLowerCase() == "url") || the.tagName.toLowerCase() == "textarea" || the.tagName.toLowerCase() == "input")) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
} //屏蔽复制
document.oncut = function(event) {
    if (window.event) {
        event = window.event;
    }
    try {
        var the = event.srcElement;
        if (!((the.tagName.toLowerCase() == "input" && the.type.toLowerCase() == "url") || the.tagName.toLowerCase() == "textarea" || the.tagName.toLowerCase() == "input")) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
} //屏蔽剪切
document.onselectstart = function(event) {
    if (window.event) {
        event = window.event;
    }
    try {
        var the = event.srcElement;
        if (!((the.tagName.toLowerCase() == "input" && the.type.toLowerCase() == "url") || the.tagName.toLowerCase() == "textarea" || the.tagName.toLowerCase() == "input")) {
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
} //屏蔽选择
var datas = {
    isCompleted: false
};
var vm = new Vue({
    el: '#context',
    data: datas
});
var ele_generate = $("#generate");
var ele_searchcode = $("#searchcode");
var input_content = $("#content");
var input_gdate = $("#g_date");
var input_sharekey = $("#share_key");
input_gdate.val(getGdate());

function generate() {
    datas.isCompleted = true;
    $("#running").attr("disabled", true);
    var content = input_content.val();
    if (content == '') {
        $("#running").html("生成");
        datas.isCompleted = false;
        $("#running").attr("disabled", false);
        message('输入的内容不能为空!', '错误');
    } else {
        var apiurl = "/api/transmit";
        $.post(apiurl, {
            action: 'generate',
            content: Base64.encodeURI(pako.gzip(Base64.encodeURI(content),{ to: 'string' }))
        }, function(data) {
            if (data.type >= 1) {
                ele_searchcode.html("<span style='float:right;font-size:9px;'>Identification ID:" + data.unique_id + "</span><div class=\"ui list\"><div class=\"item\"><div class=\"header\">分享码</div>" + data.share_key.substring(8) + "</div><div class=\"item\"><div class=\"header\">生成日期</div>" + data.share_key.substring(0, 8) + "</div><div class=\"item\"><div class=\"header\">完整分享码</div>" + data.share_key + "</div></div>");
                message('已产生唯一分享码!', '成功');
            } else {
                message(data.msg, '失败');
            }
            $("#running").html("生成");
            datas.isCompleted = false;
            $("#running").attr("disabled", false);
        }, "json");
    }
}

function searchcode() {
    datas.isCompleted = true;
    $("#searching").attr("disabled", true);
    var search_code = input_gdate.val() + input_sharekey.val();
    if (search_code == '') {
        $("#searching").html("搜寻");
        $("#searching").attr("disabled", false);
        message('输入的内容不能为空!', '错误');
    } else {
        var apiurl = "/api/transmit";
        $.post(apiurl, {
            action: 'searchcode',
            sharekey: search_code
        }, function(data) {
            if (data.type >= 1) {
                ele_generate.html("<span style='float:right;font-size:9px;'>Identification ID:" + data.unique_id + "</span><br><div class=\"ui form\"><div class=\"field\"><label><i class=\"info icon\"></i>内容</label><textarea>" + Base64.decode(pako.ungzip(Base64.decode(data.content), { to: 'string' })) + "</textarea></div></div>");
                message('已找到信息!', '成功');
            } else {
                message(data.msg, '失败');
            }
            $("#searching").html("搜寻");
            datas.isCompleted = false;
            $("#searching").attr("disabled", false);
        }, "json");
    }
}

function message(text, type) {
    $('.message>.header>.title').text(type);
    $('.message>.content>p').text(text);
    $('.ui.basic.modal.message').modal('show');
}

function getGdate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return date.getFullYear() + month + strDate;
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
    return currentdate;
}