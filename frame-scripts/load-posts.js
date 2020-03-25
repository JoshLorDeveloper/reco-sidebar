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
  if(parsedResponseText.data){
    var data = parsedResponseText.data.children;
    chrome.storage.local.get(['buffered_posts','name'], function(retrieved_data) {
      var tempPosts = retrieved_data.buffered_posts;
      if(retrieved_data.name != null){
        for (bufferedPostIndex in tempPosts){
          var bufferedPostData = tempPosts[bufferedPostIndex];
          if(parentUrl === bufferedPostData.url){
            var timeSinceCreationString = timeSince(bufferedPostData.integer_date) + " ago"
            var postHtml = '<li class="media"><div class="media-body"><span class="text-muted pull-right"><small class="text-muted">' + timeSinceCreationString + '</small></span><strong class="text-success">' + retrieved_data.name + '</strong><p>' + bufferedPostData.content + '</p></div></li>'
            posts+= postHtml;
          }
        }
      }
      if(parsedResponseText.data.children.length > 0){
        loop1:
          for(postIndex in data){
            var postData = data[postIndex];
            if(retrieved_data.name!= null && postData.data.author === retrieved_data.name){
              loop2:
                for (var bufferedPostIndex = tempPosts.length - 1; bufferedPostIndex >=0; bufferedPostIndex--){
                  var bufferedPostData = tempPosts[bufferedPostIndex];
                  if(parentUrl === bufferedPostData.url && bufferedPostData.content != null && bufferedPostData.content === postData.data.title){
                    tempPosts.splice(bufferedPostIndex, 1);
                    continue loop1;
                  }
                }
            }
            var timeSinceCreationString = timeSince(postData.data.created_utc*1000) + " ago"
            var postHtml = '<li class="media"><div class="media-body"><span class="text-muted pull-right"><small class="text-muted">' + timeSinceCreationString + '</small></span><strong class="text-success">' + postData.data.author + '</strong><p>' + postData.data.title + '</p></div></li>'
            posts+= postHtml;
            if(postIndex == data.length - 1){
              document.getElementById('postBody').innerHTML = posts;
            }
          }
        if(parsedResponseText.data.children.length != tempPosts.lenth){
          chrome.storage.local.set({buffered_posts: tempPosts}, null);
        }
      }else{
        // no posts
      }
    });
  }
}

function timeSince(date) {
  var currentDate = new Date()
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
