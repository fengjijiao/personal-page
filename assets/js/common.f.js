document.oncontextmenu = new Function("event.returnValue=false");
document.onselectstart = new Function("event.returnValue=false");
document.oncontextmenu = function(evt) {
    evt.preventDefault();
}
document.onselectstart = function(evt) {
    evt.preventDefault();
};
//feather icon init
if (feather) {
    feather.replace();
}
//feather icon init
var modals_html = "";
var patter_images = new Array('ahoy', 'asteroids', 'circuit', 'morocco-blue', 'morocco', 'science', 'wild-sea', 'white-waves', 'alchemy', 'moire', 'bunting-flag', 'plaid', 'raspberry-lace', 'green-leaf', 'floral', 'cartoon-pencil-shavings', 'morning-glory-blue');
modals_html += "\r\n<div class=\"ui modal setting\">\r\n<div class=\"header\">选项</div>\r\n<div class=\"muti-bg scrolling content\">";
modals_html += "\r\n<div class=\"ui segment\">\r\n<div class=\"field\">\r\n<div class=\"ui toggle checkbox setting sync\">\r\n<input type=\"checkbox\" value=\"1\" class=\"hidden\" checked>\r\n<label class=\"muti-color\">同步 (实验性)</label>\r\n</div>\r\n</div>\r\n</div>";
modals_html += "\r\n<div class=\"ui segment\">\r\n<div class=\"field\">\r\n<div class=\"ui toggle checkbox setting autodownload\">\r\n<input type=\"checkbox\" value=\"1\" class=\"hidden\" checked>\r\n<label class=\"muti-color\">文件寄存器:自动下载 (实验性)</label>\r\n</div>\r\n</div>\r\n</div>";
modals_html += "\r\n<div class=\"ui form\">\r\n<div class=\"inline fields\">\r\n<label class=\"muti-color\">风格</label>\r\n<div class=\"field\">\r\n<div class=\"ui radio checkbox seeting cstyle\">\r\n<input type=\"radio\" name=\"cstyle\" value=\"3\">\r\n<label class=\"muti-color\">纯白</label>\r\n</div>\r\n</div>\r\n<div class=\"field\">\r\n<div class=\"ui radio checkbox seeting cstyle\">\r\n<input type=\"radio\" name=\"cstyle\" value=\"0\">\r\n<label class=\"muti-color\">全彩</label>\r\n</div>\r\n</div>\r\n<div class=\"field\">\r\n<div class=\"ui radio checkbox seeting cstyle\">\r\n<input type=\"radio\" name=\"cstyle\" value=\"1\">\r\n<label class=\"muti-color\">半透</label>\r\n</div>\r\n</div>\r\n<div class=\"field\">\r\n<div class=\"ui radio checkbox seeting cstyle\">\r\n<input type=\"radio\" name=\"cstyle\" value=\"2\">\r\n<label class=\"muti-color\">全透</label>\r\n</div>\r\n</div>\r\n</div>\r\n</div>";
modals_html += "\r\n<h4 class=\"ui header muti-color\">背景</h4><div class=\"ui segment\">\r\n";
var patter_image_cata_count = Math.ceil(patter_images.length / 8);
for (var j = 1; j <= patter_image_cata_count; j++) {
    modals_html += "\r\n<div class=\"ui grid column\">";
    for (var i = 8 * (j - 1); i < j * 8; i++) {
        if (i >= patter_images.length) {
            break;
        }
        modals_html += "\r\n<div class=\"blurring dimmable image pattern\">\r\n<div class=\"ui dimmer\">\r\n<div class=\"content\">\r\n<div class=\"center\">\r\n<h4 class=\"ui header inverted\">" + (patter_images[i]).replace(/-/g, ' ').toUpperCase() + "</h4><div class=\"ui inverted set-patter-image button\" onclick=\"javascript:set_pattern_image('" + patter_images[i] + "',2);\" data-content=\"已生成预览!\">预览</div>\r\n<div class=\"ui inverted set-patter-image button\" onclick=\"javascript:set_pattern_image('" + patter_images[i] + "',1);\" data-content=\"保存成功!\">设置</div>\r\n</div>\r\n</div>\r\n</div>";
        modals_html += "\r\n<img class=\"ui tiny image column\" src=\"/assets/images/patter-images/" + patter_images[i] + ".png\" style=\"min-width:120px;min-height:200px;width:10vw;height:19vw;\">";
        modals_html += "\r\n</div>";
    }
    modals_html += "\r\n</div>";
}
modals_html += "\r\n</div>";
modals_html += "\r\n</div>\r\n <div class=\"actions\">\r\n<div class=\"ui positive right labeled icon button\">\r\n完成\r\n<i class=\"checkmark icon\"></i>\r\n</div>\r\n</div>\r\n</div>";
setInterval("calculate_time_countup();", 1000, "JavaScript");
if (!store.has('user_information')) {
    var UUID = generateUUID().toUpperCase();
    store.set('user_information', {
        UUID: UUID
    });
} else {
    var UUID = store.get('user_information').UUID;
}
if (!store.has('page_lastest_uri')) {
    store('page_referer_uri', '/');
    store('page_stay_count', 0);
    store('page_lastest_uri', window.location.pathname);
} else {
    if (store.get('page_lastest_uri') != window.location.pathname) {
        store('page_referer_uri', store.get('page_lastest_uri'));
        store('page_lastest_uri', window.location.pathname);
        store('page_stay_count', 0);
    } else {
        store('page_stay_count', store.get('page_stay_count') + 1);
    }
}
if (store.get('user_information').background != null) {
    set_pattern_image(store.get('user_information').background, 1);
}
jQuery(document).ready(function($) {
    //default
    // fix main menu to page on passing
    $('.main.menu').visibility({
        type: 'fixed'
    });
    $('.overlay').visibility({
        type: 'fixed',
        offset: 80
    });
    // lazy load images
    $('.image').visibility({
        type: 'image',
        transition: 'vertical flip in',
        duration: 500
    });
    // show dropdown on hover
    $('.main.menu  .ui.dropdown').dropdown({
        on: 'hover'
    });
    //default
    //bubbling-text-effect-no-canvas-required
    // Define a blank array for the effect positions. This will be populated based on width of the title.
    var bArray = [];
    // Define a size array, this will be used to vary bubble sizes
    var sArray = [4, 6, 8, 10];

    // Push the header width values to bArray
    for (var i = 0; i < $('.bubbles').width(); i++) {
        bArray.push(i);
    }

    // Function to select random array element
    // Used within the setInterval a few times

    function randomValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // setInterval function used to create new bubble every 350 milliseconds
    setInterval(function() {

        // Get a random size, defined as variable so it can be used for both width and height
        var size = randomValue(sArray);
        // New bubble appeneded to div with it's size and left position being set inline
        // Left value is set through getting a random value from bArray
        $('.bubbles').append('<div class="individual-bubble" style="left: ' + randomValue(bArray) + 'px; width: ' + size + 'px; height:' + size + 'px;"></div>');

        // Animate each bubble to the top (bottom 100%) and reduce opacity as it moves
        // Callback function used to remove finsihed animations from the page
        $('.individual-bubble').animate({
            'bottom': '100%',
            'opacity': '-=0.7'
        }, 3000, function() {
            $(this).remove()
        });


    }, 350);
    //bubbling-text-effect-no-canvas-required
    //common-background
    set_background_styles();
    //common-background
});

