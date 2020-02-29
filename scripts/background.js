chrome.browserAction.onClicked.addListener(function(tab){
    //chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.executeScript(null, { file: "js/jquery.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "js/content.js" });
      });
      //chrome.tabs.executeScript(null, { file: "/js/jquery.min.js" }, function() {
        //chrome.tabs.sendMessage(tabs[0].id,"toggle-reco-sidebar");
      //});
    //})
});

chrome.storage.local.get(['access_token', 'expire_date', 'refresh_token'], function(retrieved_data) {
  if(retrieved_data.refresh_token == null){
    authenticate(accessTokenAvailable);
  }else if(new Date() / 1000 >= retrieved_data.expire_date){
    refreshToken(retrieved_data.refresh_token, accessTokenAvailable);
  }else if(retrieved_data.access_token != null){
    accessTokenAvailable(retrieved_data.access_token);
  }else{
    console.log("access_token is not available")
  }
});

function accessTokenAvailable(access_token){
  console.log("saved data");
}

function refreshToken(refresh_token, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.reddit.com/api/v1/access_token", true);
  xhr.send(JSON.stringify({
    grant_type: "refresh_token",
    refresh_token: refresh_token
  }));

  xhr.onload = function() {
    var data = JSON.parse(this.responseText);
    data.expire_date = data.expires_in + (new Date() / 1000); // new Date() / 1000 is time since epoch
    delete data.expires_in;
    chrome.storage.local.set(data, function(){
       console.log("saved data");
       if(callback){
         callback(data.access_token);
        }
    });
  }
}

function authenticate(callback){
  const client_id = config.clientId;
  const redirectUri = chrome.identity.getRedirectURL("oauth2");
  const duration = "permanent";
  const scope = "edit read vote";
  const state = Math.random().toString(36).slice(2);
  var auth_url = "https://www.reddit.com/api/v1/authorize?client_id=" + client_id + "&response_type=code" + "&state=" + state + "&redirect_uri=" + redirectUri + "&duration=" + duration + "&scope=" + scope;

  chrome.identity.launchWebAuthFlow({'url':auth_url,'interactive':true}, function(redirect_url){
      if(getParameterByName("error", redirect_url) != null){
        console.log("error")
      }

      if(state == getParameterByName("state", redirect_url)){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://www.reddit.com/api/v1/access_token", true);
        xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", "Basic " + btoa(config.clientId + ":" + config.clientSecret));
        xhr.onload = function() {
          var data = JSON.parse(this.responseText);
          data.expire_date = data.expires_in + (new Date() / 1000); // new Date() / 1000 is time since epoch
          delete data.expires_in;
          chrome.storage.local.set(data, function(){
            console.log("saved data");
             if(callback){
               callback(data.access_token);
             }
          });
        }
        xhr.send("grant_type=authorization_code&code="+getParameterByName("code", redirect_url)+"&redirect_uri="+redirectUri);
      }
  });
}

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results || !results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
