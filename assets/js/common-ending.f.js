$("#modals").html(modals_html);
if (store.get('user_information').settings_sync) {
    setInterval("sync(2);", 946, "JavaScript");
}
$(".ui.inverted.button.setting").on("click", function() {
    $('.blurring.dimmable.image.pattern').dimmer({
        on: 'hover'
    });
    $('.ui.toggle.checkbox.setting.sync').checkbox((store.get('user_information').settings_sync != null) ? (store.get('user_information').settings_sync ? 'check' : 'uncheck') : 'uncheck');
    $('.ui.toggle.checkbox.setting.autodownload').checkbox((store.get('user_information').settings_autodownload != null) ? (store.get('user_information').settings_autodownload ? 'check' : 'uncheck') : 'uncheck');
    $('.ui.toggle.checkbox.setting.sync').checkbox({
        onChange: function() {
            add_user_information({
                settings_sync: $('.ui.toggle.checkbox.setting.sync').checkbox('is checked')
            });
            //先修改后同步
            if ($('.ui.toggle.checkbox.setting.sync').checkbox('is checked')) {
                sync();
            }
        }
    });
   $('.ui.toggle.checkbox.setting.autodownload').checkbox({
        onChange: function() {
            add_user_information({
                settings_autodownload: $('.ui.toggle.checkbox.setting.autodownload').checkbox('is checked')
            });
            //先修改后同步
            if ($('.ui.toggle.checkbox.setting.autodownload').checkbox('is checked')) {
                sync();
            }
        }
    });
    $('.ui.inverted.set-patter-image.button').popup({
        on: 'click'
    });
});
$('.ui.radio.checkbox.seeting.cstyle').checkbox({
    onChange: function() {
        if ($('.ui.radio.checkbox.seeting.cstyle').checkbox('is checked')) {
            let ischecked = false, isvalued = 0;
            for (i = 0; i < $('.ui.radio.checkbox.seeting.cstyle input').length; i++) {
                //console.log($('.ui.radio.checkbox.seeting.cstyle input')[i].checked);
                if ($('.ui.radio.checkbox.seeting.cstyle input')[i].checked) {
                    ischecked = true;
                    isvalued = $('.ui.radio.checkbox.seeting.cstyle input')[i].attributes.value.value;
                }
            }
            //console.log(isvalued);
            add_user_information({
                settings_cstyle: isvalued
            });
            set_background_styles();
        }
    }
});
$(".ui.radio.checkbox.seeting.cstyle :radio[value='" + ((store.get('user_information').settings_cstyle != null) ? (store.get('user_information').settings_cstyle) : '0') + "']").parent().checkbox('check');
//return top button
var scrolltotop = {
    setting: {
        startline: 100, //起始行
        scrollto: 0, //滚动到指定位置
        scrollduration: 400, //滚动过渡时间
        fadeduration: [500, 100] //淡出淡现消失
    },
    controlHTML: '<i class="angle up inverted orange icon huge"></i>', //返回顶部按钮
    controlattrs: {
        offsetx: 10,
        offsety: 10
    }, //返回按钮固定位置
    anchorkeyword: "#top",
    state: {
        isvisible: false,
        shouldvisible: false
    },
    scrollup: function() {
        if (!this.cssfixedsupport) {
            this.$control.css({
                opacity: 0
            });
        }
        var dest = isNaN(this.setting.scrollto) ? this.setting.scrollto : parseInt(this.setting.scrollto);
        if (typeof dest == "string" && jQuery("#" + dest).length == 1) {
            dest = jQuery("#" + dest).offset().top;
        } else {
            dest = 0;
        }
        this.$body.animate({
            scrollTop: dest
        }, this.setting.scrollduration);
    },
    keepfixed: function() {
        var $window = jQuery(window);
        var controlx = $window.scrollLeft() + $window.width() - this.$control.width() - this.controlattrs.offsetx;
        var controly = $window.scrollTop() + $window.height() - this.$control.height() - this.controlattrs.offsety;
        this.$control.css({
            left: controlx + "px",
            top: controly + "px"
        });
    },
    togglecontrol: function() {
        var scrolltop = jQuery(window).scrollTop();
        if (!this.cssfixedsupport) {
            this.keepfixed();
        }
        this.state.shouldvisible = (scrolltop >= this.setting.startline) ? true : false;
        if (this.state.shouldvisible && !this.state.isvisible) {
            this.$control.stop().animate({
                opacity: 1
            }, this.setting.fadeduration[0]);
            this.state.isvisible = true;
        } else {
            if (this.state.shouldvisible == false && this.state.isvisible) {
                this.$control.stop().animate({
                    opacity: 0
                }, this.setting.fadeduration[1]);
                this.state.isvisible = false;
            }
        }
    },
    init: function() {
        var mainobj = scrolltotop;
        var iebrws = document.all;
        mainobj.cssfixedsupport = !iebrws || iebrws && document.compatMode == "CSS1Compat" && window.XMLHttpRequest;
        mainobj.$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $("html") : $("body")) : $("html,body");
        mainobj.$control = $('<div id="topcontrol" >' + mainobj.controlHTML + "</div>").css({
            position: mainobj.cssfixedsupport ? "fixed" : "absolute",
            bottom: mainobj.controlattrs.offsety,
            right: mainobj.controlattrs.offsetx,
            opacity: 0,
            cursor: "pointer"
        }).attr({
            title: "返回顶部"
        }).click(function() {
            mainobj.scrollup();
            return false;
        }).appendTo("body");
        if (document.all && !window.XMLHttpRequest && mainobj.$control.text() != "") {
            mainobj.$control.css({
                width: mainobj.$control.width()
            });
        }
        mainobj.togglecontrol();
        $('a[href="' + mainobj.anchorkeyword + '"]').click(function() {
            mainobj.scrollup();
            return false;
        });
        $(window).bind("scroll resize", function(e) {
            mainobj.togglecontrol();
        });
    }
};
scrolltotop.init();