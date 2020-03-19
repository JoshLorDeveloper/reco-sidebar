var recoIframe = document.getElementById('reco-sidebar-iframe');
recoIframe.contentWindow.postMessage({name: "loadPosts", posts: posts}, "chrome-extension://blefdlfeohnnodmoamlphbkcmhaagjdi/views/frame.html");
