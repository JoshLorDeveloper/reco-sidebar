chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.name == "loadPosts"){
      httpGetAsync(message.url, dataRecieved, sender.tab.id, sender.frameId);
    }
});

function dataRecieved(responseText, tabId, frameId)
{
  var posts = "";
  var parsedResponseText = JSON.parse(responseText)
  var data = parsedResponseText.data.children;
  if(parsedResponseText.data){
    for(postIndex in data){
      var postData = data[postIndex];
      var postHtml = '<li class="media"><a href="#" class="pull-left"><img src="https://bootdey.com/img/Content/user_1.jpg" alt="" class="img-circle"></a><div class="media-body"><span class="text-muted pull-right"><small class="text-muted">' + escape(postData.data.author) + '</small></span><strong class="text-success">' + escape(postData.data.title) + '</strong><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, <a href="#">#consecteturadipiscing </a>.</p></div></li>'
      posts+= postHtml;
    }
    chrome.tabs.executeScript(tabId, {
        code: 'var posts = \'' + posts + '\''
    }, function() {
      chrome.tabs.executeScript(tabId,{
          file: "js/insert-posts.js"
      });
    });
  }else{
    // not posts
  }
}

function httpGetAsync(theUrl, callback, tabId, frameId)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            callback(this.responseText, tabId, frameId);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send();
}


//////////  User Authentication

chrome.browserAction.onClicked.addListener(function(tab){
    //chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.executeScript(null, { file: "js/jquery.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "js/toggle-sidebar.js" });
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
  console.log("Access token available");
}

function refreshToken(refresh_token, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://www.reddit.com/api/v1/access_token", true);
  xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Authorization", "Basic " + btoa(config.clientId + ":" + config.clientSecret));
  xhr.onload = function() {
    var data = JSON.parse(this.responseText);
    data.expire_date = data.expires_in + (new Date() / 1000); // new Date() / 1000 is time since epoch
    delete data.expires_in;
    delete data.visible;
    delete data.error;
    delete data.message;
    delete data.token_type;
    chrome.storage.local.set(data, function(){
       if(callback){
         callback(data.access_token);
        }
    });
  }
  xhr.send("grant_type=refresh_token&refresh_token="+refresh_token);
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
          delete data.visible;
          delete data.error;
          delete data.message;
          delete data.token_type;
          chrome.storage.local.set(data, function(){
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
