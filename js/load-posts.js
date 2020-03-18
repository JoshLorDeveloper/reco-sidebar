window.addEventListener("message", loadPosts, false);
function loadPosts(msg){
  if(msg.data.name === "loadPosts"){
    document.getElementById('postBody').innerHTML = unescape(msg.data.posts);
  }
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            callback(this.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send();
}
