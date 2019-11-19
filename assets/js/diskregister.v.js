console.log("v0.4.14.11");
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
    isUploadActive: true,
    isResultActive: false,
    isUploadCompleted: false,
    isResultCompleted: false,
    isSearchUnCompleted: false
};
var vm = new Vue({
    el: '#context',
    data: datas
});

var xhrOnProgress = function(fun) {
    xhrOnProgress.onprogress = fun; //绑定监听
    //使用闭包实现监听绑
    return function() {
        //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
        var xhr = $.ajaxSettings.xhr();
        //判断监听函数是否为函数
        if (typeof xhrOnProgress.onprogress !== 'function') return xhr;
        //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
    }
};
var inputs = document.querySelectorAll('.file-input');
for (var i = 0, len = inputs.length; i < len; i++) {
    customInput(inputs[i]);
}

function customInput(el) {
    const fileInput = el.querySelector('[type="file"]')
    const label = el.querySelector('[data-js-label]')
    fileInput.onchange = fileInput.onmouseout = function() {
        if (!fileInput.value) return
        var value = fileInput.value.replace(/^.*[\\\/]/, '')
        el.className += ' -chosen'
        label.innerText = value
        uploader();
    }
}

function uploader() {
    var selectedFile = document.querySelector("input[type=file]").files[0]; //获取读取的File对象
    var name = selectedFile.name; //读取选中文件的文件名
    var size = selectedFile.size; //读取选中文件的大小
    var filetype;
    console.log("文件名:" + name + "大小：" + size);
    if (selectedFile.type == '') {
        filetype = 'application/octet-stream';
    } else {
        filetype = selectedFile.type;
    }
    console.log("文件mime類型：" + filetype);
    // 创建一个FileReader对象
    var reader = new FileReader();
    // 绑定load事件
    reader.onload = function(e) {
        console.log(escape(reader.result));
        //$("#Upload").hide();
        datas.isUploadActive = false;
        datas.isUploadCompleted = true;
        $("#Upload").html('<div class="ui teal progress" id="uploadprogress" data-percent="6">\r\n<div class="bar"></div>\r\n</div>');
        $('#uploadprogress').progress();
        var DocumentGUID = guid();
        console.log(reader.result);
        var DocumentContent = Base64.decode(reader.result.substring((reader.result.indexOf('base64,') + 7), reader.result.length));
        console.log("解碼後:" + DocumentContent);
        var ContentBody = reader.result + ";name:" + Base64.encode(name) + ";size:" + Base64.encode(size) + ";";
        var ContentMd5 = md5(ContentBody);
        $.ajax({
            url: 'https://api.fengjijiao.cn/register-upload/',
            type: 'POST',
            data: {
                ContentHead: ContentMd5,
                ContentBody: ContentBody
            },
            dataType: 'json',
            xhr: xhrOnProgress(function(e) {
                var percent = Math.ceil((e.loaded / e.total) * 100); //计算百分比
                console.log(percent);
                $('#uploadprogress').progress({
                    percent: percent
                });
            }),
            success: function(data) {
                if (data.type && data.status_code == 200) {
                    $("#Upload").hide();
                    datas.isResultActive = true;
                    $("#Result").html("<span style='float:right;font-size:9px;'>Identification ID:" + data.request_id + "</span><br><div class=\"ui form\">\r\n<div class=\"field\">\r\n<label class=\"muti-color\">唯一识别码</label>\r\n<input type=\"text\" value=\"" + ContentMd5 + "\">\r\n</div>\r\n</div>");
                } else {
                    message('上传文件出现错误!', '错误');
                }
            }
        });
    }
    // 读取File对象的数据
    //reader.readAsText(selectedFile,"GBK");
    //reader.readAsBinaryString(selectedFile);
    reader.readAsDataURL(selectedFile);
}

function SearchReset() {
    $("#SearchBox").html("<button onclick=\"javascript:SearchDocument();\" class=\"ui submit button\" v-bind:class=\"{'loading': isSearchUnCompleted}\" id=\"searching\">搜寻</button>");
    $("button#searching").val('');
    //$("button#searching").on("click",SearchDocument);
}

