function FBLogin(){
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
    });
}

function LoginSuccess(response){
    alert("success login ya!!");
    console.log(response); 
}