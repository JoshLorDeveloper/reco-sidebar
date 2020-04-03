// Used for page changes using history state updates

var url = getURL();
var iframe = document.getElementById('reco-sidebar-iframe');
// setting source of iframe also refreshes iframe
iframe.src = chrome.runtime.getURL('views/frame.html') + "?url=" + encodeURIComponent(url);

// Maintain updated with getURL() function in contentscript.js
function getURL(){
  var url;
  switch (window.location.hostname) {
    case "www.youtube.com":
        url = document.location.href.split('&')[0];
        break;
    case "www.netflix.com":
        url = document.location.href.split('?')[0];
        break;
    case "www.nytimes.com":
        url = document.location.href.split('?')[0];
        break;
    default:
        url = document.location.href;
  }
  return url;
}
