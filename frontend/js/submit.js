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
    submitIdeaWs = new WebSocket("submitIdeaWs://ideapool.kd.io:8080/submitIdea");
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

  var reader = new FileReader();

  // Make sure the file exists and is an image
  if(file && file.type.match("image")){
      reader.readAsDataURL(file);
  }
  else{
    alert('no image chosen or worng file type!');
    return;
  }
  // Sends the result of the file read as soon as the reader has
  // completed reading the image file.
  reader.onloadend = function(){
    newIdea = { 
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      owner: document.getElementById("owner").value,
      publicity: getCheckedRadioId('isPrivate'),
      img: reader.result
    };
    data = {
      tar: "submitIdea",
      idea: newIdea
    }
    if(data.idea.title && data.idea.description && data.idea.owner ) {
      submitIdeaWs.send(JSON.stringify(data));
    }
    else{
      alert('please check your format again!');
      return;
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
  hideSubmit();
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