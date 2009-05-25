/**
 * Shortkutz Firefox Extension
 * Author: Alvaro Gil, zevarito@gmail.com
 * Licensed under MIT license, see license.txt
 *
 **/

var Shortkutz = {
  
  displayedShortcuts : [],
  keys : [],
  lastKeydownHandler : null,

  onLoad : function() { 
    this.initializated = true;  
  },

  display : function() {
    if( this.displayedShortcuts.length == 0 ) {
      this.collectAndShow();
    }
    this.lastKeydownHandler = window.onkeypress;
    window.onkeydown = this.keyDown;
    window.setTimeout( this.hide, 3000, this );
  },

  hide : function( instance ) {
    while( element = instance.displayedShortcuts.pop() ) {
      element.parentNode.removeChild( element );
    }
    window.onkeydown= this.lastKeydownHandler;
  },
  
  keyDown : function( event ) {
    key_pressed = String.fromCharCode(event.keyCode);
    if( Shortkutz.keys[key_pressed] != null ) {
      Shortkutz.simulateClick( Shortkutz.keys[key_pressed] );
    }
  },  
  
  simulateClick : function(element) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var canceled = !element.dispatchEvent(evt);
    if(canceled) {
      // A handler called preventDefault
    } else {
      // None of the handlers called preventDefault
    }
  },

  collectAndShow : function() {
    this.displayedShortcuts = new Array(0);    
    this.keys = new Array(0);
    var links = content.document.getElementsByTagName("a");
    for( var i=0; i<links.length; i++ ) {
      var letter = this.defineLetterAccessKey( links[i].innerHTML );
      if( letter ) {
        div = this.drawLetter( links[i], letter );
        href = links[i].getAttribute("href");
        this.keys[letter] = links[i];
        this.displayedShortcuts.push( div );
      }
    }
  },

  defineLetterAccessKey : function( title ) {
    for( var i=0; i<title.length; i++ ) {
      var letter = title.charAt(i).toUpperCase();
      if( letter.match("[A-Z0-9]") != null && this.keys[letter] == null ) {
        return letter;
      }
    }
    return false;
  },
  
  drawLetter : function( ref_element, letter ) {
    var div = content.document.createElement("div");
    div.innerHTML = letter; 
    div.setAttribute("style", "background: #ffe849; border:solid 1px #000;" +
          "color:#000; font-size:90%; position:absolute; display:inline;" +
          "padding:1px; margin:1px; width:auto; min-width:15px;" +
          "text-align:center; -moz-border-radius:4px; opacity:.8");
    div.top = ref_element.top;
    div.left = ref_element.left;
    return ref_element.parentNode.insertBefore( div, ref_element );
  }

}

window.addEventListener("load", function(e) { Shortkutz.onLoad(e); }, false);

function dumpit(msg) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                        .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage("Shortkutz: " + msg);
}
