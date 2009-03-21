var Shortkutz = {
  
  displayedShortcuts : [],

  onLoad : function() { 
    this.initializated = true;  
  },

  display : function() {
    if(this.displayedShortcuts.length == 0) {
      this.collect();
    }
    window.setTimeout(this.hide, 3000, this);
  },

  hide : function(instance) {
    while( element = instance.displayedShortcuts.pop()) {
      element.parentNode.removeChild(element);
    }
  },
  
  collect : function() {
    this.displayedShortcuts = new Array(0);    
    var links = content.document.getElementsByTagName("a");
    for( var i=0; i<links.length; i++ ) {
      if( links[i].href != "" ) {
        if( div = this.drawKey(links[i]) ) {
          this.displayedShortcuts.push(div);
        }
      }
    }
  },

  drawKey : function(link) {
    var div = content.document.createElement("div");
    div.innerHTML = link.innerHTML[0].toUpperCase();
    div.setAttribute("class", "keystroke");
    div.setAttribute("style", "background: #ffe849; border:solid 1px #000; color:#000; font-weight:bold; position:absolute; display:inline; padding:1px; margin:1px; width:15px;");
    div.top = link.top;
    div.left = link.left;
    return link.parentNode.insertBefore(div, link);
  }

}

window.addEventListener("load", function(e) { Shortkutz.onLoad(e); }, false);

function myDump(aMessage) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                 .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage("Shortkutz: " + aMessage);
}
