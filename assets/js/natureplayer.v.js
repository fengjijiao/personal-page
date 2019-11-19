const lite_name = 'natureplayer';
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
    isLoader: true,
};
var vm = new Vue({
    el: '#context',
    data: datas
});
var video = $("video");
var player = videojs('videoplayer', {
    fluid: true
}, function() {
    console.log('视频播放器初始化完成!');
})
player.on('play', function() {
    console.log('开始/恢复播放');
});
player.on('pause', function() {
    console.log('暂停播放');
});
player.on('ended', function() {
    console.log('结束播放');
});
player.on('timeupdate', function() {
    console.log(player.currentTime());
});
if ($(window).width() > 720) {
    var width = $(window).width() / 2.2;
    var height = $(window).width() * 0.618 / 2.2;
} else {
    var width = $(window).width() * 0.9;
    var height = $(window).width() * 0.618;
}
video.attr("width", width);
video.attr("height", height);
refresh_history();
var play_uri = "";
async function generate_screensnape() {
    var scale = 0.6;
    var canvas = document.createElement("canvas");
    canvas.width = video[0].videoWidth * scale;
    canvas.height = video[0].videoHeight * scale;
    canvas.getContext("2d").drawImage(video[0], 0, 0, canvas.width, canvas.height);
    const res = await imageConversion.compressAccurately(dataURLtoBlob(canvas.toDataURL("image/png"), 0.8), 8);
    readBlobAsDataURL(res, function(dataurl) {
        $.post('/api/add_resource', {
            uuid: UUID,
            type: 'natureplayer',
            url: encodeURIComponent(play_uri),
            content: dataurl
        }, function(data) {
            //console.log("响应结果:");
            console.log(data);
        }, "json");
        //console.log("待发送数据:"+encodeURIComponent(encodeURIComponent(dataurl)));
    });
}

function refresh_history() {
    $.post('/api/get_history', {
        type: lite_name,
        uuid: UUID
    }, function(data) {
        var history_list = $("#history_list");
        var history_list_html = "<span style=\"float:right;font-size:9px;\">Identification ID:" + data.unique_id + "</span><br>";
        if (data.type) {
            if (data.count) {
                for (var i = 0; i < data.count; i++) {
                    history_list_html += "\r\n<li class=\"ui\" onclick=\"javascript:input('" + unescape(data.result[i].content) + "','#url');\" id=\"history_" + i + "\">" + data.result[i].content + "</li>";
                }
                let arr = [];
                for (var i = 0; i < data.count; i++) {
                    arr.push(i);
                }
                $.each(arr, function(key, value) {
                    $.post('/api/get_resource', {
                        uuid: UUID,
                        key: encodeURIComponent(data.result[value].content)
                    }, function(data) {
                        if (data.type) {
                            //console.log(decodeURIComponent(decodeURIComponent(data.value)));
                            $("#history_" + value).attr("data-html", "<div class='header'><i class='ui icon video'></i>瞬间</div><div class='content'><img src='" + decodeURIComponent(decodeURIComponent(data.value)).toString() + "' class='ui small image'></div>");
                            $('li[data-html]').popup();
                            $('li[data-html]').popup({
                                hoverable: true,
                                className: {
                                    popup: 'ignored ui popup'
                                }
                            });
                        }
                    }, "json");
                });
            } else {
                history_list_html += "\r\n<li data-html=\"<h1>hellogf</h1>\">无记录!</li>";
            }
        } else {
            history_list_html += "\r\n<li>" + data.msg + "</li>";
        }
        history_list.html(history_list_html);
        datas.isLoader = false;
        $('video').on('loadeddata', function() {
            setTimeout('generate_screensnape();', 5000);
        });
    }, "json");
}

function input(text, ele) {
    return $(ele).val(unescape(text));
}

function runplayer() {
    var uri = $("#url").val();
    if (URLcheck(uri)) {
        //$("source").attr("src",uri);
        changeSource({
            type: "video/mp4",
            src: uri
        });
        player.play();
        play_uri = uri;
        $.post('/api/add_history', {
            type: lite_name,
            uuid: UUID,
            content: uri
        }, function(data) {
            console.log(data);
            refresh_history();
        }, "json");
    } else {
        message('播放地址不规范!', '错误');
    }
}

function URLcheck(url) {
    var status;
    var Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp = new RegExp(Expression);
    if (objExp.test(url)) {
        return 1;
    } else {
        return 0;
    }
}

function message(text, type) {
    $('.message>.header>.title').text(type);
    $('.message>.content>p').text(text);
    $('.ui.basic.modal.message').modal('show');
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

function readBlobAsDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {
        callback(e.target.result);
    };
    a.readAsDataURL(blob);
}

function changeSource(src) {
    player.pause();
    player.currentTime(0);
    player.src(src);
    player.ready(function() {
        this.one('loadeddata', videojs.bind(this, function() {
            this.currentTime(0);
        }));
        this.load();
        this.play();
    });
}