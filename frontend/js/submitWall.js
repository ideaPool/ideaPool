var submitWallWs;

window.onload = function() {
  if("WebSocket" in window) {
    opensubmitWallWs();
  }
  else {
    alert("WebSocket is NOT supported by your browser!");
  }
}

function opensubmitWallWs() {
  submitWallWs = new WebSocket("ws://ideapool.kd.io:8080/submitWall");
  submitWallWs.onopen = function(e) {
    console.log("success connected to /submitWall");
  };
  submitWallWs.onmessage = function(e) {
    var data = JSON.parse(e.data);
    console.log(data);
  };
  submitWallWs.onclose = function(e) {
    console.log("close connection with /submitWall");
  };
}

function sendSubmit() {
    var curUser;
    
    if( !parent.checkLogin() ){
        alert('log in please!');
        return;
    }
    else{
      curUser = parent.getAccessToken();
    }
    
    newWall = { 
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        privacy: getCheckedRadioId('isPrivate'),
    };
    data = {
        tar: "submitWall",
        wall: newWall,
        accessToken: curUser
    };
  
    if(data.wall.title && data.wall.description  ) {
        submitWallWs.send(JSON.stringify(data));
        alert('success submit!');
        console.log(JSON.stringify(data));
    }
    else{
        alert('please check your format again!');
        return;
    }
}


function getCheckedRadioId(name) {
    var elements = document.getElementsByName(name);

    for (var i=0, len=elements.length; i<len; ++i)
        if (elements[i].checked) return elements[i].id;

    return null;
}

function clickSubmitButtom()
{
    hideSelf();
    sendSubmit();
}

function showSubmit(){
    if(!iconIsDrag){
        $('#submitContainer').css('display','inline');
        //$('.backWhite').css('display', 'block');
        isBuffShow = 1;
    }
}

function hideSubmit(){
  $('#submitContainer').css('display','none');
}