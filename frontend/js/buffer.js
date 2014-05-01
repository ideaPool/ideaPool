var bufferWs = null;
var bufferConnStat = 0;
var BUFF_VIEW_ID;

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
        }
    }; 
    bufferWs.onclose = function(e) {
        openBufferWS();
    }; 
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
    dom_title.innerHTML = idea.title;
    dom_title.className = "title";
    ideaView.appendChild(dom_title);

    var dom_img = document.createElement("img");
    dom_img.src = idea.img;
    ideaView.appendChild(dom_img);
    
    return ideaView;
    
}

/* often called by login.js*/
function loadBuffer()
{
    var data = {
        tar : "loadBuffer",
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