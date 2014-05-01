var loginWs;
var loginConnStat = 0;
var accessToken = null;
var currentUser=null;

function openLoginWS() {
    loginWs = new WebSocket("ws://ideapool.kd.io:8080/login");
    loginWs.onopen = function(e){
        console.log("success connected to /login");
        loginConnStat = 1;
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
                    FB.api('/me', function (response) {
                        accessToken = response.authResponse.accessToken;
                        LoginSuccess(response);
                    });
                } else {
                    alert('!authResponse');
                }
            }, {
                scope: 'email'
            });
        }
    })
}


function FBLogout(){
    FB.logout(function(response) {
        // Person is now logged out
        currentUser = null;
        accessToken = null;
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
    if( !checkLogin() ){
        alert("You haven't login yet!");
        return null;
    }
    return accessToken;   
}
function setLogInfo(response)
{
    currentUser = response.id;
    loadBuffer(); /*from buffer.js*/
}
function checkLogin()
{
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