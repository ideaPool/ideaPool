var submitIdeaWs;

window.onload = function() {
  if("WebSocket" in window) {
    opensubmitIdeaWs();
  }
  else {
    alert("WebSocket is NOT supported by your browser!");
  }
}

function opensubmitIdeaWs() {
  submitIdeaWs = new WebSocket("ws://ideapool.kd.io:8080/submitIdea");
  submitIdeaWs.onopen = function(e) {
    console.log("success connected to /submitIdea");
  };
  submitIdeaWs.onmessage = function(e) {
    var data = JSON.parse(e.data);
    console.log(data);
  };
  submitIdeaWs.onclose = function(e) {
    console.log("close connection with /submitIdea");
  };
}

function sendSubmit() {
   
  var file = document.getElementById("img").files[0];
  var curUser = null;
  var reader = new FileReader();

  if( !parent.checkLogin() ){
    alert('log in please!');
    return;
  }
  else{
      curUser = parent.getAccessToken();
  }
  


  // Make sure the file exists and is an image
  if(file && file.type.match("image")){
      reader.readAsDataURL(file); 
  }
  else{
    alert('no image chosen or wrong file type!');
    return;
  }
  // Sends the result of the file read as soon as the reader has
  // completed reading the image file.
  reader.onloadend = function(){
    console.log(document.getElementById("description").value);
    
    newIdea = { 
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      privacy: getCheckedRadioId('isPrivate'),
      img: reader.result
    };
    data = {
      tar: "submitIdea",
      idea: newIdea,
      accessToken: curUser
    }
    if(!data.idea.title){
        alert("there's no title!");
        return;
    }
    else if(!data.idea.privacy){
        alert("there's no privacy setting!");
        return;
    }
    if(data.idea.title && data.idea.description ) {
      submitIdeaWs.send(JSON.stringify(data));
      console.log("success send!");
    }
    else{
      alert('please check your format again!');
    }
  };  

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

function hideSelf(){
  parent.hideSubmit();
}