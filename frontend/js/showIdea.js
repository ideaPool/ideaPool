var ws;
var currentPageIdeas = null;
var currentDragId = null;

window.onload = function() {
    BUFF_VIEW_ID = "buff"; /*set buff.js global variable*/
    openWS();
}

function openWS(){
    if("WebSocket" in window) {
        console.log("browser support!");
        openBufferWS();
        openShowIdeaWS();
        openLoginWS();
    }
    else {
      console.log("browser don't support!");
    }
}
function openShowIdeaWS() {
    ws = new WebSocket("ws://ideapool.kd.io:8080/showIdea");
    ws.onopen = function(e){
        console.log("success connected to /idea");
        loadInfo();
    }
    ws.onmessage = function(e) {
        var data = JSON.parse(e.data);
        
        if(data.tar == "sendIdea"){
            currentPageIdeas = data.ideas; /* set a global var to be used in afterward times*/
            for(var i in data.ideas){
                var id = "idea_"+i.toString();
                fillIdeaBlock(data.ideas[i].title, data.ideas[i].description, data.ideas[i].owner, data.ideas[i].img, id);
            }
            closeLoadingIcon();
            //setTimeout(closeLoadingIcon(), 200); /* in loader.js*/
        }
    }; 
    ws.onclose = function(e) {
        openShowIdeaWS();
    }; 
}
function loadInfo(){
    var data = {
        tar : "loadInfo"
    };
    ws.send(JSON.stringify(data));
}

function fillIdeaBlock(title, description, owner, img){
    var ideaBlocks = document.getElementsByClassName("ideaBlock");
    $(ideaBlocks).empty();/*clear inside things*/
    for(var i=0 ; i<ideaBlocks.length ; i++ ){
        var dom_title = document.createElement("div");
        dom_title.innerHTML = title;
        dom_title.className = "title";
        ideaBlocks[i].appendChild(dom_title); 
        
        var dom_owner = document.createElement("div");
        dom_owner.className = "owner";
        dom_owner.innerHTML = owner;
        ideaBlocks[i].appendChild(dom_owner);
        
        var dom_description = document.createElement("div");
        dom_description.className = "description";
        dom_description.innerHTML = description;
        dom_description.style.display = "none";
        ideaBlocks[i].appendChild(dom_description);
        
        
        var dom_img = document.createElement("img");
        var el = document.getElementById(ideaBlocks[i].id);
        var w = '100%';
        var h = '100%';
        dom_img.src = img;
        dom_img.style.zIndex = -100;
        dom_img.style.position = "absolute";
        dom_img.style.top = "0";
        dom_img.style.left = '0'; 
        dom_img.style.width = w;
        dom_img.style.height = h;
        //dom_img.style.filter = "brightness(0.7) saturate(0.5)";
        ideaBlocks[i].appendChild(dom_img);
        
        var dom_filter = document.createElement("img");
        el = document.getElementById(ideaBlocks[i].id);
        w = '100%';
        h = '100%';
        dom_filter.style.zIndex = -99;
        dom_filter.style.position = "absolute";
        dom_filter.style.top = "0";
        dom_filter.style.left = '0'; 
        dom_filter.style.width = w;
        dom_filter.style.height = h;
        dom_filter.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%)";
        //dom_img.style.filter = "brightness(0.7) saturate(0.5)";
        ideaBlocks[i].appendChild(dom_filter);
        
        //ideaBlocks[i].onmousedown = "createSmallImg("+ideaBlocks[i].id+","+img+")";
    }
}

function fillIdeaBlock(title, description, owner, img, id){
    var ideaBlock = document.getElementById(id);
    console.log(id);
    $(ideaBlock).empty();/*clear inside things*/
    
    var dom_title = document.createElement("div");
    dom_title.innerHTML = title;
    dom_title.className = "title";
    ideaBlock.appendChild(dom_title); 
    
    var dom_owner = document.createElement("div");
    dom_owner.className = "owner";
    dom_owner.innerHTML = owner;
    ideaBlock.appendChild(dom_owner);
    
    var dom_description = document.createElement("div");
    dom_description.className = "description";
    dom_description.innerHTML = description;
    dom_description.style.display = "none";
    ideaBlock.appendChild(dom_description);
    
    
    var dom_img = document.createElement("img");
    var el = ideaBlock;
    var w = '100%';
    var h = '100%';
    dom_img.src = img;
    dom_img.style.zIndex = -100;
    dom_img.style.position = "absolute";
    dom_img.style.top = "0";
    dom_img.style.left = '0'; 
    dom_img.style.width = w;
    dom_img.style.height = h;
    //dom_img.style.filter = "brightness(0.7) saturate(0.5)";
    ideaBlock.appendChild(dom_img);
    
    var dom_filter = document.createElement("img");
    w = '100%';
    h = '100%';
    dom_filter.style.zIndex = -99;
    dom_filter.style.position = "absolute";
    dom_filter.style.top = "0";
    dom_filter.style.left = '0'; 
    dom_filter.style.width = w;
    dom_filter.style.height = h;
    dom_filter.style.background = "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0) 100%)";
    //dom_img.style.filter = "brightness(0.7) saturate(0.5)";
    ideaBlock.appendChild(dom_filter);
    
    //ideaBlocks[i].onmousedown = "createSmallImg("+ideaBlocks[i].id+","+img+")";
    
}


