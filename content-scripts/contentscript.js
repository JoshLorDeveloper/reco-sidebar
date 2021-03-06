// https://www.reddit.com/r/php/search.json?q=url%3Ahttp%3A%2F%2Fi.imgur.com%2FJeF3XcN.jpg&sort=hot
// https://www.reddit.com/submit.json?url=http%3A%2F%2Fi.imgur.com%2FJeF3XcN.jpg&sort=hot
//"https://www.reddit.com/r/php/search.json?restrict_sr=0&sort=" + attribute + "&limit=10&q=url%3A" + parentUrl;
//"https://www.reddit.com/api/info.json?restrict_sr=0&sort=" + attribute + "&limit=10&url=" + parentUrl;

// constants
var width = 300;
// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var parentDiv = document.createElement('div')
    parentDiv.id = "reco-sidebar-iframe-holder";
    parentDiv.style.cssText = 'position:fixed;top:0;right:0;display:block;background-color:white;' +
                           'height:100%;z-index:999999;width:' + width + 'px;';
    var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resources in manifest.json
    var url = getURL();
    iframe.src = chrome.runtime.getURL('views/frame.html') + "?url=" + encodeURIComponent(url); // comment out url addition if not requesting from iFrame
    iframe.frameBorder = "none";
    iframe.id = "reco-sidebar-iframe";
    iframe.style.cssText = 'left:0;top:0;width:100%;height:100%;';
    chrome.storage.local.get(['visible'], function(shouldBeVisible) {
      // Some styles for a fancy sidebar
      if(shouldBeVisible.visible){
        parentDiv.style.right = "0px";
      }else{
        parentDiv.style.right = "-" + width + "px";
      }
      parentDiv.appendChild(iframe);
      document.body.appendChild(parentDiv);
    });
}else{
    var url = getURL();
    var iframe = document.getElementById('reco-sidebar-iframe');
    iframe.src = chrome.runtime.getURL('views/frame.html') + "?url=" + encodeURIComponent(url);
}

// Maintain updated with getURL() function in update-iframe.js
function getURL(){
  var url;
  if(window.location.hostname.includes('.')){
    switch (window.location.hostname.split('.')[1]) {
      case "youtube":
          url = document.location.href.split('&')[0];
          break;
      case "netflix":
      case "nytimes":
      case "amazon":
          url = document.location.href.split('?')[0];
          break;
      default:
          url = document.location.href;
    }
  }else{
    url = document.location.href;
  }
  return url;
}
