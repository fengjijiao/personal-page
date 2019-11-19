const unkow_sign = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j');
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
//initiate_form_checkvalid();

function initiate_form_checkvalid() {
    $('.ui.form').form({
        fields: {
            Amount: {
                identifier: 'Amount',
                rules: [{
                    type: 'empty',
                    prompt: '请输入未知数个数'
                }, {
                    type: 'integer[2..9]',
                    prompt: '仅支持2-9个未知数的方程求解.'
                }]
            }
        }
    });
}

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
    for (var j = 0; j < n; j++) {
        html2 += "\r\n<div class=\"fields\">";
        for (var i = 0; i < n; i++) {
            if (i < (n - 1)) {
                var sign = "+";
            } else {
                var sign = "=";
            }
            html2 += "\r\n<div class=\"field\">\r\n<div class=\"ui right labeled input\">\r\n<input type=\"number\" placeholder=\"0\" style=\"width:" + w + "px;\" id=\"" + unkow_sign[j] + i + "\">\r\n<div class=\"ui basic label\">\r\n" + unkow_sign[i] + sign + "\r\n</div>\r\n</div>\r\n</div>";
        }
        html2 += "\r\n<div class=\"field\">\r\n<div class=\"ui input\">\r\n<input type=\"number\" placeholder=\"0\" style=\"width:" + w + "px;\" id=\"" + unkow_sign[j] + i + "\">\r\n</div>\r\n</div>";
        html2 += "\r\n</div>";
    }
    html2 += "\r\n<button class=\"ui primary button\" onclick=\"javascript:running();\" v-bind:class=\"{'loading': isCompleted}\">求解</button>";
    html2 += "\r\n</form>";
    html2 += "\r\n<div id=\"result\" style=\"padding-top:10px;\"></div>";
    $("#context").html(html2);
    return true;
}

function generate_inputs_unkow_coe_arr() {
    var arr = [];
    for (var i = 0; i < Amount; i++) {
        arr[i] = [];
        for (var j = 0; j < Amount; j++) {
            arr[i][j] = ($("#" + unkow_sign[i] + j).val() == null) ? '0' : $("#" + unkow_sign[i] + j).val();
            arr[i][j] = parseFloat(arr[i][j]);
            if (!isNumber(arr[i][j])) {
                message('输入错误,请检查输入的方程式系数!', '错误');
                return false;
            }
        }
    }
    return arr;
}

function generate_inputs_unkow_con_arr() {
    var arr = [];
    for (var i = 0; i < Amount; i++) {
        arr[i] = ($("#" + unkow_sign[i] + Amount).val() == null) ? '0' : $("#" + unkow_sign[i] + Amount).val();
        arr[i] = parseFloat(arr[i]);
        if (!isNumber(arr[i])) {
            message('输入错误,请检查输入的方程式常量!', '错误');
            return false;
        }
    }
    return arr;
}

function running() {
    datas.isCompleted = true;
    datas.isResultCompleted = true;
    var coe_arr = generate_inputs_unkow_coe_arr();
    var con_arr = generate_inputs_unkow_con_arr();
    if (coe_arr && con_arr) {
        $.post('https://api.fengjijiao.cn/solve-equations/', {
            type: 'MultivariateOnce',
            coefficient: encodeArray2D(coe_arr),
            constant: "[" + con_arr.toString() + "]"
        }, function(data) {
            if (data.type) {
                var result_html = "<div class=\"ui segment\" v-bind:class=\"{'loading': isResultCompleted}\">\r\n<h4 class=\"ui horizontal divider header\">\r\n<i class=\"info icon\"></i>结果 ( Result )</h4><a class=\"ui teal right ribbon label\" id=\"credibility\">Loading</a>\r\n<ul>";
                var q = 0;
                for (var i = 0; i < data.result.length; i++) {
                    result_html += "<li>" + unkow_sign[i] + " = " + ((data.result[i].toString().indexOf(".")> -1)? ((data.result[i].toString().split(".")[1].length > 9)? (new Number(parseFloat(data.result[i])).toFixed(3).toString()+ " ( 循环小数, 仅保留3位) "): (data.result[i].toString()+ " ( 普通小数) ")): (data.result[i].toString()+ " ( 整数) ")) + "</li>";
                }
                for (var j = 0; j < coe_arr.length; j++) {
                    var calc_r = 0;
                    for (var k = 0; k < coe_arr.length; k++) {
                        //console.log("1:"+coe_arr[k][j]);
                        //console.log("2:"+data.result[k]);
                        calc_r += coe_arr[j][k] * data.result[k];
                    }
                    if (Math.floor(calc_r) == Math.floor(con_arr[j])) {
                        q++;
                    }
                    //console.log("q:"+q);
                    //console.log("c:"+calc_r);
                    //console.log("r:"+con_arr[j]);
                }
                result_html += "\r\n</ul>\r\n</div>";
                $("#result").html(result_html);
                $("#credibility").html("可信度:" + Math.ceil((q / coe_arr.length) * 100) + "%");
                datas.isCompleted = false;
                datas.isResultCompleted = false;
            } else {
                message('计算超过允许范围!', '错误');
            }
            //console.log(data);
        }, "json");
        //console.log(coe_arr);
        //console.log(con_arr);
    }
}

function encodeArray2D(obj) {
    var array = [];
    for (var i = 0; i < obj.length; i++) {
        array[i] = '[' + obj[i].toString() + ']';
    }
    return '[' + array.toString() + ']';
}

function checkNumber(num) {
    var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/ 
    if (!re.test(num)) {
        return false;
    } else {
        return true;
    }
}

function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
        return true;
    } else {
        return false;
    }
}

function message(text, type) {
    $('.message>.header>.title').text(type);
    $('.message>.content>p').text(text);
    $('.ui.basic.modal.message').modal('show');
}