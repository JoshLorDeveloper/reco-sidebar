var parentUrl = location.href.split('?url=')[1]
var url = "https://www.reddit.com/r/php/search.json?q=url%3A" + parentUrl + "&restrict_sr=0&sort=new&limit=10";
httpGetAsync(url, dataRecieved);

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

function dataRecieved(responseText)
{
  var posts = "";
  var parsedResponseText = JSON.parse(responseText)
  var data = parsedResponseText.data.children;
  if(parsedResponseText.data){
    for(postIndex in data){
      var postData = data[postIndex];
      var timeSinceCreationString = timeSince(postData.data.created_utc*1000) + " ago"
      var postHtml = '<li class="media"><div class="media-body"><span class="text-muted pull-right"><small class="text-muted">' + timeSinceCreationString + '</small></span><strong class="text-success">' + postData.data.author + '</strong><p>' + postData.data.title + '</p></div></li>'
      posts+= postHtml;
      if(postIndex == data.length - 1){
        document.getElementById('postBody').innerHTML = posts;
      }
    }
  }else{
    // no posts
  }
}

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