function set_background_styles(type = 1) {
    //type used to preview or save, default is save
    if (count($("#getbgcolor")) > 1) {
        $("#getbgcolor").remove();
    }
    var cstyle = parseInt((store.get('user_information').settings_cstyle != null) ? (store.get('user_information').settings_cstyle) : '0');
    var bgcolorData, bgcolorRBGA;
    $("body").prepend('<div id="getbgcolor"><img id="bgkk" src="/assets/images/patter-images/' + ((type == 2) ? store.get('user_information').preview_background : store.get('user_information').background) + '.png"><canvas id="bgca"></canvas></div>');
    $("#getbgcolor").css('position', 'absolute');
    $("#getbgcolor").css('left', '0px');
    $("#getbgcolor").css('top', '0px');
    $("#getbgcolor").css('z-index', -99);
    $("#bgkk").hide();
    $("#bgca").hide();
    $("#bgkk").on("load", function() {
        $("#bgkk").show();
        canvas = $('#bgca')[0];
        canvas.width = $("#bgkk")[0].clientWidth;
        canvas.height = $("#bgkk")[0].clientHeight;
        canvas.getContext('2d').drawImage($("#bgkk")[0], 0, 0, $("#bgkk")[0].clientWidth, $("#bgkk")[0].clientHeight);
        //var xx=randomNum(0,$("#bgkk")[0].clientWidth),yy=randomNum(0,$("#bgkk")[0].clientHeight);
        //console.log(xx,,,yy);
        bgcolorData = canvas.getContext('2d').getImageData(138, 121, 1, 1).data;
        $("#bgkk").hide();
        $("#getbgcolor").remove();
        if (cstyle == 0) {
            uncolorRBGA = "rgba(" + (255 - bgcolorData[0] - 46) + "," + (255 - bgcolorData[1] - 28) + ",0," + bgcolorData[3] + ")";
            bgcolorRBGA = "rgba(" + bgcolorData[0] + "," + bgcolorData[1] + "," + bgcolorData[2] + "," + bgcolorData[3] + ")";
            $(".ui.main.menu").css("background", bgcolorRBGA);
            $(".muti-color").css("color", uncolorRBGA);
            $(".ui, .muti-color").css("font-weight", 300);
            $(".ui.segment, .ui.segments, .muti-bg").css("background-color", bgcolorRBGA);
            $(".ui.segment, .ui.segments, .muti-bg").css("background", bgcolorRBGA);
            $(".ui.inverted.segment").css("background", bgcolorRBGA);
        } else if (cstyle == 1) {
            uncolorRBGA = "rgba(" + (255 - bgcolorData[0] - 46) + "," + (255 - bgcolorData[1] - 28) + ",0," + bgcolorData[3] + ")";
            bgcolorRBGA = "rgba(" + bgcolorData[0] + "," + bgcolorData[1] + "," + bgcolorData[2] + ",0.6)";
            $(".ui.main.menu").css("background", bgcolorRBGA);
            $(".muti-color").css("color", uncolorRBGA);
            $(".ui, .muti-color").css("font-weight", 300);
            $(".ui.segment, .ui.segments, .muti-bg").css("background-color", bgcolorRBGA);
            $(".ui.segment, .ui.segments, .muti-bg").css("background", bgcolorRBGA);
            $(".ui.inverted.segment").css("background", "rgba(0,0,0,0.6)");
        } else if (cstyle == 2) {
            bgcolorRBGA = "rgba(" + bgcolorData[0] + "," + bgcolorData[1] + "," + bgcolorData[2] + ",0)";
            $(".ui.main.menu").css("background", bgcolorRBGA);
            $(".muti-color").css("color", "rgba(0,0,0,1)");
            $(".ui, .muti-color").css("font-weight", 300);
            $(".ui.segment, .ui.segments, .muti-bg").css("background-color", bgcolorRBGA);
            $(".ui.segment, .ui.segments, .muti-bg").css("background", bgcolorRBGA);
            $(".ui.inverted.segment").css("background", "rgba(0,0,0,0.6)");
        } else if (cstyle == 3) {
            $(".ui.main.menu").css("background", "rgba(255,255,255,1)");
            $(".muti-color").css("color", "rgba(0,0,0,1)");
            $(".ui, .muti-color").css("font-weight", 300);
            $(".ui.segment, .ui.segments, .muti-bg").css("background-color", "rgba(255,255,255,1)");
            $(".ui.segment, .ui.segments, .muti-bg").css("background", "rgba(255,255,255,1)");
            $(".ui.inverted.segment").css("background", "rgba(0,0,0,1)");
        }
    });
}

