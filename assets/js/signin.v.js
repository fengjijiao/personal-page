var inputs = document.querySelectorAll('.file-input')
var lock_af;
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
        auth_authfile();
    }
}

function auth_authfile() {
    var objFile = document.getElementById("authfile");
    if (objFile.value == "") {
        alert("不能空!");
    } else {
        //console.log(objFile.files[0].size);
        //文件字节数
        if (objFile.files[0].size != 64) {
            alert("非标准AF文件!");
        } else {
            var files = $('#authfile').prop('files');
            //获取到文件列表
            if (files.length == 0) {
                alert('请选择文件');
            } else {
                var reader = new FileReader();
                //新建一个FileReader
                reader.readAsText(files[0], "UTF-8");
                //读取文件 
                reader.onload = function(evt) {
                    //读取完文件之后会回来这里
                    var fileString = evt.target.result;
                    //读取文件内容
                    //console.log(fileString);
                    if (lock_af != fileString) {
                        lock_af = fileString;
                        //防止多次操作
                        $.post('/api/auth_authfile', {
                            af: fileString,
                            uuid: UUID
                        }, function(data) {
                            if (data.type) {
                                //sync
                                $.post("/api/get_information", {
                                    type: 'userdata',
                                    uuid: UUID
                                }, function(data) {
                                    console.log(data);
                                    if (data.type) {
                                        //console.log(data.data);
                                        //console.log(Base64.decode(data.data));
                                        //console.log(JSON.parse(pako.ungzip(Base64.decode(data.data),{ to: 'string' })));
                                        add_user_information(JSON.parse(pako.ungzip(Base64.decode(data.data), {
                                            to: 'string'
                                        })));
                                    }
                                }, "json");
                                //sync
                                message("会员载入成功!", "成功");
                                add_user_information({
                                    username: data.user_information.username
                                });
                                $(".ui.stacked.segment").html("<div class=\"ui info message\"><i class=\"close icon\" onclick=\"javascript:$(this).parent().hide();\"></i>\r\n<div class=\"header\">载入成功</div><ul class=\"list\">\r\n<li><a href=\"javascript:top.location=store.get('page_referer_uri');\">返回</a></li>\r\n<li><a href=\"javascript:top.location='\/';\">返回首页</a></li>\r\n</ul>\r\n</div>");
                            } else {
                                message(data.msg, "失败");
                            }
                            console.log(data);
                        }, "json");
                    }
                }

            }

        }
    }
}

function message(text, type) {
    $('.message>.header>.title').text(type);
    $('.message>.content>p').text(text);
    $('.ui.basic.modal.message').modal('show');
}