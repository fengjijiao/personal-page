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

function runtranslate() {
    var q = $("#q");
    var from = $("#from");
    var to = $("#to");
    var result = $("#result");
    var submit = $("#submit");
    if (q.val() == '') {
        message('翻译原文不能欸空!', '错误');
    } else if (from.val() == '') {
        message('请先选择原文语言!', '错误');
    } else if (to.val() == '') {
        message('请先选择翻译到的语言!', '错误');
    } else {
        message('请稍等...', '通知');
        datas.isCompleted = true;
        submit.attr('disable', true);
        $.post('https://api.fengjijiao.cn/translate/', {
            q: q.val(),
            from: from.val(),
            to: to.val()
        }, function(d) {
            message('翻译完成!', '完成');
            result.text(d.trans_result[0].dst);
            datas.isCompleted = false;
            submit.attr('disable', false);
        }, "json");
    }
    return;
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