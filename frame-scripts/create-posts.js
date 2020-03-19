chrome.runtime.sendMessage({name:"createPost", postData: null}, function (isPrepared) {
  if(isPrepared){
    console.log("post will be available shorty")
  }else{
    console.log("post may take a while to complete")
  }
});
