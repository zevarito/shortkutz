/**
 * Shortkutz Firefox Extension
 * Author: Alvaro Gil, zevarito@gmail.com
 * Licensed under MIT license, see license.txt
 *
 **/

var Shortkutz = {
  
  displayed_shortcuts : [],
  paged_links : [],
  keys : [],
  timer : null,

  onLoad : function() { 
    this.initializated = true;  
  },

  display : function() {
    this.hide(this);
    this.collectAndShow();
    window.onkeydown = this.keyDown;
    this.timer = window.setTimeout( this.hide, 3000, this );
  },

  hide : function( instance ) {
    while( element = instance.displayed_shortcuts.pop() ) {
      element.parentNode.removeChild( element );
    }
    window.onkeydown = null;
    clearTimeout(this.timer);
  },
  
  keyDown : function( event ) {
    key_pressed = String.fromCharCode(event.keyCode);
    if(event.altKey == true && event.ctrlKey) {
      event.stopPropagation();
      return true;
    }

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
    this.displayed_shortcuts = new Array(0);    
    this.keys = new Array(0);
    var links_to_display = new Array(0);
    var all_links = content.document.getElementsByTagName("a");

    if(all_links.length <= this.paged_links.length) {
      this.paged_links = new Array(0);
    }

    for( var i=0; i<all_links.length; i++ ) {
      found = false;

      for( var j=0; j<this.paged_links.length; j++ ) {
        if(this.paged_links[j] == all_links[i]) {
          found = true;
        }
      }
      if(!found) {
        links_to_display.push(all_links[i]);
      }
    }

    for( var i=0; i<links_to_display.length; i++ ) {
      var letter = this.defineLetterAccessKey( links_to_display[i].innerHTML );
      if( letter ) {
        this.paged_links.push(links_to_display[i]);
        div = this.drawLetter( links_to_display[i], letter );
        href = links_to_display[i].getAttribute("href");
        this.keys[letter] = links_to_display[i];
        this.displayed_shortcuts.push( div );
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
          "text-align:center; -moz-border-radius:4px; opacity:.85");
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
