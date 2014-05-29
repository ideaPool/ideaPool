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
    var curUser = null;
    var reader = new FileReader();
    
    if( !parent.checkLogin() ){
        alert('Log in please!');
        return;
    }
    else{
      curUser = parent.getAccessToken();
    }
    
    var newIdea = { 
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      privacy: getCheckedRadioId('isPrivate')
    };
    if(!newIdea.title){
        alert("Please key in the title.");
        return;
    }
    if(!newIdea.privacy){
        alert("Please set the privacy.");
        return;
    }
    if(!newIdea.description){
        alert("Please key in the description.");
        return;
    }
    
    var imgChosen = getCheckedRadioValue('chooseImg');
    if(imgChosen==null){
        alert('Please choose or upload an image.');
        return;
    }
    
    var data = {
      tar: "submitIdea",
      accessToken: curUser
    };
    if(imgChosen==4){
        // Make sure the file exists and is an image
        var file = document.getElementById("img").files[0];
        if(file && file.type.match("image")){
          reader.readAsDataURL(file); 
        }
        else{
            alert('No image chosen or wrong file type!');
            return;
        }
        // Sends the result of the file read as soon as the reader has
        // completed reading the image file.
        reader.onloadend = function(){
            console.log(document.getElementById("description").value);
            newIdea.img = reader.result;
            data.idea = newIdea;
            if(data.idea.title && data.idea.description ) {
              submitIdeaWs.send(JSON.stringify(data));
              console.log("success send!");
            }
            else{
              alert('Please check your format again!');
            }
        };
    }else{
        newIdea.img = $('#googleImg'+imgChosen.toString()).attr('src');
        data.idea = newIdea;
        if(data.idea.title && data.idea.description ) {
          submitIdeaWs.send(JSON.stringify(data));
          console.log("success send!");
        }
        else{
          alert('Please check your format again!');
        }
    }

}


function getCheckedRadioId(name) {
    var elements = document.getElementsByName(name);

    for (var i=0, len=elements.length; i<len; ++i)
        if (elements[i].checked) return elements[i].id;

    return null;
}
function getCheckedRadioValue(name) {
    var elements = document.getElementsByName(name);

    for (var i=0, len=elements.length; i<len; ++i)
        if (elements[i].checked) return elements[i].value;

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

function showImg(){
  $('.imgContainerOuter').css('display', 'block');
}
function hideImg(){
  $('.imgContainerOuter').css('display', 'none');
}

function getImg(keyWord){
  //alert(keyWord);
  $.ajax({
    url: 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + keyWord + '&callback=myjsonpfunction',
    type:"GET",
    dataType: 'jsonp',
    jsonp: 'myjsonpfunction',
    async:'true',
    //success:function (data) {
    // alert("success");
    //}
  });
}
function myjsonpfunction(data){
  //alert(data.responseData.results)
  $('#img').empty();
  $.each(data.responseData.results,function(i,rows){
    $('#imgBlock'+i.toString()).empty();
    $('<img id="googleImg'+i.toString()+'" style="top:0%; left:0%; max-height:100%; max-width:100%;" src="'+rows.url+'" onerror="imgError(this)" />').appendTo('#imgBlock'+i.toString());
  });
}
function imgError(image){
  image.onerror = "";
  image.src = "img/403_forbidden.jpg";
  return true;
}
