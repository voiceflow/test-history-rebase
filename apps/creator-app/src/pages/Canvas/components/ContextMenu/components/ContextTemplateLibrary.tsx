import { NestedMenu } from '@voiceflow/ui';
import React from 'react';

import CanvasTemplateEditorNewTemplate from '@/pages/Canvas/components/TemplateEditor/NewTemplate';
import { EngineContext } from '@/pages/Canvas/contexts';
import { EntityType } from '@/pages/Canvas/engine/constants';

export const ContextTemplateLibrary: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const targets = engine.activation.getTargets(EntityType.NODE);

  return (
    <NestedMenu.OptionContainer>
      <CanvasTemplateEditorNewTemplate withoutPopper nodeIDs={targets} isOpen />
    </NestedMenu.OptionContainer>
  );
};
