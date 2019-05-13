import React, { Component } from 'react'

class ShortCuts extends Component  {
  render(){
    return(
        <div className="px-3">
          <div className="shortcut">
            <div className="shortcut-desc">Save</div>
            <div className="shortcut-cmd"><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>S</kbd></div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Copy</div>
            <div className="shortcut-cmd"><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>C</kbd></div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Paste</div>
            <div className="shortcut-cmd"><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>V</kbd></div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Undo</div>
            <div className="shortcut-cmd"><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Z</kbd></div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Redo</div>
          <div className="shortcut-cmd"><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd></div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Comment</div>
          <div className="shortcut-cmd"><kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>/</kbd></div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Multiple Block Selection</div>
            <div className="shortcut-cmd"><kbd>Shift</kbd> + Drag</div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Search and Add Block</div>
            <div className="shortcut-cmd"><kbd>Space</kbd></div>
          </div>
          <div className="shortcut">
            <div className="shortcut-desc">Delete Block</div>
            <div className="shortcut-cmd"><kbd>Backspace</kbd></div>
          </div>
        </div>
    )
  }
}
export default ShortCuts;
