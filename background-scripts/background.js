////////// Toggle Sidebar
chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.executeScript(tabs[0].id, { file: "resources/jquery.min.js" }, function() {
        chrome.tabs.executeScript(tabs[0].id, { file: "content-scripts/toggle-sidebar.js" });
      });
    })
});

////////// Message passing for user authentication
var postBuffer = []
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if(message.name == "createPost" && message.postData != null){
    sendResponse();
    chrome.storage.local.get(['access_token', 'expire_date'], function(retrieved_data) {
      if(retrieved_data.access_token == null || new Date() / 1000 >= retrieved_data.expire_date){
        postBuffer.push(message.postData);
        // only get access token if needed, this can be chagned for performance purposes
        getAccessToken()
      }else{
        createNewPostForUser(message.postData, retrieved_data.access_token);
      }
    });
  }
});

////////// use reddit api to create a post for user based on the post's data
function createNewPostForUser(postData, access_token){
  var xhr = new XMLHttpRequest();
  var url = "https://oauth.reddit.com/api/" + (postData.postType == "newThread" ? "submit" : "comment");
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
  xhr.onload = function() {
    console.log(JSON.parse(this.responseText));
  }
  if(postData.postType === "newThread"){
    xhr.send("api_type=json&kind=link&sr=test&resubmit=true&url="+postData.url+"&title="+postData.content);
  }else if(postData.postType === "comment"){
    xhr.send("api_type=json&thing_id="+postData.threadId+"&text="+postData.content);
  }else{
    xhr = null
    console.log("Invalid post type")
  }
}

//////////  User Authentication
function getAccessToken(){
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
}

// when the access token becomes available, send it to all tabs in the buffer and store the access token
// so that it does not need to be accessed from chrome.storage.local.get
function accessTokenAvailable(access_token){
  for(postDataIndex in postBuffer){
    createNewPostForUser(postBuffer[postDataIndex], access_token);
  }
  postBuffer = []
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
  const scope = "edit read vote submit";
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
          var data = JSON.parse(xhr.responseText);
          data.expire_date = data.expires_in + (new Date() / 1000); // new Date() / 1000 is time since epoch
          delete data.expires_in;
          delete data.visible;
          delete data.error;
          delete data.message;
          delete data.token_type;
          var xhr2 = new XMLHttpRequest();
          xhr2.open("GET", "https://oauth.reddit.com/api/v1/me", true);
          xhr2.setRequestHeader('Authorization', 'Bearer ' + data.access_token);
          xhr2.onload = function() {
            data.name = JSON.parse(xhr2.responseText).name;
            chrome.storage.local.set(data, function(){
               if(callback){
                 callback(data.access_token);
               }
            });
          }
          xhr2.send();
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
