// Used for page changes using history state updates

var url = getURL();
var iframe = document.getElementById('reco-sidebar-iframe');
// setting source of iframe also refreshes iframe
iframe.src = chrome.runtime.getURL('views/frame.html') + "?url=" + encodeURIComponent(url);

// Maintain updated with getURL() function in contentscript.js
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
