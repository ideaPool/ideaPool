var changeIdeaEnable = 1;
var wallWs;
window.onload = function()
{
    BUFF_VIEW_ID = "wallBuffer";/*set buff.js global variable*/
    openWS();
    enScroll();
    
}
window.onresize = function(event) {
    enScroll();
}; 

function openWS(){
    if("WebSocket" in window) {
        console.log("browser support!");
        openBufferWS();
        openShowWallWS();
        openLoginWS();
    }
    else {
      console.log("browser don't support!");
    }
}

function openShowWallWS() {
    wallWs = new WebSocket("ws://ideapool.kd.io:8080/showWall");
    wallWs.onopen = function(e){
        console.log("success connected to /wall");
        loadWall();
    }
    wallWs.onmessage = function(e) {
        var data = JSON.parse(e.data);
        
        if(data.tar == "sendWall"){
            currentPageWalls = data.walls; /* set a global var to be used in afterward times*/
            console.log(data);
            showAllWalls(data.walls);
            //closeLoadingIcon();
            //setTimeout(closeLoadingIcon(), 200); /* in loader.js*/
        }
    }; 
    wallWs.onclose = function(e) {
        openShowWallWS();
    }; 
}

function loadWall(){
    var data = {
        tar : "loadWall"
    };
    wallWs.send(JSON.stringify(data));
}
function delWall(wallId){
    var accessToken = getAccessToken();
    var data = {
      tar : 'delWall',
      wallId : wallId,
      accessToken: accessToken
    };
    wallWs.send(JSON.stringify(data));
}
function enScroll()
{
    $(function()
    {
        $('.scroll-pane').jScrollPane();
    });
}
function clickLeft(icon){
    var block = $(icon).parent();
    var ideas = $(block).get(0).getElementsByClassName('wallIdea');
    if( changeIdeaEnable ) {
        changeIdeaEnable = 0;
        for( var i=0 ; i< ideas.length ; i++ ){
            if( ideas[i].style && (typeof ideas[i].style != 'undefined') ){
                var l = ideas[i].style.left;
                l = parseInt(l);
                if( 0===i && l+25 > 0)
                    break;
                $(function(){
                    $(ideas[i]).animate({
                        left: (l+25) + '%'
                    },150, function(){
                    });
                });
            }
        }
        setTimeout(function(){changeIdeaEnable = 1;}, 150);   
    }
    else{
        setTimeout(function(){clickLeft(icon);}, 150);
    }
}
function clickRight(icon){
    var block = $(icon).parent();
    var ideas = $(block).get(0).getElementsByClassName('wallIdea');
    if(ideas.length>4 && changeIdeaEnable){
        changeIdeaEnable = 0;
        for( var i=0 ; i<ideas.length ; i++ ){
            if( ideas[i].style && (typeof ideas[i].style != 'undefined') ){
                var l = ideas[i].style.left;
                l = parseInt(l);
                if(0===i && ideas.length>4 && l-25<=-1*25*(ideas.length-3))
                    break;
                console.log(-1*25*ideas.length);
                $(function(){
                    $(ideas[i]).animate({
                        left: (l-25) + '%'
                    },150, function(){
                    });
                });
            }
        }
        setTimeout(function(){changeIdeaEnable = 1;}, 150);
    }
    else{
        setTimeout(function(){clickRight(icon);}, 150);
    }
        
}
function showAllWalls(wallList)
{
    var el = document.getElementById('allWalls');
    $(el).empty(); /*clear inside things*/
    console.log("oao: ", wallList.length);
    
    for(var i=0 ; i< wallList.length ; i++ ){
        var view = getWallView(wallList[i], i);
        el.appendChild( view );
    }
}
function getWallView(wall, idNum)
{
    var wallContainer = document.createElement("div");
    wallContainer.className = "wallBlockContainer";
    wallContainer.id = "wb"+ idNum.toString();
    $(wallContainer).css('top', (idNum*100).toString()+'%');
    
    var wallView = document.createElement("div");
    wallView.className = "wallBlock"; 
//    var ideaView = document.createElement("div");
//    ideaView.className = "wallIdeaBlock";
    
    var dom_del = document.createElement("div");
    dom_del.innerHTML = 'X';
    dom_del.className = "delWall";
    $(dom_del).attr('onclick', 'delWall(' + wall.id.toString() + ')');
    wallView.appendChild(dom_del);
    
    var dom_title = document.createElement("div");
    $(dom_title).text( wall.title );
    dom_title.className = "wallTitle";
    wallView.appendChild(dom_title);

    var dom_dscprt = document.createElement("div");
    $(dom_dscprt).text( wall.description );
    dom_dscprt.className = "wallDscrpt scroll-pane";
    wallView.appendChild(dom_dscprt);
    
    var dom_ideas = document.createElement("div");
    dom_ideas.className = "wallIdeaBlock";
    dom_ideas.id = wallView.id + "_idea";
    wallView.appendChild(dom_ideas);
    allWallIdeasView(wall.ideaList, dom_ideas);
    
    wallView.innerHTML += ' <i onclick="clickRight(this);" class="fa fa-angle-right fa-2x" id="click-r" style="position:absolute; bottom:20%; right:3%; z-index:99;"></i>';
    wallView.innerHTML += ' <i onclick="clickLeft(this);" class="fa fa-angle-left fa-2x" id="click-l" style="position:absolute; bottom:20%; left:3%; z-index:99; " ></i>'
    
    wallContainer.appendChild(wallView);
    return wallContainer;
}
function allWallIdeasView(ideaList, wallIdeaBlock)
{
    if(wallIdeaBlock===null || typeof wallIdeaBlock == 'undefined')
        return;
    $(wallIdeaBlock).empty(); /*clear inside things*/
   
    for(var i=0 ; i<ideaList.length ; i++){
        var view = wallIdeaView(ideaList[i]);
        $(view).css('left', (i*25).toString()+'%');
        console.log((i*25).toString()+'%');
        wallIdeaBlock.appendChild( view );
    }
}
function wallIdeaView(idea)
{
    var ideaView = document.createElement("div");
    ideaView.className = "wallIdea";
    
//    var ideaView = document.createElement("div");
//    ideaView.className = "wallIdeaBlock";
    
    var dom_title = document.createElement("div");
    $(dom_title).text( idea.title );
    dom_title.className = "wallIdeaTitle";
    ideaView.appendChild(dom_title);

    var dom_img = document.createElement("img");
    dom_img.src = idea.img;
    ideaView.appendChild(dom_img);
    
    return ideaView;
    
}


var scrollEnable = 1;
function goToByScroll(id){
  $(window).unbind('scroll');
  disableScroll();
  if(scrollEnable){
    scrollEnable = 0;
    console.log('  Scroll to '+id);
    console.log('  goToByScroll '+id+': '+$("#"+id).offset().top+', cur: '+$('body').scrollTop());
    $('body').animate({scrollTop: $("#"+id).offset().top}, 1000, function(){
      // console.log('  ***** scroll done, cnt: '+cnt+', lastTop: '+lastTop+', cur: '+$('body').scrollTop()+' *****');
      // if(cnt<6){
      setTimeout(function(){$(window).bind('scroll', autoScroll);}, 100);
      setTimeout(enableScroll, 100);
      scrollEnable = 1;
      // lastTop = $('body').scrollTop();
      // }
    });
  }else{
    console.log('goToByScroll disabled');
  }
}

// var lastTop;
var wallIds = [];
$(document).ready(function(){
  $('.wallBlockContainer').each(function(n){
    wallIds[n] = $(this).attr('id');
    console.log('wallIds['+n+'] = '+ wallIds[n]);
  })
  goToByScroll(wallIds[0]);
});

function autoScroll(){
  $(window).unbind('scroll');
  disableScroll();
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