var changeBlockEnable = 1;
function nextBlock()
{
	if(changeBlockEnable){
        var el = document.getElementById('disp');
        var r = document.getElementById('click-r');
        var l = document.getElementById('click-l');
        var curLeft = parseInt(el.style.left);
        var change = 0;
        if( curLeft >= -70 ){
            //el.style.left = parseInt(el.style.left) - 80 + '%';
            change = 1;
            changeBlockEnable = 0;
        }
        $(function(){
            if(change==1)
                $("#disp").animate({
                    left: (curLeft-80) + '%'
                },500, function(){
                    changeBlockEnable = 1;
                    if( curLeft-80 <= -150 )
                        r.style.display = "none";
                    else{
                        r.style.display = "";
                        l.style.display = "";
                    }
                });
        });
        console.log(el.style.left);
    }
}
function preBlock()
{
	if(changeBlockEnable){
        var el = document.getElementById('disp');
        var r = document.getElementById('click-r');
        var l = document.getElementById('click-l');
        var curLeft = parseInt(el.style.left);
        var change = 0;
        if( curLeft <= -70 ){
            //el.style.left = parseInt(el.style.left) + 80 + '%';
            change = 1;
            changeBlockEnable = 0;
        }
        $(function(){
            if(change==1)
                $("#disp").animate({
                    left: (curLeft+80) + '%'
                },500, function(){
                    changeBlockEnable = 1;
                    if(  curLeft+80 >= 10 )
                        l.style.display = "none";
                    else {
                        r.style.display = "";
                        l.style.display = "";
                    }
                });
        });
        console.log(el.style.left);
	}
}
var enableCreateLarge = 1;
function createLarge(id)
{
	del('tmpLarge'); /* in case that some still exist*/
    if(enableCreateLarge==1){
        divL = createLargeDiv(id);
        enLargeChildImg(divL);
        $(divL).children().css("display", "block");
        makeDraggable();
        currentDragId = id;
    }
}
function enLargeChildImg(divL)
{
    var img = $("#"+divL.id).find("img");
    img.css('width', divL.style.width);
    img.css('height', divL.style.height);
    img.css('filter', 'saturate(0.5) brightness(0.5)');
    img.addClass('draggable');
}
function createLargeDiv(id)
{
    var el = document.getElementById(id);
    var el2 = el.cloneNode(1);
    var w = el.offsetWidth;
    var h = el.offsetHeight;
    el2.style.position = "absolute";
    el2.style.left =  el.offsetLeft - 0.15*w + 'px';
    el2.style.top = el.offsetTop - 0.15*h + 'px';
    el2.style.width = w*1.3+ 'px';
    el2.style.height = h*1.3 + 'px';
    el2.className = "createLarge draggable";
    el2.setAttribute("onmouseover", "");
    el2.setAttribute("onmouseout", "del('tmpLarge');");
    el2.id = "tmpLarge";

    el.parentNode.appendChild(el2);
    return el2;
}
function del(id)
{
	var el = document.getElementById(id);
	if(el!==null)   el.remove(); 
}
function createSmallImg(id, img)
{
    var dom_img = document.createElement("img");
    var el = document.getElementById(id);
    dom_img.src = img;
    dom_img.style.zIndex = 100;
    dom_img.style.position = "absolute";
    dom_img.style.top = "0";
    dom_img.style.left = '0'; 
    dom_img.style.width = '50 px'; 
    dom_img.style.height = '50 px';
    dom_img.id = 'tmpSmallImg';
    el.appendChild(dom_img);
} 
/* draggable */
$( document ).ready(makeDraggable());
function makeDraggable()
{
    var onMouseOut;
    var dragEl;
    $( ".draggable" ).draggable({
      helper: function() {
        //debugger;
        var tmp =  $(this).parent().find('img').clone();
        $(tmp.get(0)).css('z-index', '1010');
        $(tmp.get(1)).css('z-index', '1011');
        tmp.css('width', '160px');
        tmp.css('height', '120px');
        dragEl = $("<div></div>").append(tmp);
        $(this).parent().parent().append(dragEl);
        console.log("dragEL:", $(dragEl));
        del('tmpLarge');
        return dragEl;
      },
      revert: "invalid",
      cursor: "move",
      cursorAt: { top: 30, left: 30 },
      start: function(){
            $('.backGray').css('display', 'block');
            $('.droppable').css('display', 'block');
            onMouseOut = $('.draggable').attr('onmouseout');
            $('.draggable').attr('onmouseout', '');
            console.log($('.dragImg').parent());
            $('.icon').css('display', 'none');
      },
      drag: function(){
      },
      stop: function(){
            $('.draggable').attr('onmouseout', onMouseOut);
            $('.backGray').css('display', 'none');
            $('.droppable').css('display', 'none');
            $('.icon').css('display', 'block');
      }
    });
    $('.droppable').droppable({
        drop: function(){
            alert('Dropped!');
            $('.draggable').attr('onmouseout', onMouseOut);
            $('.droppable').css('display', 'none');
            if(currentDragId!==null){
                bufferIdea(currentDragId); /* this function is in buffer.js*/
            }
            currentDragId = null;
        }
    });
}

  
  