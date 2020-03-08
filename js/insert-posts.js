var recoIframe = document.getElementById('reco-sidebar-iframe');
recoIframe.contentWindow.postMessage({name: "loadPosts", posts: posts}, "chrome-extension://lffbnllboickhlcnphnbiimhbilgcgak/views/frame.html");
