// wait for document to load
document.addEventListener("DOMContentLoaded", function(event) {
  var postButton = document.getElementById("postButton");
  var postContent = document.getElementById("postContent");
  var urlForPost = decodeURI(location.href.split('?url=')[1]);
  postButton.addEventListener("click", function() {
    var postData = {postType: "newThread", url: urlForPost, content: postContent.value}
    chrome.runtime.sendMessage({name:"createPost", postData: postData}, function (isPrepared) {
      if(isPrepared){
        console.log("post will be available shorty")
      }else{
        console.log("post may take a while to complete")
      }
    });
  }, false);
});
