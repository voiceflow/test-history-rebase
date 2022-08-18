import { COLOR_PICKER_CONSTANTS } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import { TemplateLibraryPopper, TemplateLibraryPopperRef } from '@/pages/Canvas/components/TemplateLibraryPopper';
import { EngineContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks/canvas';

interface ContextTemplateLibraryProps {
  defaultColorScheme?: COLOR_PICKER_CONSTANTS.ColorScheme;
}

export const ContextTemplateLibrary: React.FC<ContextTemplateLibraryProps> = ({ defaultColorScheme = COLOR_PICKER_CONSTANTS.ColorScheme.LIGHT }) => {
  const engine = React.useContext(EngineContext)!;
  const targets = engine.activation.getTargets();
  const color = useSelector(CreatorV2.blockColorSelector, { id: targets[0] }) || COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR;

  const popperRef = React.useRef<TemplateLibraryPopperRef>(null);

  const onChange = React.useCallback(
    (color: string) => {
      engine.node.updateManyBlocksColor(targets, color);
    },
    [targets]
  );

  const updatePosition = () => popperRef.current?.update?.();

  useCanvasPan(updatePosition);
  useCanvasZoom(updatePosition);

  return (
    <TemplateLibraryPopper
      ref={popperRef}
      onColorChange={onChange}
      modifiers={[{ name: 'offset', options: { offset: [26, 0] } }]}
      placement="right"
      selectedColor={color}
      defaultColorScheme={defaultColorScheme}
      nodeIDs={targets}
    />
  );
};
