var tnum = 'en';

$(document).ready(function(){
  
  $(document).click( function(e) {
       $('.translate_wrapper, .more_lang').removeClass('active');     
  });
  
  $('.translate_wrapper .current_lang').click(function(e){    
    e.stopPropagation();
    $(this).parent().toggleClass('active');
    
    setTimeout(function(){
      $('.more_lang').toggleClass('active');
    }, 5);
  });
  

  /*TRANSLATE*/
  translate(tnum);
  
  $('.more_lang .lang').click(function(){
    $(this).addClass('selected').siblings().removeClass('selected');
    $('.more_lang').removeClass('active');  
    
    var img = $(this).find('img').attr('src');    
    var lang = $(this).attr('data-value');
    var tnum = lang;
    translate(tnum);
    
    $('.current_lang .lang-txt').text(lang);
    $('.current_lang img').attr('src', img);
    $('body').attr('dir', 'ltr');
  });
});

function translate(tnum){
  $('.panel .lead').text(trans[0][tnum]);
  $('.panel p a .go-a').text(trans[1][tnum]);
  $('.panel p a .go-b').text(trans[2][tnum]);
  $('.panel .tags .tag-a').text(trans[3][tnum]);
  $('.panel .tags .tag-b').text(trans[4][tnum]);
  $('.panel .tags .tag-c').text(trans[5][tnum]);
  $('.text-a').text(trans[6][tnum]);
}

var trans = [ 
  { 
    en : 'Learning in Fuzhou,China',
    pt : 'Aprendendo em Fuzhou, na China',
    es : 'Aprendiendo en Fuzhou, China',
    fr : 'Apprendre à Fuzhou, en Chine',
    de : 'Lernen in Fuzhou, China', 
    cn : '在中国福州学习',
    tw : '在中國福州學習'
  },{ 
    en : 'My Blog',
    pt : 'Meu blog',
    es : 'Mi blog',
    fr: 'Mon blog',
    de: 'Mein Blog',
    cn: '我的博客',
    tw : '我的博客'
  },{ 
    en : 'AllenBy',
    pt : 'AllenBy',
    es : 'AllenBy',
    fr : 'AllenBy',
    de : 'AllenBy',
    cn : 'AllenBy',
    tw : 'AllenBy'
  },{
en:'Technology',
pt:'Tecnologia',
es:'Tecnología',
fr:'La technologie',
de:'Technologie',
cn:'技术',
tw:'技術'
},{
en:'Development',
pt:'Desenvolvimento',
es:'Desarrollo',
fr:'Développement',
de:'Entwicklung',
cn:'发展',
tw:'發展'
},{
en:'Science',
pt:'Ciência',
es:'Ciencia',
fr:'Science',
de:'Wissenschaft',
cn:'科学',
tw:'科學'
},{
en:'For privacy policy, part of it has been tampered with.',
pt:'Para a política de privacidade, parte dela foi adulterada.',
es:'Para la política de privacidad, una parte ha sido alterada.',
fr:'Pour la politique de confidentialité, une partie a été falsifiée.',
de:'Aus Datenschutzgründen wurde ein Teil davon manipuliert.',
cn:'对于隐私政策，部分内容已被篡改。',
tw:'對於隱私政策，部分內容已被篡改。'
},
  
];