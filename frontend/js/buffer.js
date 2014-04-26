var bufferWs;
var bufferConnStat = 0;

function openBufferWS() {
    bufferWs = new WebSocket("ws://ideapool.kd.io:8080/buffer");
    bufferWs.onmessage = function(e) {
        console.log(e.data);
        var data = JSON.parse(e.data);
        if(data.tar == "connectSuccess"){
            bufferConnStat = 1;
            loadBuffer();
        }
    }; 
    bufferWs.onclose = function(e) {
        openBufferWS();
    }; 
}
function loadBuffer(){
    var data = {
        tar : "loadBuffer"
    };
    bufferWs.send(JSON.stringify(data));
}
function parseId(idea_id)
{
    id = idea_id.split('_');
    return parseInt(id[1]);
}
function bufferIdea(idea_id){
    var id = parseId(idea_id);
    var idea = currentPageIdeas[id];
    
    // getCurrentUser is in login.js
    var userId = getCurrentUser();
    console.log("ideaId:", idea.id, "userId:", userId);
    if(getCurrentUser()!=null){
        var data = {
            tar : "bufferIdea",
            ideaId : idea.id,
            userId : userId
        };
        console.log(data);
        bufferWs.send(JSON.stringify(data));
    }
}