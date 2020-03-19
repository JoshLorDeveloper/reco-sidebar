// https://www.reddit.com/r/php/search.json?q=url%3Ahttp%3A%2F%2Fi.imgur.com%2FJeF3XcN.jpg&sort=hot
//https://www.reddit.com/submit.json?url=http%3A%2F%2Fi.imgur.com%2FJeF3XcN.jpg&sort=hot

var width = 300;
// Avoid recursive frame insertion...
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('views/frame.html') + "?url=" + encodeURIComponent(document.location); // comment out url addition if not requesting from iFrame
    iframe.frameBorder = "none";
    iframe.id = "reco-sidebar-iframe";
    iframe.addEventListener('load', function (e) {
            // Either set the value of input element in Iframe
            // here or pass an event to background.js and set it from there
        }, false);
    chrome.storage.local.get(['visible'], function(shouldBeVisible) {
      // Some styles for a fancy sidebar
      iframe.style.cssText = 'position:fixed;top:0;display:block;' +
                             'height:100%;z-index:999999;width:300px;';
      if(shouldBeVisible.visible){
        iframe.style.right = "0px";
      }else{
        iframe.style.right = "-" + width + "px";
      }
      //setVisible(shouldBeVisible.visible)
      document.body.appendChild(iframe);
      chrome.runtime.sendMessage({name:"ready"});
    });

}
