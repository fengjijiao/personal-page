<?php
@$ac=$_GET['ac'];
if($ac=='count'){
$path= "dist/images/number";//图片所在的文件夹子, img 是在相应文件夹下
 	$f_name = "num.txt";//计数器的数据保存在num.txt
	$n_digit = 10;
 	//如果文件不存在，则新建文件，初始值置为100/
	if(!file_exists($f_name)){
 	$fp=fopen($f_name,"w");
 	fputs($fp,"100");
 	fclose($fp);
 }
 	$fp=fopen($f_name,"r"); //打开num.txt文件
 	$hits=fgets($fp,$n_digit); //开始计取数据
 	fclose($fp); //关闭文件
 	$hits=(int)$hits + 1;//计数器增加1
 	$hits=(string)$hits; 
 	$fp=fopen($f_name,"w");
 	fputs($fp,$hits);//写入新的计数
 	fclose($fp); //关闭文件
	//循环读取并显示出图形计数器
        $data["text"]=$hits;
        $data["html"]='';
	for($i=0;$i<$n_digit;$i++) 
	$hits = str_replace("$i","<img src='$path/$i.gif'>","$hits");
	$data["html"].=$hits;
        
        echo json_encode($data);
}elseif($ac=='version'){
if(strstr($_SERVER['HTTP_USER_AGENT'],'Firefox')){
preg_match('/Firefox\/([\s\S]*?)\./',$_SERVER['HTTP_USER_AGENT'],$bvr);
}else{
if(strstr($_SERVER['HTTP_USER_AGENT'],'Chrome')){
preg_match('/Chrome\/([\s\S]*?)\./',$_SERVER['HTTP_USER_AGENT'],$bvr);
}else{
$bvr[1]='44';
}
}
$data['version']=(int)$bvr[1];
$data['ismobile']=ismobile();
echo json_encode($data);
}else{
session_start();
$time=time();
//print_r($_SESSION);
if(!isset($_SESSION["icache"])){
$_SESSION["icache"]=0;
}
if(!isset($_SESSION["idata"])){
$_SESSION["idata"]="";
}
if(($_SESSION["icache"]+3600<=$time) or $_SESSION["icache"]=="" or $_SESSION["idata"]==""){
$uri='http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&nc='.time().''.rand(100,999).'&pid=hp&video=1';
unset($_SESSION["idata"]);
unset($_SESSION["icache"]); 
$fi=json_decode(cget($uri),true);
if(!strstr($fi["images"][0]["url"],"http://")){
$fi["images"][0]["url"]="http://www.bing.com".$fi["images"][0]["url"]; 
} 
$_SESSION["idata"]=$fi;
$_SESSION["icache"]=$time; 
}else{
$fi=$_SESSION["idata"];
}
$cg["con"]=$fi["images"][0]["copyright"];
$cg["pic"]=$fi["images"][0]["url"];
echo json_encode($cg);
//print_r($_SESSION);
}
function cget($url){
	$ch=curl_init();
	curl_setopt($ch,CURLOPT_URL,$url);
//curl_setopt($ch,CURLOPT_IPRESOLVE,CURL_IPRESOLVE_V4); 	curl_setopt($ch,CURLOPT_USERAGENT,'MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1');
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	$result=curl_exec($ch);
	curl_close($ch);
	return $result;
}
function ismobile() {  
    // 如果有HTTP_X_WAP_PROFILE则一定是移动设备  
    if (isset ($_SERVER['HTTP_X_WAP_PROFILE']))  
        return true;  
      
    //此条摘自TPM智能切换模板引擎，适合TPM开发  
    if(isset ($_SERVER['HTTP_CLIENT']) &&'PhoneClient'==$_SERVER['HTTP_CLIENT'])  
        return true;  
    //如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息  
    if (isset ($_SERVER['HTTP_VIA']))  
        //找不到为flase,否则为true  
        return stristr($_SERVER['HTTP_VIA'], 'wap') ? true : false;  
    //判断手机发送的客户端标志,兼容性有待提高  
    if (isset ($_SERVER['HTTP_USER_AGENT'])) {  
        $clientkeywords = array(  
            'nokia','sony','ericsson','mot','samsung','htc','sgh','lg','sharp','sie-','philips','panasonic','alcatel','lenovo','iphone','ipod','blackberry','meizu','android','netfront','symbian','ucweb','windowsce','palm','operamini','operamobi','openwave','nexusone','cldc','midp','wap','mobile'  
        );  
        //从HTTP_USER_AGENT中查找手机浏览器的关键字  
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {  
            return true;  
        }  
    }  
    //协议法，因为有可能不准确，放到最后判断  
    if (isset ($_SERVER['HTTP_ACCEPT'])) {  
        // 如果只支持wml并且不支持html那一定是移动设备  
        // 如果支持wml和html但是wml在html之前则是移动设备  
        if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) {  
            return true;  
        }  
    }  
    return false;  
 }
?>