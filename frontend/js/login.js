var loginWs;
var loginConnStat = 0;
var accessToken = null;
var currentUser=null;


function openLoginWS() {
    loginWs = new WebSocket("ws://ideapool.kd.io:8080/login");
    loginWs.onopen = function(e){
        console.log("success connected to /login");
        loginConnStat = 1;
        if(currentUser == null)
            checkLogin();
    }
    loginWs.onmessage = function(e) {
        
    }; 
    loginWs.onclose = function(e) {
        openLoginWS();
    }; 
}

function FBLogin(){
    if(!loginConnStat)
        openLoginWS();
    
    FB.init({
        appId: 1399324597007868,
        status: true,
        cookie: true,
        xfbml: true,
        channelURL: 'http://ideapool.kd.io/channel.html', //
        oauth: true
    });
    // 判斷是否已經有FB的login session 如果以登入 可以跳過登入的步驟進行下一步
    FB.getLoginStatus(function (response) {
        if (response.authResponse) {
            accessToken = response.authResponse.accessToken;
            FB.api('/me', function (response) {
                 setLogInfo(response);
            });
        } else {
            FB.login(function (response) {
                if (response.authResponse) {
                    accessToken = response.authResponse.accessToken;
                    FB.api('/me', function (response) {
                        LoginSuccess(response);
                    });
                } else {
                    alert('!authResponse');
                }
            }, {
                scope: 'email'
            });
        }
    });
}


function FBLogout(){
    FB.logout(function(response) {
        // Person is now logged out
        currentUser = null;
        accessToken = null;
        showFbLogin(); // in nav.js
        hideMySpace();  // in nav.js
        window.location.href="http://ideapool.kd.io/showIdea.html";
    });
}

function LoginSuccess(response){
    if( !loginConnStat ){
        alert("not connect to server yet!");
        console.log("connStat = : ", loginConnStat);
        setTimeout(FBLogin(), 3000);
        return ;
    }
    if(!currentUser)
        alert("success login ya!!");
    checkAndSaveUser(response);
    setLogInfo(response);
}

function checkAndSaveUser(response)
{
    var data = {
        tar : "userLogin",
        accessToken : accessToken
    };
    loginWs.send(JSON.stringify(data));   
    console.log(JSON.stringify(data));
}

function getAccessToken()
{
    if(accessToken!==null)
        return accessToken;
    else if( !checkLogin() ){
        alert("You haven't login yet!");
        return null;
    }
    return accessToken;   
}
function setLogInfo(response)
{
    currentUser = response.id;
    console.log("call loadBuffer!");
    checkAndSaveUser(response);
    loadBuffer(); /*from buffer.js*/
    hideFbLogin(); // in nav.js
    showMySpace(); // in nav.js
}
function checkLogin()
{
    
    FB.init({
        appId: 1399324597007868,
        status: true,
        cookie: true,
        xfbml: true,
        channelURL: 'http://ideapool.kd.io/channel.html', 
        oauth: true
    });
    FB.getLoginStatus(function (response) {
        if (response.authResponse) {
            accessToken = response.authResponse.accessToken;
            FB.api('/me', function (response) {
                setLogInfo(response);
            });
        }
    })
    
    if(currentUser!==null)
        return true;
    else return false;
    
}