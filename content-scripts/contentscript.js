// https://www.reddit.com/r/php/search.json?q=url%3Ahttp%3A%2F%2Fi.imgur.com%2FJeF3XcN.jpg&sort=hot
//https://www.reddit.com/submit.json?url=http%3A%2F%2Fi.imgur.com%2FJeF3XcN.jpg&sort=hot

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
    iframe.src = chrome.runtime.getURL('views/frame.html') + "?url=" + encodeURIComponent(document.location); // comment out url addition if not requesting from iFrame
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
}
