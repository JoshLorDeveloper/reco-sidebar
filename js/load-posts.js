var parentUrl = location.href.split('?url=')[1]
var url = "https://www.reddit.com/r/php/search.json?q=url%3A" + parentUrl + "&restrict_sr=0&sort=top&limit=10";
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
      var postHtml = '<li class="media"><a href="#" class="pull-left"><img src="https://bootdey.com/img/Content/user_1.jpg" alt="" class="img-circle"></a><div class="media-body"><span class="text-muted pull-right"><small class="text-muted">' + escape(postData.data.author) + '</small></span><strong class="text-success">' + escape(postData.data.title) + '</strong><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, <a href="#">#consecteturadipiscing </a>.</p></div></li>'
      posts+= postHtml;
      if(postIndex == data.length - 1){
        document.getElementById('postBody').innerHTML = unescape(posts);
      }
    }
  }else{
    // no posts
  }
}
