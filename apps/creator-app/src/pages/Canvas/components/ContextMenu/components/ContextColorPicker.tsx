import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import { CanvasColorPicker } from '@/pages/Canvas/components/CanvasColorPicker';
import { EngineContext } from '@/pages/Canvas/contexts';

interface ContextColorPickerProps {
  defaultColorScheme?: COLOR_PICKER_CONSTANTS.ColorScheme;
  standardColor?: string;
}

export const ContextColorPicker: React.FC<ContextColorPickerProps> = ({
  defaultColorScheme = COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT,
  standardColor = COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR,
}) => {
  const engine = React.useContext(EngineContext)!;
  const targets = engine.activation.getTargets();
  const color = useSelector(CreatorV2.blockColorSelector, { id: targets[0] }) || standardColor;

  const onChange = React.useCallback(
    (color: string) => {
      engine.node.updateManyBlocksColor(targets, color);
    },
    [targets]
  );

  return (
    <CanvasColorPicker
      onChange={onChange}
      modifiers={[{ name: 'offset', options: { offset: [-42, 0] } }]}
      placement="right-start"
      selectedColor={color}
      defaultColorScheme={defaultColorScheme}
    />
  );
};
