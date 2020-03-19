var iframe = document.getElementById("reco-sidebar-iframe");
if(iframe !== null){
  toggle()
}
function toggle(){
    if(iframe.style.right == "-" + ((width === undefined) ? iframe.style.width : width) + "px"){
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
      $(iframe).animate({right: "-" + width + "px", duration: 300 /*default 400*/});
  }
}
