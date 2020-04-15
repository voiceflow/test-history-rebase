import React from 'react';

import { SHORTCUTS } from './constants';

function Shortcuts() {
  return (
    <div className="px-3">
      {SHORTCUTS.map(({ title, message }, index) => (
        <div key={index} className="shortcut">
          <div className="shortcut-desc">{title}</div>
          <div className="shortcut-cmd">{message}</div>
        </div>
      ))}
    </div>
  );
}

export default Shortcuts;
