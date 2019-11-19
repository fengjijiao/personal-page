const jsname = 'main';
if ($(window).width() < 720) {
    $(".sideway").hide();
}
let ip_count = 0;
let ip_in = null, ip_out = null, ip_in_location = null, ip_out_location = null;
ipcheck();
get_cdn_info();
dnscheck();
get_weather_info();
get_ipinfo_info();
if (store.get('user_information').username != null) {
    $(".signup").html("你好,<a class=\"ui basic label\">" + store.get('user_information').username + "</a>!");
}
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    $("#location_info").html("浏览器不支持!");
}

function showPosition(position) {
    $("#location_info").html("纬度:" + Math.ceil(position.coords.latitude) + ", 经度:" + Math.ceil(position.coords.longitude) + ". ( 精度:" + (position.coords.accuracy ? position.coords.accuracy + 'm' : '未知') + " )<br>海拔:" + (position.coords.altitude ? position.coords.altitude : '未知') + ". ( 精度:" + (position.coords.altitudeAccuracy ? position.coords.altitudeAccuracy : '未知') + " )<br>方向:" + (position.coords.heading ? position.coords.heading : '未知') + ", 速度:" + (position.coords.speed ? position.coords.speed : '未知') + ". ");
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            $("#location_info").html("你拒绝了获取地理位置的请求。");
            break;
        case error.POSITION_UNAVAILABLE:
            $("#location_info").html("位置信息是不可用的。");
            break;
        case error.TIMEOUT:
            $("#location_info").html("请求用户地理位置超时。");
            break;
        case error.UNKNOWN_ERROR:
            $("#location_info").html("未知错误。");
            break;
    }
}

function get_ipinfo_info() {
    var ipinfo_info_html = "";
    $.get('https://ipinfo.io/?token=84f2ecc80e1267', function(data) {
        console.table(data);
        ipinfo_info_html += "<p class=\"muti-color\">IP: " + data.ip + " </p>";
        ipinfo_info_html += "<p class=\"muti-color\">Host: " + data.hostname + " </p>";
        ipinfo_info_html += "<p class=\"muti-color\">ORG: " + data.org + " </p>";
        //ipinfo_info_html += "<p class=\"muti-color\">地区: " + data.region + " " + data.city + " </p>";
        $("#ipinfo_info").html(ipinfo_info_html);
    }, 'json');
}

function get_cdn_info() {
    $.get('/api/get_cdn_ip', function(res) {
        if (store.get('user_information').cdn_ip_info != null && store.get('user_information').cdn_ip_info.ip == res.ip) {
            console.log(jsname, "cdn ip从缓存读取");
            cdn_ip_location = store.get('user_information').cdn_ip_info.country_name + " " + store.get('user_information').cdn_ip_info.region_name + " " + store.get('user_information').cdn_ip_info.city_name;
            $("#cdn_ip_info").html("节点: " + cdn_ip_location);
        } else {
            console.log(jsname, "cdn ip从接口读取");
            $.post("/api/get_ipv4_info", {
                ip: res.ip
            }, function(data) {
                //console.log(data);
                if (data.type) {
                    add_user_information({
                        cdn_ip_info: data.result
                    })
                    cdn_ip_location = data.result.country_name + " " + data.result.region_name + " " + data.result.city_name;
                    $("#cdn_ip_info").html("节点: " + cdn_ip_location);
                }
            }, "json");
        }
    }, "json");
}

