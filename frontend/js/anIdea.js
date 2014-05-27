var ideaId;
window.onload = function() {
    openWS();
} 

function openWS(){
    if("WebSocket" in window) {
        console.log("browser support!");
        openAnIdeaWS();
    }
    else {
      console.log("browser don't support!");
    }
}
function openAnIdeaWS() {
    ws = new WebSocket("ws://ideapool.kd.io:8080/anIdea");
    ws.onopen = function(e){
        console.log("success connected to /anIdea");
        loadAnIdea();
    }
    ws.onmessage = function(e) {
        var data = JSON.parse(e.data);
    
        if(data.tar == "sendAnIdea"){
            var idea = data.idea; /* set a global var to be used in afterward times*/
            console.log(idea);
            closeLoadingIcon(); /* in loader.js*/
            viewIdea(idea);
            closeLoadingIcon();
        }
    }; 
    ws.onclose = function(e) {
        openAnIdeaWS();
    }; 
}
function viewIdea(idea)
{
    $('.anIdeaTitle').text('Title: ' + idea.title);
    $('.anIdeaAuthor').text('Owner: ' + idea.owner);
    $('.anIdeaImg').attr('src', idea.img);
    var dscrpt = $('.anIdeaDscrpt').text(idea.description).html();
    console.log(dscrpt);
    $('.anIdeaDscrpt').html( dscrpt.replace(/\n/g, "<br>") );
}
function loadAnIdea(){
    var data = {
        tar : "loadAnIdea", 
        id : ideaId
    };
    ws.send(JSON.stringify(data));
}

function hideAnIdea(){
    parent.hideAnIdea();
    $('body').hide();
    $('body').css('opacity', 0);
}

// get parameter
$(document).ready(function(){
  var url=window.location.toString();
  var str="";
  var str_value="";
  if(url.indexOf("?")!=-1){
      var ary=url.split("?")[1].split("&");
      for(var i in ary){
          str=ary[i].split("=")[0];
          if (str == "id") {
              str_value = decodeURI(ary[i].split("=")[1]);
          }
      }
  }
  ideaId = str_value;
});

// test
//var id;
//$(document).ready(function(){
//  $('#button').draggable();
//  $('#button').click(function(event){
//    showAnIdea();
//  });
//  var name = {str: 'name'};
//  //getName(name, "https://graph.facebook.com/100002031714388");
//  //setTimeout(function(){alert('4 '+name.str);}, 500);
//  // getName("https://graph.facebook.com/100002031714388");
//});
//function getName(obj, url){
//  $.getJSON(url, function(result){
//    obj.str = result.name;
//    id = result.name;
//    //alert('1 '+obj.str);
//    //alert('2 '+id);
//  });
//}