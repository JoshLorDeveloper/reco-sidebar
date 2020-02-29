var iframe = document.getElementById("reco-sidebar-iframe");
toggle()
function toggle(){
    if(iframe.style.right == "-" + width + "px"){
        setVisible(true)
        chrome.storage.local.set({visible: true}, function(){ console.log("saved true"); });
    }
    else{
        setVisible(false)
        chrome.storage.local.set({visible: false}, function(){ console.log("saved false"); });
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
