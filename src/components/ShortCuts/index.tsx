import React from 'react';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';

import { BLOCK_REDESIGN_SHORTCUTS, SHORTCUTS } from './constants';

function Shortcuts() {
  const { isEnabled: isBlockRedesignEnabled } = useFeature(FeatureFlag.BLOCK_REDESIGN);
  const shortcuts = isBlockRedesignEnabled ? BLOCK_REDESIGN_SHORTCUTS : SHORTCUTS;

  return (
    <div className="px-3">
      {shortcuts.map(({ title, message }, index) => (
        <div key={index} className="shortcut">
          <div className="shortcut-desc">{title}</div>
          <div className="shortcut-cmd">{message}</div>
        </div>
      ))}
    </div>
  );
}

export default Shortcuts;
