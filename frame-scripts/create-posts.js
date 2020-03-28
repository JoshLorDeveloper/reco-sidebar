// wait for document to load
document.addEventListener("DOMContentLoaded", function(event) {
  var postButton = document.getElementById("postButton");
  var postContent = document.getElementById("postContent");
  var urlForPost = decodeURI(location.href.split('?url=')[1].split('?thread=')[0]);
  postButton.addEventListener("click", function() {
    var postData = {postType: "newThread", url: urlForPost, content: postContent.value, integer_date: new Date()*1}
    chrome.runtime.sendMessage({name:"createPost", postData: postData}, function () {
      chrome.storage.local.get(['buffered_posts'], function(retrieved_data) {
        var temparr = retrieved_data.buffered_posts;
        if(!Array.isArray(retrieved_data.buffered_posts)){
          temparr = [];
        }
        temparr.push(postData);
        chrome.storage.local.set({buffered_posts: temparr}, function(){
          window.location.reload();
        });
      });
    });
  }, false);
});
