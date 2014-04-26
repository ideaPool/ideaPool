var loginWs;
var loginConnStat = 0;
var currentUser=null;
function openLoginWS() {
    loginWs = new WebSocket("ws://ideapool.kd.io:8080/login");
    loginWs.onmessage = function(e) {
        console.log(e.data);
        var data = JSON.parse(e.data);
        if(data.tar == "connectSuccess"){
            loginConnStat = 1;
        }
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
            FB.api('/me', function (response) {
                LoginSuccess(response);
            });
        } else {
            FB.login(function (response) {
                if (response.authResponse) {
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
    })
}

function FBLogout(){
    FB.logout(function(response) {
        // Person is now logged out
        currentUser = null;
    });
}

function LoginSuccess(response){
    if( !loginConnStat ){
        console.log("connStat = : ", loginConnStat);
        setTimeout(FBLogin(), 3000);
        return ;
    }
    checkAndSaveUser(response);
    currentUser = response.id;
    alert("success login ya!!");
}
function checkAndSaveUser(response)
{
    var data = {
        tar : "userLogin",
        id : response.id,
        email : response.email
    };
    loginWs.send(JSON.stringify(data));   
    console.log(JSON.stringify(data));
}

function getCurrentUser()
{
    if(currentUser==null)
        alert("You haven't login yet!");
    return currentUser;   
}