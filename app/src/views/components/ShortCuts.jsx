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
