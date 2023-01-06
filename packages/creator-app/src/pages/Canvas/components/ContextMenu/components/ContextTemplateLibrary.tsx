import { NestedMenu } from '@voiceflow/ui';
import React from 'react';

import CanvasTemplateEditorNewTemplate from '@/pages/Canvas/components/TemplateEditor/NewTemplate';
import { EngineContext } from '@/pages/Canvas/contexts';

import * as S from './styles';

export const ContextTemplateLibrary: React.OldFC = () => {
  const engine = React.useContext(EngineContext)!;
  const targets = engine.activation.getTargets();

  return (
    <NestedMenu.OptionContainer>
      <S.Container>
        <CanvasTemplateEditorNewTemplate withoutPopper nodeIDs={targets} isOpen />
      </S.Container>
    </NestedMenu.OptionContainer>
  );
};
