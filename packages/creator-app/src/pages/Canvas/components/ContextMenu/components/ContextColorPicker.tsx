import { Utils } from '@voiceflow/common';
import { COLOR_PICKER_CONSTANTS, ColorPickerPopper, normalizeColor, useDebouncedCallback } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import { EngineContext } from '@/pages/Canvas/contexts';

export const ContextColorPicker: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const targets = engine.activation.getTargets();
  const color = useSelector(CreatorV2.blockColorSelector, { id: targets[0] });

  const debouncedSetColor = useDebouncedCallback(
    100,
    (color) => {
      engine.node.updateManyBlocksColor(targets, color);
      engine.selection.reset();
    },
    []
  );

  const [selectedHex, setLocalSelectedHex] = React.useState(() => normalizeColor(color));

  return (
    <ColorPickerPopper
      defaultColorScheme="light"
      colors={COLOR_PICKER_CONSTANTS.DEFAULT_THEMES}
      onChange={Utils.functional.chain(debouncedSetColor, setLocalSelectedHex)}
      selectedColor={selectedHex}
      modifiers={[{ name: 'offset', options: { offset: [187, 43] } }]}
    />
  );
};
