var iframeHolder = document.getElementById("reco-sidebar-iframe-holder");
if(iframeHolder !== null){
  toggle()
}
function toggle(){
    if(iframeHolder.style.right == ("-" + iframeHolder.style.width)){
        setVisible(true)
        chrome.storage.local.set({visible: true}, null);
    }
    else{
        setVisible(false)
        chrome.storage.local.set({visible: false}, null);
    }
}

function setVisible(isVisible){
  if(isVisible){
      $(iframeHolder).animate({right: "0px", duration: 300 /*default 400*/});
  }
  else{
      $(iframeHolder).animate({right: ("-" + iframeHolder.style.width), duration: 300 /*default 400*/});
  }
}