function SearchDocument() {
    datas.isSearchUnCompleted = true;
    $("#searching").text('搜寻中');
    var guid = $("#g_guid").val();
    $.get("https://storage.fengjijiao.cn/register/" + guid, function(data, status) {
        var ResultStatus = data.substring(0, 4);
        //alert(data.substring(0,4));
        if (ResultStatus == "data") {
            var DocumentContent = Base64.decode(data.substring((data.indexOf('base64,') + 7), (data.indexOf(';name:'))));
            console.log("文档内容:" + DocumentContent);
            var DocumentName = Base64.decode(data.substring((data.indexOf(';name:') + 6), (data.indexOf(';size:'))));
            console.log("文档名:" + DocumentName);
            var DocumentSize = Base64.decode(data.substring((data.indexOf(';size:') + 6), (data.length - 1)));
            console.log("文档大小:" + DocumentSize + "B");
            var DocumentType = data.substring((data.indexOf('data:') + 5), (data.indexOf(';base64,')));
            console.log("文档mime:" + DocumentType);
            message('已找到该文件!', '成功');
            //构造html特性下载
            $("button#searching").off("click");
            console.log("文件dataURI:" + data.substring(0, data.indexOf(';name:')));
            $("#SearchBox").html("<a href=\"" + data.substring(0, data.indexOf(';name:')) + "\" target=\"_blank\" download=\"" + DocumentName + "\" class=\"ui submit button\">下載</a>\r\n<a onclick=\"javascript:SearchReset();\" class=\"ui submit button\">重置</a>");
            if ((store.get('user_information').settings_autodownload != null) ? (store.get('user_information').settings_autodownload) : 0) {
                var a = document.createElement('a');
                //var url = window.URL.createObjectURL(new Blob([DocumentContent], {type: DocumentType}));
                //data.substring(0,data.indexOf(';name:'))
                var filename = DocumentName;
                a.href = data.substring(0, data.indexOf(';name:'));
                a.download = filename;
                a.target = "_blank";
                a.click();
                a.remove();
                //window.URL.revokeObjectURL(url);
                //使用外置API,blob失真,已测试可用于english纯文本
                //var blob=new Blob([DocumentContent], {type: DocumentType+";charset=utf-8"});
                //var blob=new Blob([DocumentContent], {type: DocumentType});
                //console.log(blob);
                //saveAs(blob, guid+GetSuffix(DocumentType));
            }
        } else {
            message('未能找到该文件!', '错误');
            SearchReset();
        }
        datas.isSearchUnCompleted = false;
    });
}

function GetSuffix(type) {
    if (Issubstr(type, 'text/plain')) {
        return '.txt';
    } else if (Issubstr(type, 'image/jpeg')) {
        return '.jpeg';
    } else if (Issubstr(type, 'text/html')) {
        return '.html';
    } else if (Issubstr(type, 'application/zip')) {
        return '.zip';
    } else if (Issubstr(type, 'audio/mpeg')) {
        return '.mp3';
    } else if (Issubstr(type, 'application/msword')) {
        return '.doc';
    } else if (Issubstr(type, 'application/pdf')) {
        return '.pdf';
    } else if (Issubstr(type, 'image/svg+xml')) {
        return '.svg';
    } else if (Issubstr(type, 'application/x-tar')) {
        return '.tar';
    } else if (Issubstr(type, 'application/vnd.ms-excel')) {
        return '.xls';
    } else if (Issubstr(type, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return '.xlsx';
    } else if (Issubstr(type, 'application/x-7z-compressed')) {
        return '.7z';
    } else if (Issubstr(type, 'application/x-rar-compressed')) {
        return '.rar';
    } else if (Issubstr(type, 'application/vnd.ms-powerpoint')) {
        return '.ppt';
    } else if (Issubstr(type, 'application/epub+zip')) {
        return '.epub';
    } else if (Issubstr(type, 'image/gif')) {
        return '.gif';
    } else if (Issubstr(type, 'application/x-bzip')) {
        return '.bz';
    } else if (Issubstr(type, 'application/x-bzip2')) {
        return '.bz2';
    } else if (Issubstr(type, 'video/x-msvideo')) {
        return '.avi';
    } else if (Issubstr(type, 'image/png')) {
        return '.png';
    } else if (Issubstr(type, 'image/jpg')) {
        return '.jpg';
    } else if (Issubstr(type, 'application/vnd.amazon.ebook')) {
        return '.azw';
    } else if (Issubstr(type, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
        return '.pptx';
    } else {
        return '.UnknowType';
    }
}

function Issubstr(mainstring, substring) {
    return (mainstring.indexOf(substring) != -1);
}
//UTF字符转换
var UTFTranslate = {
    Change: function(pValue) {
        return pValue.replace(/[^\u0000-\u00FF]/g, function($0) {
            return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;")
        });
    },
    ReChange: function(pValue) {
        return unescape(pValue.replace(/&#x/g, '%u').replace(/\\u/g, '%u').replace(/;/g, ''));
    }
};

function message(text, type) {
    $('.message>.header>.title').text(type);
    $('.message>.content>p').text(text);
    $('.ui.basic.modal.message').modal('show');
}