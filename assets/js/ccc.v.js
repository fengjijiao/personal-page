var datas = {
    isLoading: false
};
var vm = new Vue({
    el: '#context',
    data: datas
});
$(".control").attr("style", "margin:0 auto;");
var editor = ace.edit("script");
var eresult = ace.edit("result");
editor.setTheme("ace/theme/eclipse");
editor.setFontSize(15);
editor.session.setMode("ace/mode/c_cpp");
editor.setValue("#include <stdio.h>\r\nint main(){\r\nprintf(\"Hello World!\");\r\n}");
//Autocompletion
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    maxLines: Infinity
});
eresult.setTheme("ace/theme/eclipse");
eresult.setFontSize(15);
eresult.session.setMode("ace/mode/txt");
eresult.setValue("运行结果");
//Autocompletion
eresult.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    maxLines: Infinity
});

function running() {
    datas.isLoading = true;
    $("#running").attr("disabled", true);
    $("#result").attr("readonly", "readonly");
    eresult.setValue("请稍等...");
    var script = editor.getValue();
    var apiurl = "/api/compile";
    $.post(apiurl, {
        script: script
    }, function(data) {
        if (data.errors != "\n") {
            $("#running").html("运行");
            datas.isLoading = false;
            $("#running").attr("disabled", false);
            eresult.setValue(data.errors);
        } else {
            $("#running").html("运行");
            datas.isLoading = false;
            $("#running").attr("disabled", false);
            eresult.setValue(data.output);
        }
    }, "json");
}

function clear() {
    $("#script").text("\r");
}