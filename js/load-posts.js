window.addEventListener("message", loadPosts, false);
function loadPosts(msg){
  if(msg.data.name === "loadPosts"){
    document.getElementById('postBody').innerHTML = unescape(msg.data.posts);
  }
}
