var iframe = document.getElementById("reco-sidebar-iframe");
if(iframe !== null){
  toggle()
}
function toggle(){
    if(iframe.style.right == ("-" + iframe.style.width)){
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
      $(iframe).animate({right: "0px", duration: 300 /*default 400*/});
  }
  else{
      $(iframe).animate({right: ("-" + iframe.style.width), duration: 300 /*default 400*/});
  }
}
