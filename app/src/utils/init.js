/*parse initialization*/
Parse.initialize("MInvF3dquDQPvEcWli7vsF3v2Uze9WNvXgQbnaeo", "U5dZkXQN2UwTRNEj7qPxd2sqWIQipeF0NbVgMiEa");
window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({
        appId      : '406112909597652',
//        status     : true,
        cookie     : true,
        xfbml      : false,
        version    : 'v2.4'
    });
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
