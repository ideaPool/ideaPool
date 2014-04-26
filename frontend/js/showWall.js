function goToByScroll(id){
  $(window).unbind('scroll');
  disableScroll();
  console.log('goToByScroll '+id+': '+$("#"+id).offset().top);
  $('html,body').animate({scrollTop: $("#"+id).offset().top}, 'slow');
}

var lastWall;
var wallIds = [];
$(document).ready(function(){
  $('.wallBlockContainer').each(function(n){
    wallIds[n] = $(this).attr('id');
    console.log('wallIds['+n+'] = '+ wallIds[n]);
  })
  lastWall = 0;
});

var cnt = 0;
$(window).bind('scroll', autoScroll);
function autoScroll(){
  $(window).unbind('scroll');
  disableScroll();
  ++cnt;
  var lastTop = $('.wallBlockContainer').eq(lastWall).offset().top;
  var curTop = $(this).scrollTop();
  console.log(curTop, lastTop);
  if(/* lastWall>0 &&  */curTop+20<lastTop){
    goToByScroll(wallIds[lastWall-1]);
    --lastWall;
  }else if(/* lastWall<wallIds.length-1 &&  */curTop-20>lastTop){
    goToByScroll(wallIds[lastWall+1]);
    ++lastWall;
  }
  setTimeout(function(){$(window).bind('scroll', autoScroll)}, 1500);
  setTimeout(enableScroll, 1500);
  console.log('lastWall = wb' + (lastWall+1));
}

var directionKeys = [37, 38, 39, 40];
function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
    e.preventDefault();
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