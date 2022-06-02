import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import { CanvasColorPicker } from '@/pages/Canvas/components/CanvasColorPicker';
import { EngineContext } from '@/pages/Canvas/contexts';

export const ContextColorPicker: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const targets = engine.activation.getTargets();
  const color = useSelector(CreatorV2.blockColorSelector, { id: targets[0] });

  const onChange = React.useCallback(
    (color: string) => {
      engine.node.updateManyBlocksColor(targets, color);
      engine.selection.reset();
    },
    [targets]
  );

  return (
    <CanvasColorPicker
      onChange={onChange}
      modifiers={[{ name: 'offset', options: { offset: [26, 0] } }]}
      selectedColor={color}
      defaultColorScheme="light"
      placement="right"
    />
  );
};