function set_pattern_image(code, type) {
    let background = 'url("/assets/images/patter-images/' + code + '.png")';
    $('body').css('background', background);
    if (type == 1) {
        add_user_information({
            background: code
        });
    } else if (type == 2) {
        add_user_information({
            preview_background: code
        });
    }
    set_background_styles(type);
}

function add_user_information(data) {
    return store.add('user_information', data);
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

function refreshUUID() {
    UUID = generateUUID().toUpperCase();
    store.set('user_information', {
        UUID: UUID
    });
    return UUID;
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function guid2() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function uuid(len, radix) {
    // 8 character ID (base=2)
    //uuid(8, 2)
    // "01001010"
    // 8 character ID (base=10)
    //uuid(8, 10)
    // "47473046"
    // 8 character ID (base=16)
    //uuid(8, 16)
    // "098F4D35"
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data. At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

function uuid2() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function calculate_time_countup() {
    var countup = {};
    countup.days = Math.floor((Math.round(new Date() / 1000) - 1518790320) / 86400);
    countup.hours = Math.floor(((Math.round(new Date() / 1000) - 1518790320) % 86400) / 3600);
    countup.minutes = Math.floor((((Math.round(new Date() / 1000) - 1518790320) % 86400) % 3600) / 60);
    $("#countup").html("<h4 class=\"ui inverted header\">已平稳运行</h4>\r\n<div class=\"ui olive inverted horizontal statistic\">\r\n<div class=\"value\">" + countup.days + "</div>\r\n<div class=\"label\">Days</div>\r\n</div>\r\n<div class=\"ui orange inverted horizontal statistic\">\r\n<div class=\"value\">" + countup.hours + "</div>\r\n<div class=\"label\">Hours</div>\r\n</div>\r\n<div class=\"ui violet inverted horizontal statistic\">\r\n<div class=\"value\">" + countup.minutes + "</div>\r\n<div class=\"label\">Minutes</div>\r\n</div>");
}
//生成从minNum到maxNum的随机数

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

function sync(type = 1) {
    //默认为1无间隔模式
    var last = (store.get('user_information').last_sync != null ? store.get('user_information').last_sync : 15502257360);
    var now = Math.floor(new Date() / 100);
    if (type == 2) {
        //间隔模式
        if ((now - last) < 43200) {
            return false;
        }
    }
    var DATA = JSON.parse(JSON.stringify(store.get('user_information')));
    delete DATA.UUID;
    delete DATA.last_sync;
    delete DATA.username;
    $.post("/api/add_information", {
        type: 'userdata',
        uuid: UUID,
        data: Base64.encodeURI(pako.gzip(JSON.stringify(DATA), {
            to: 'string'
        }))
    }, function(data) {
        console.log(data);
    }, "json");
    add_user_information({
        last_sync: now
    });
    return true;
}
/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
** xuanfeng 2014-08-28
*/ 
function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}
function randomWordLow(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}