function ipcheck() {
    $.get('https://www.5650.top/api.php?action=getip', function(data) {
        //console.log(data);
        let ipcheck_html = "";
        ip_count++;
        if (data.type) {
            ip_in = data.ip;
            if (store.get('user_information').ip_in_info != null && store.get('user_information').ip_in_info.ip == data.ip) {
                console.log(jsname, "in从缓存读取");
                ip_in_location = store.get('user_information').ip_in_info.country_name + " " + store.get('user_information').ip_in_info.region_name + " " + store.get('user_information').ip_in_info.city_name;
                $("#ipcheck_in").attr("data-tooltip", ip_in_location);
            } else {
                console.log(jsname, "in从接口读取");
                $.post("/api/get_ipv4_info", {
                    ip: data.ip
                }, function(data) {
                    //console.log(data);
                    if (data.type) {
                        add_user_information({
                            ip_in_info: data.result
                        })
                        ip_in_location = data.result.country_name + " " + data.result.region_name + " " + data.result.city_name;
                        $("#ipcheck_in").attr("data-tooltip", ip_in_location);
                    }
                }, "json");
            }
            type = "正常";
        } else {
            type = "异常";
        }
        ipcheck_html += "<p><a class=\"ui teal label\">" + type + "</a></p>";
        $("#ipcheck_in").html(ipcheck_html);
        gatherIP();
    }, "json");
    $.ajax({
        url: "https://api-ipv4.ip.sb/jsonip?callback=?",
        type: "GET",
        dataType: "jsonp",
        success: function(data) {
            ip_out = data.ip;
            if (store.get('user_information').ip_out_info != null && store.get('user_information').ip_out_info.ip == data.ip) {
                console.log(jsname, "out从缓存读取");
                ip_out_location = store.get('user_information').ip_out_info.country_name + " " + store.get('user_information').ip_out_info.region_name + " " + store.get('user_information').ip_out_info.city_name;
                $("#ipcheck_out").attr("data-tooltip", ip_out_location);
            } else {
                console.log(jsname, "out从接口读取");
                $.post("/api/get_ipv4_info", {
                    ip: data.ip
                }, function(data) {
                    //console.log(data);
                    if (data.type) {
                        add_user_information({
                            ip_out_info: data.result
                        })
                        ip_out_location = data.result.country_name + " " + data.result.region_name + " " + data.result.city_name;
                        $("#ipcheck_out").attr("data-tooltip", ip_out_location);
                    }
                }, "json");
            }
            ip_count++;
            gatherIP();
            $("#ipcheck_out").html("<p><a class=\"ui yellow label\">正常</a></p>");
        },
        error: function() {
            ip_count++;
            gatherIP();
            $("#ipcheck_out").html("<p><a class=\"ui yellow label\">异常</a></p>");

        },
        timeout: 3000
    });
    return true;
}

function gatherIP() {
    let ipinfo_html;
    if (ip_count == 2) {
        if (ip_in == null || ip_out == null) {
            ipinfo_html = "<p><a class=\"ui red label\">计划访问</a></p>";
        } else if (ip_in == ip_out) {
            ipinfo_html = "<p><a class=\"ui green label\">正常访问</a></p>";
        } else {
            ipinfo_html = "<p><a class=\"ui olive label\">分流访问</a></p>";
        }
    } else {
        ipinfo_html = "<p><a class=\"ui grey label\">判断中</a></p>"
    }
    $("#ip_info").html(ipinfo_html);
}

function dnscheck() {
    gatherDNS();
}

function gatherDNS() {
    var dns_info_html = "";
    $.get('https://' + randomWordLow(false, 32) + '.edns.ip-api.com/json', function(data) {
        console.table(data);
        if (data.dns != null) {
            dns_info_html += "<p class=\"muti-color\">解析服务: " + data.dns.ip + "( " + data.dns.geo + ") </p>";
        }
        if (data.edns != null) {
            dns_info_html += "<p class=\"muti-color\">解析来源: " + data.edns.ip + "( " + data.edns.geo + ") </p>";
        }
        $("#dns_info").html(dns_info_html);
    }, "json");
}

function get_weather_info() {
    var weather_info_html = "";
    $.get('https://www.tianqiapi.com/api/?version=v1&ip=' + ((store.get('user_information').ip_in_info != null) ? store.get('user_information').ip_in_info.ip : '1.1.1.1'), function(data) {
        console.table(data);
        weather_info_html += "<p class=\"muti-color\">地区: " + data.city + " </p>";
        weather_info_html += "<p class=\"muti-color\">空气: " + data.data[0].air_level + "( " + data.data[0].air + ") </p>";
        weather_info_html += "<p class=\"muti-color\">描述: " + data.data[0].air_tips + " </p>";
        weather_info_html += "<p class=\"muti-color\">气温: " + data.data[0].tem + " </p>";
        weather_info_html += "<p class=\"muti-color\">最后更新于: " + data.update_time + " </p>";
        $("#weather_info").html(weather_info_html);
    }, "json");
}