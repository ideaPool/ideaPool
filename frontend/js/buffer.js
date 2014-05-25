var bufferWs = null;
var bufferConnStat = 0;
var BUFF_VIEW_ID;
var isBuffShow = 0;

window.onload = function() {
    openBufferWS();
}
function openBufferWS() 
{
    bufferWs = new WebSocket("ws://ideapool.kd.io:8080/buffer");
    bufferWs.onopen = function(e){
        console.log("success connected to /buffer");
        bufferConnStat = 1;
    }
    bufferWs.onmessage = function(e) {
        console.log(e.data);
        var data = JSON.parse(e.data);
        if(data.tar == "sendBuff"){
            buffView(data.buff, BUFF_VIEW_ID);
            allWallIdeasView(data.buff);
        }
        else if(data.tar == "signSuccess"){
            loadBuffer();
        }
    }; 
    bufferWs.onclose = function(e) {
        openBufferWS();
    }; 
}

function makeScrollBar()
{
    $('.scroll-pane').attr('class', 'scroll-pane');
    $(function()
    {
        $('.scroll-pane').jScrollPane(); 
    });
}

function buffView(buffList, buffViewId)
{
    var el = document.getElementById(buffViewId);
    $(el).empty(); /*clear inside things*/
    el.innerHTML = "Buffer:";
    var basic = document.createElement("div");
    el.appendChild(basic);
    for(var i in buffList){
        var view = buffIdeaView(buffList[i]);
        el.appendChild( view );
    }
    
}

/*
 set elements inside and class name, 
 real styling stuff should be set in css according to class name
*/
function buffIdeaView(idea)
{
    var ideaView = document.createElement("div");
    ideaView.className = "buffView";
    
    var dom_title = document.createElement("div");
    dom_title.innerHTML += idea.title;
    dom_title.className = "title";
    ideaView.appendChild(dom_title);

    var dom_del = document.createElement("div");
    dom_del.innerHTML = "[del]";
    dom_del.className = "del";
    //console.log("delBuffIdea("+ idea.id.toString() + ")");
    dom_del.setAttribute("onclick", "delBuffIdea("+ idea.id.toString() + ")");
    ideaView.appendChild(dom_del);

    var dom_img = document.createElement("img");
    dom_img.src = idea.img;
    ideaView.appendChild(dom_img);
    
    return ideaView;
    
}
function delBuffIdea(ideaId)
{
    var data = {
        tar : "delBuffIdea",
        ideaId: ideaId, 
        accessToken : accessToken
    };
    bufferWs.send(JSON.stringify(data));
}
/* often called by login.js (since this should be load only when logged in)*/
function loadBuffer()
{
    var data = {
        tar : "loadBuffer",
        accessToken : accessToken
    };
    bufferWs.send(JSON.stringify(data));
}

function signBuffer()
{
    var data = {
        tar : "signBuffer",
        accessToken : accessToken
    };
    bufferWs.send(JSON.stringify(data));
}

function parseId(idea_id)
{
    id = idea_id.split('_');
    return parseInt(id[1]);
}
function bufferIdea(idea_id)
{
    var id = parseId(idea_id);
    var idea = currentPageIdeas[id]; /* currentPageIdeas set in showIdea.js*/
    
    // getCurrentUser is in login.js
    var accessToken = getAccessToken();
    console.log("ideaId:", idea.id, "accessToken:", accessToken);
    if(accessToken!==null){
        var data = {
            tar : "bufferIdea",
            ideaId : idea.id,
            accessToken : accessToken
        };
        console.log(data);
        bufferWs.send(JSON.stringify(data));
    }
}

function clickBuffIcon()
{
    console.log('click_buff: ', isBuffShow);
    if(isBuffShow){
        hideBuff();
    }
    else{
        showBuff();
    }
}

function showBuff()
{
    console.log('#'+BUFF_VIEW_ID+'show');
    if(!iconIsDrag){
        $('#'+BUFF_VIEW_ID).css('display', 'block');
        $('.backWhite').css('display', 'block');
        hideIcon();
        isBuffShow = 1;
    }
}
function hideBuff()
{
    console.log('#'+BUFF_VIEW_ID+'hide');
    $('#'+BUFF_VIEW_ID).css('display', 'none');
    $('.backWhite').css('display', 'none');
    showIcon();
    isBuffShow = 0;
}
