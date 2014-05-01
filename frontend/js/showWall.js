window.onload = function()
{
    BUFF_VIEW_ID = "wallBuffer";/*set buff.js global variable*/
    openWS();
    checkLogin(); /* in login.js*/ 
}

function openWS(){
    if("WebSocket" in window) {
        console.log("browser support!");
        openBufferWS();
    }
    else {
      console.log("browser don't support!");
    }
}

// var scrollEnable = 1;
function goToByScroll(id){
  // $(window).unbind('scroll');
  // disableScroll();
// if(scrollEnable){
  // scrollEnable = 0;
  console.log('  Scroll to '+id);
  console.log('  goToByScroll '+id+': '+$("#"+id).offset().top+', cur: '+$('body').scrollTop());
  $('body').animate({scrollTop: $("#"+id).offset().top}, 1000, function(){
    // console.log('  ***** scroll done, cnt: '+cnt+', lastTop: '+lastTop+', cur: '+$('body').scrollTop()+' *****');
    // if(cnt<6){
    setTimeout(function(){$(window).bind('scroll', autoScroll);}, 100);
    setTimeout(enableScroll, 100);
    // scrollEnable = 1;
    // lastTop = $('body').scrollTop();
    // }
  });
// }
}

// var lastTop;
var wallIds = [];
$(document).ready(function(){
  $('.wallBlockContainer').each(function(n){
    wallIds[n] = $(this).attr('id');
    console.log('wallIds['+n+'] = '+ wallIds[n]);
  })
  $(window).unbind('scroll');
  disableScroll();
  goToByScroll(wallIds[0]);
});

var cnt = 0;
$(document).ready(function(){
  $(window).bind('scroll', autoScroll);
});
function autoScroll(){
  $(window).unbind('scroll');
  disableScroll();
  ++cnt;
  var curTop = $(this).scrollTop();
  var nearestWall;
  var nearestDist = 100000000;
  $('.wallBlockContainer').each(function(n){
    if(nearestDist > Math.abs($(this).offset().top - curTop)){
      nearestDist = Math.abs($(this).offset().top - curTop);
      nearestWall = n;
    }
  });
  var lastTop;
  lastTop = $('#'+wallIds[nearestWall]).offset().top;
  console.log(curTop, lastTop);
  console.log('nearestWall = wb'+(nearestWall+1)+', last = '+lastTop+', cur = '+curTop);
  if(curTop<lastTop){
    if(nearestWall>0){
      console.log('Scroll up');
      goToByScroll(wallIds[nearestWall-1]);
    }else{
      goToByScroll(wallIds[0]);
    }
  }else if(curTop>lastTop){
    if(nearestWall<wallIds.length-1){
      console.log('Scroll down');
      goToByScroll(wallIds[nearestWall+1]);
    }else{
      goToByScroll(wallIds[wallIds.length-1]);
    }
  }else{
    goToByScroll(wallIds[nearestWall]);
  }
}

var directionKeys = [33, 34, 35, 36, 37, 38, 39, 40];
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
  else
    e.returnValue = false;  
}
function disableKeydown(e) {
  for (var i = directionKeys.length-1; i>=0; --i) {
    if (e.keyCode === directionKeys[i]) {
      preventDefault(e);
      return;
    }
  }
}
function disableWheel(e) {
  preventDefault(e);
}
function disableScroll() {
  if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', disableWheel, false);
  }
  window.onmousewheel = document.onmousewheel = disableWheel;
  document.onkeydown = disableKeydown;
}
function enableScroll() {
    if (window.removeEventListener) {
        window.removeEventListener('DOMMouseScroll', disableWheel, false);
    }
    window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
}