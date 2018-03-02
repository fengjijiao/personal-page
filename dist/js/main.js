refresh();
$.get("/i.php?ac=version&_="+new Date(),function(data){
if(data.version<45){
var tip='您使用的谷歌浏览器版本过低，为了更好地体验请将浏览器升级到最新版本！';
alert(tip);
$('body').html(tip);
top.location='https://www.google.cn/chrome/';
}
},'json');
var vConsole=new VConsole();
console.log('[system]', '当前时间戳:', (+new Date()));
$(".panel").attr("style","background:url('http://acg.bakayun.cn/randbg.php?Type=301') no-repeat;width:100%;height:100%;");
var bgmu=document.getElementById('bgmu');
setTimeout("bgmu.play();",2000);
$.get("/i.php?ac=count&_="+new Date(),function(data){
$('.queried-number').html(data.html);
},'json');
$.get("/i.php", function(data){
document.body.style.backgroundImage="url("+data.pic+")";
$("p.today-content").html(data.con);
},"json");
$.leftTime("2018/06/07 09:00:00",function(d){
if(d.status){
var $dateShow1=$("#countdown");
$dateShow1.find(".d").html(d.d);
$dateShow1.find(".h").html(d.h);
$dateShow1.find(".m").html(d.m);
$dateShow1.find(".s").html(d.s);
}
});
var birthDay=new Date("02/17/2018");
var now=new Date();
var duration=now.getTime()-birthDay.getTime(); 
var total=Math.floor(duration/(1000*60*60*24));
document.getElementById("showDays").innerHTML="It is safe to run for "+total+" day.";
console.info("It is safe to run for "+total+" day.");
$.getJSON("http://geoip.nekudo.com/api?callback=?",function(result){
var city=result.city;
console.info('City:'+city);
var country=result.country.name;
console.info('Country:'+country);
var latitude=result.location.latitude;
console.info('Latitude:'+latitude);
var longitude=result.location.longitude;
console.info('Longitude:'+longitude);
var ip=result.ip;
console.info('IP:'+ip);
$("p.ip-location").html("Location in "+city+","+country+"&nbsp;&nbsp;&nbsp;Lat:"+latitude+"&nbsp;Long:"+longitude);
});
console.log('[system]', '当前时间戳:', (+new Date()));
function refresh(){
$.get("/i.php?ac=count&_="+new Date(),function(data){
$('.queried-number').html(data.html);
},'json');
setTimeout("refresh();",Math.ceil(Math.random()*2000));
}