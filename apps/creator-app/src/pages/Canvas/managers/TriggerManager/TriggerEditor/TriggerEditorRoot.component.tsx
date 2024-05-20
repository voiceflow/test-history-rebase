import * as Realtime from '@voiceflow/realtime-sdk';
import { Editor, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { TriggersSection } from '../../components/Triggers/TriggersSection/TriggersSection.component';

export const TriggerEditorRoot: NodeEditorV2<Realtime.NodeData.Trigger> = () => {
  return (
    <Editor title="Triggers" readOnly headerActions={<EditorV3HeaderActions />}>
      <Scroll>
        <TriggersSection />
      </Scroll>
    </Editor>
  );
};
