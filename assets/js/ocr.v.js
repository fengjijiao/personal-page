var datas = {
    isUploadActive: true,
    isPreviewActive: false,
    isResultActive: false,
    isUploadCompleted: false,
    isPreviewCompleted: false,
    isResultCompleted: false
};
var vm = new Vue({
    el: '#context',
    data: datas
});
$("#Copy").hide();
var clipboard = new ClipboardJS('#copy2');
clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    //e.clearSelection();
});
clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
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
var inputs = document.querySelectorAll('.file-input')

for (var i = 0, len = inputs.length; i < len; i++) {
    customInput(inputs[i])
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
        // 创建一个FileReader对象
        var reader = new FileReader();
        // 绑定load事件
        reader.onload = function(e) {
            //console.log(escape(e.target.result));
            $("#Upload").hide();
            datas.isUploadActive = false;
            datas.isUploadCompleted = true;
            datas.isPreviewActive = true;
            $("#Preview").html('<div class="ui teal progress" id="uploadprogress" data-percent="6">\r\n<div class="bar"></div>\r\n</div>\r\n<a class="ui red card">\r\n<div class="image">\r\n<img src="' + e.target.result + '">\r\n</div>\r\n</a>\r\n</div>');
            $('#uploadprogress').progress();
            $.ajax({
                url: 'https://api.fengjijiao.cn/ocr/',
                type: 'POST',
                data: {
                    image: e.target.result
                },
                dataType: 'json',
                xhr: xhrOnProgress(function(e) {
                    var percent = Math.ceil((e.loaded / e.total) * 100); //计算百分比
                    //console.log(percent);
                    $('#uploadprogress').progress({
                        percent: percent
                    });
                }),
                success: function(data) {
                    var ct = count(data.words_result);
                    var word_res = "";
                    var pword_res = "";
                    for (var i = 0; i < ct; i++) {
                        word_res += "" + data.words_result[i].words + "<br>";
                        pword_res += data.words_result[i].words + "\r\n";
                    }
                    $("#Preview").hide();
                    datas.isPreviewActive = false;
                    datas.isPreviewCompleted = true;
                    datas.isResultActive = true;
                    $("#Result").html("<span style='float:right;font-size:9px;'>Identification ID:" + data.log_id + "</span><br>" + word_res);
                    $("#Pesult").val(pword_res);
                    $("#Copy").show();
                }
            });
        }
        // 读取File对象的数据
        reader.readAsDataURL(document.querySelector("input[type=file]").files[0]);
    }