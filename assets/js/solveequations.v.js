var JsArray=new Array('/assets/js/solveequations.MO.v.js','/assets/js/solveequations.OM.v.js');
$('.ui.dropdown.s-type').dropdown();
$('.ui.dropdown.s-type').dropdown('set selected', 1);
changeType(1);
$('.ui.dropdown.s-type').on('change',function(){
changeType(parseInt($('.ui.dropdown.s-type').dropdown('get value')));
});
function changeType(type){
RemoveAllJsAtArray(JsArray);
if(type==1){
DynamicAddJs('/assets/js/solveequations.MO.v.js');
$("#AmountLabelText").text("未知数个数");
}else{
DynamicAddJs('/assets/js/solveequations.OM.v.js');
$("#AmountLabelText").text("最高项次数");
}
}
function FormVaildCheck(){
var amount=parseInt((($("#Amount").val()=="")?"0":$("#Amount").val()));
if(amount>=2 && amount<=10) return 1;
return 0;
}
function RemoveAllJsAtArray(arr){
for(var i=0;i<arr.length;i++){
DynamicRemoveJs(arr[i]);
}
}
function DynamicAddJs(src){
var head = $("head");
var script = $("<script>");
$(script).attr('type','text/javascript');
$(script).attr('src',src);
console.log('DynamicAddJs: add "'+src+'" successfully!'); 
$(head).append(script);
}
function DynamicRemoveJs(src){
$("script[src='"+src+"']").remove();
console.log('DynamicRemoveJs: remove "'+src+'" successfully!'); 
}