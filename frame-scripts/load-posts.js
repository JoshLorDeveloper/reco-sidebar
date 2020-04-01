var params = location.href.split('?url=')[1].split('?thread=');
var parentUrl = params[0];
var url;
if(params.length == 1){
  //"https://www.reddit.com/r/php/search.json?restrict_sr=0&sort=" + attribute + "&limit=10&q=url%3A" + parentUrl;
  //"https://www.reddit.com/api/info.json?restrict_sr=0&sort=" + attribute + "&limit=10&url=" + parentUrl;
  url = "https://www.reddit.com/r/php/search.json?restrict_sr=0&sort=top&limit=10&q=url%3A" + parentUrl;
  httpGetAsync(url, dataRecieved);
}else{
  // showing comments not yet supported
  var responsePostInfo = JSON.parse(params[1])
  url = "https://www.reddit.com/r/" + responsePostInfo.subreddit + "/comments/" + responsePostInfo.thread_id + ".json" + responsePostInfo.comment_id != null ? ("?comment=" + responsePostInfo.comment_id) : "";
  //httpGetAsync(url, dataRecieved);
}

document.addEventListener("DOMContentLoaded", function(event) {
  var elements = document.getElementsByClassName("dropdownOption");

  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", changeSort);
  }
});

function changeSort() {
    var attribute = this.getAttribute("value");
    url = "https://www.reddit.com/r/php/search.json?restrict_sr=0&sort=" + attribute + "&limit=10&q=url%3A" + parentUrl;
    document.getElementById('postBody').innerHTML = '<div class="loader"></div>';
    httpGetAsync(url, dataRecieved);
};

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
      if(retrieved_data.name != null && retrieved_data.buffered_posts != null){
        for (var bufferedPostIndex = tempPosts.length - 1; bufferedPostIndex >=0; bufferedPostIndex--){
          var bufferedPostData = tempPosts[bufferedPostIndex];
          if(parentUrl === bufferedPostData.url){
            if(data.length > 0 && data[data.length-1].data.created_utc*1000 > bufferedPostData.integer_date){
              tempPosts.splice(bufferedPostIndex, 1);
              continue;
            }
            var timeSinceCreationString = timeSince(bufferedPostData.integer_date) + " ago"
            var postHtml = '<li class="media"><div class="media-body"><span class="text-muted pull-right"><small class="text-muted">' + timeSinceCreationString + '</small></span><strong class="text-success">' + retrieved_data.name + '</strong><p>' + bufferedPostData.content + '</p></div></li>'
            posts+= postHtml;
          }
        }
      }
      if(data.length > 0){
        loop1:
          for(postIndex in data){
            var postData = data[postIndex];
            if(retrieved_data.name!= null && retrieved_data.buffered_posts != null && postData.data.author === retrieved_data.name){
              loop2:
                for (var bufferedPostIndex = tempPosts.length - 1; bufferedPostIndex >=0; bufferedPostIndex--){
                  var bufferedPostData = tempPosts[bufferedPostIndex];
                  if(parentUrl === bufferedPostData.url && bufferedPostData.content != null && bufferedPostData.content === postData.data.title){
                    tempPosts.splice(bufferedPostIndex, 1);
                    if(postIndex == data.length - 1){
                      document.getElementById('postBody').innerHTML = posts;
                    }
                    continue loop1;
                  }
                }
            }
            var timeSinceCreationString = timeSince(postData.data.created_utc*1000) + " ago";
            var numRepliesString;
            switch(postData.data.num_comments) {
              case 0:
                numRepliesString = '';
                break;
              case 1:
                numRepliesString = '<br style="line-height: 15px;"><p class="link">View 1 reply</p>';
                break;
              default:
                numRepliesString = '<br style="line-height: 15px;"><p class="link">View ' + postData.data.num_comments + ' replies</p>';
            }
            var postHtml = '<li class="media"><div class="media-body"><span class="text-muted pull-right"><small class="text-muted">' + timeSinceCreationString + '</small></span><strong class="text-success">' + postData.data.author + '</strong><a class="invisbleLink" target="_blank" href="' + ("https://www.reddit.com/r/" + postData.data.subreddit + "/comments/" + postData.data.id) + '"><p>' + postData.data.title + '</p>' + numRepliesString + '</a></div></li>'
            posts+= postHtml;
            if(postIndex == data.length - 1){
              document.getElementById('postBody').innerHTML = posts;
            }
          }
        if(tempPosts != null && parsedResponseText.data.children.length != tempPosts.lenth){
          chrome.storage.local.set({buffered_posts: tempPosts}, null);
        }
      }else{
        if(posts != ""){
          document.getElementById('postBody').innerHTML = posts;
        }else{
          document.getElementById('postBody').innerHTML =  '<li class="media"><div class="media-body"><p class="text-muted centerText">No comments</p></div></li>';
        }
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
