var Amount = 0;
var item_width = 0;
if ($(window).width() > 720) {
    var width = $(window).width() / 2.3;
    var height = $(window).width() * 0.618 / 2.3;
} else {
    var width = $(window).width() * 0.9;
    var height = $(window).width() * 0.618;
}
var datas = {
    isCompleted: false,
    isResultCompleted: false
};
var vm = new Vue({
    el: '#context',
    data: datas
});
$('.ui.dropdown').dropdown();

function initiate() {
    Amount = $("#Amount").val();
    return set_Amount(Amount);
}

function set_Amount(n) {
    if (checkNumber(n)) {
        Amount = parseInt(n);
        item_width = Math.floor(width / n / 2);
        return generate_inputs(n, item_width);
    } else {
        //非正常输入,非整数
        return false;
    }
}

function generate_inputs(n, w) {
    var html2 = "<form class=\"ui form\" onsubmit=\"javascript:return false;\">";
    html2 += "\r\n<div class=\"fields\">";
    for (var i = n; i >= 1; i--) {
        if (i > 1) {
            var sign = "+";
        } else {
            var sign = "=";
        }
        html2 += "\r\n<div class=\"field\">\r\n<div class=\"ui right labeled input\">\r\n<input type=\"number\" placeholder=\"0\" style=\"width:" + w + "px;\" id=\"X" + i + "\">\r\n<div class=\"ui basic label\">\r\nX<sup>" + i + "</sup>" + sign + "\r\n</div>\r\n</div>\r\n</div>";
    }
    html2 += "\r\n<div class=\"field\">\r\n<div class=\"ui input\">\r\n<input type=\"number\" placeholder=\"0\" style=\"width:" + w + "px;\" id=\"X0\">\r\n</div>\r\n</div>";
    html2 += "\r\n</div>";
    html2 += "\r\n<button class=\"ui primary button\" onclick=\"javascript:running();\" v-bind:class=\"{'loading': isCompleted}\">求解</button>";
    html2 += "\r\n</form>";
    html2 += "\r\n<div id=\"result\" style=\"padding-top:10px;\"></div>";
    $("#context").html(html2);
    return true;
}

function running() {
    datas.isCompleted = true;
    datas.isResultCompleted = true;
    //UnaryHighOrder
    var arr = [];
    for (var i = 0; i <= Amount; i++) {
        if (i == Amount) {
            arr[i] = -parseInt($("#X0").val());
        } else {
            arr[i] = parseInt($("#X" + (Amount - i)).val());
        }
    }
    //console.log(encodeArray1D(arr));
    //alert(encodeArray1D(arr));
    $.post('https://api.fengjijiao.cn/solve-equations/', {
        type: 'UnaryHighOrder',
        coefficient: encodeArray1D(arr)
    }, function(data) {
        if (data.type) {
            var result_html = "<div class=\"ui segment\" v-bind:class=\"{'loading': isResultCompleted}\">\r\n<h4 class=\"ui horizontal divider header\">\r\n<i class=\"info icon\"></i>结果 ( Result )</h4><a class=\"ui teal right ribbon label\" id=\"credibility\">Loading</a>\r\n<ul>";
            var x = [];
            for (var i = 0; i < data.result.length; i++) {
                x[i] = data.result[i];
                result_html += "<li>X<sub>" + (i + 1) + "</sub> = " + ((data.result[i].toString().indexOf(".") > -1) ? ((data.result[i].toString().split(".")[1].length > 9) ? (new Number(parseFloat(data.result[i])).toFixed(3).toString() + " ( 循环小数, 仅保留3位) ") : (data.result[i].toString() + " ( 普通小数) ")) : (data.result[i].toString() + " ( 整数) ")) + "</li>";
            }
            result_html += "\r\n</ul>\r\n</div>";
            $("#result").html(result_html);
            $("#credibility").html("可信度:" + Math.ceil(CanTrustedPec(arr, x) * 100) + "%");
            datas.isCompleted = false;
            datas.isResultCompleted = false;
        } else {
            message('计算超过允许范围!', '错误');
        }
    }, "json");
}

function CanTrustedPec(arr, x) {
    var sum = 0;
    var j = 0,
        temp, faith = 0;
    while (j < x.length) {
        for (var i = arr.length; i > 0; i--) {
            sum += arr[arr.length - i] * Math.pow(x[j], i);
        }
        if (Math.floor(sum) == 0) {
            faith++;
        }
        j++;
    }
    return Math.ceil(faith / x.length);
}

function encodeArray1D(obj) {
    return '[' + obj.toString() + ']';
}

function message(text, type) {
    $('.message>.header>.title').text(type);
    $('.message>.content>p').text(text);
    $('.ui.basic.modal.message').modal('show');
}