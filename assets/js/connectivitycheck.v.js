var datas = {
    isLoading: false
};
var vm = new Vue({
    el: '#context',
    data: datas
});
var pingData = new Array();
var pingStatus = 0;
var pingPoint = 0;
var pingLimit = 12000;
//var pingPointData=new Array('/api/connectivitycheck','/api/connectivitycheck','/api/connectivitycheck','/api/connectivitycheck','/api/connectivitycheck');
var pingPointData = new Array('/api/connectivitycheck', 'https://www.google.com.hk', 'https://cn.bing.com', 'https://www.baidu.com', 'https://www.5650.top');
$.ping = function(option) {
    var ping, requestTime, responseTime;
    $.ajax({
        //url: option.url + '/network_check/?_t=' + (new Date()).getTime(),
        url:option.url,
        type: 'GET',
        dataType: 'json',
        timeout: pingLimit,
        beforeSend: function() {
            if (option.beforePing) option.beforePing();
            requestTime = new Date().getTime();
        },
        complete: function() {
            responseTime = new Date().getTime();
            ping = Math.abs(requestTime - responseTime);
            if (option.afterPing) option.afterPing(ping);
        }
    });
};
$('.ui.dropdown.pingCount').dropdown();
$('.ui.dropdown.pingCount').dropdown('set selected', 10);
$('.ui.radio.checkbox').checkbox();
$('.ui.radio.checkbox').checkbox({
    onChecked: function() {
        pingPoint = this.value;
    }
});

function runconnectivitycheck() {
    if (!datas.isLoading) {
        datas.isLoading = true;
        pingStatus = 1;
        var pn = parseInt($('.ui.selection.dropdown.pingCount').dropdown('get value'));
        var res_html = "<div class=\"ui raised segment\">\r\n<ol class=\"ui pinglist list\">";
        var twice = 0;
        res_html += "\r\n</ol>\r\n</div>\r\n<div id=\"analyze\" style=\"padding-top:10px;\"><div>";
        $("#result").html(res_html);
        var once = function() {
            $.ping({
                url: pingPointData[pingPoint],
                beforePing: function() {
                    //操作前
                },
                afterPing: function(ping) {
                    //操作后
                    twice++;
                    if (ping >= pingLimit) {
                        res_html = "\r\n<li><a class=\"ui basic label\">" + getNowFormatDate() + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class=\"ui red basic label\"><ping-val>Error</ping-val></a></li>";
                    } else {
                        pingData.push(parseInt(ping));
                        res_html = "\r\n<li><a class=\"ui basic label\">" + getNowFormatDate() + "</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class=\"ui blue basic label\"><ping-val>" + ping + "</ping-val>ms</a></li>";
                    }
                    $(".ui.pinglist.list").html($(".ui.pinglist.list").html() + res_html);
                    if (twice == pn) {
                        var res = calculate(pingData, pn);
                        var rate = res.rate;
                        var interpret = "<p>Ping sent: " + res.pingn + ", received: " + res.dec + ", loss: " + res.loss + "%<br>Latency average: " + res.avg + "ms, best: " + res.min + "ms, worst: " + res.max + "ms</p>";
                        var ana_html = "\r\n<div class=\"ui raised segment\">";
                        ana_html += "\r\n<table class=\"ui celled padded table\">\r\n<thead>\r\n<tr>\r\n<th>评级</th>\r\n<th>说明</th>\r\n</tr>\r\n</thead>\r\n<tbody>";
                        ana_html += "\r\n<tr>\r\n<td>\r\n<div class=\"ui star rating\" data-max-rating=\"5\" data-rating=\"" + rate + "\"></div>\r\n</td>\r\n<td>\r\n" + interpret + "\r\n</td>";
                        ana_html += "\r\n</tbody>\r\n</table>\r\n</div>";
                        $("#analyze").html(ana_html);
                        $('.ui.star.rating').rating({
                            initialRating: rate,
                            maxRating: 5
                        });
                        $('.ui.star.rating').rating('disable');
                        stopconnectivitycheck();
                    } else {
                        if (pingStatus) {
                            setTimeout(function() {
                                once();
                            }, 1000);
                        }
                    }
                }
            });
        };
        once();
    }
}

function stopconnectivitycheck() {
    pingStatus = 0;
    datas.isLoading = false;
    pingData = new Array();
}

function calculate(N, twice) {
    var r = {};
    r.max = 0, r.min = pingLimit, r.avg = pingLimit, r.red = pingLimit, r.sum = 0, r.pingn = twice;
    r.dec = N.length;
    r.err = r.pingn - r.dec;
    if (r.dec != 0) {
        for (var i = 0; i < N.length; i++) {
            if (N[i] > r.max) {
                r.max = N[i];
            }
            if (N[i] < r.min) {
                r.min = N[i];
            }
            r.sum += N[i];
        }
        r.avg = Math.floor(r.sum / r.dec);
        r.red = r.max - r.min;
        r.loss = Math.ceil(((r.pingn - r.dec) / r.pingn) * 10000) / 100;
        r.rate = 5 - Math.floor(((10000 - r.red * 10) / 2000)) + Math.floor(5 - (r.avg / 200));
    } else {
        r.loss = 100;
        r.rate = 0;
    }
    console.log(r);
    return r;
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