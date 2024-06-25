import type * as Realtime from '@voiceflow/realtime-sdk';
import { Editor, Scroll, SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { Creator, Designer, Diagram } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';

import { CollapsibleDescription } from '../../components/CollapsibleDescription.component';
import { TriggersSection } from '../../components/Triggers/TriggersSection/TriggersSection.component';
import { CommandsSection } from './CommandsSection/CommandsSection.component';

export const StartEditorRoot: React.FC = () => {
  const editor = useEditor<Realtime.NodeData.Start>();

  const isTopic = useSelector(Diagram.active.isTopicSelector);
  const activeDiagramID = useSelector(Creator.activeDiagramIDSelector);
  const flow = useSelector(Designer.Flow.selectors.oneByDiagramID, { diagramID: activeDiagramID });

  const patchOneFlow = useDispatch(Designer.Flow.effect.patchOne);

  return (
    <Editor
      title={isTopic ? editor.data.label || 'Start' : flow?.name || 'Enter'}
      onTitleChange={(label) => (isTopic ? editor.onChange({ label }) : flow && patchOneFlow(flow.id, { name: label }))}
      headerActions={<SquareButton size="medium" iconName="More" disabled />}
    >
      <Scroll>
        {isTopic ? (
          <>
            <TriggersSection />
            <CommandsSection />
          </>
        ) : (
          <CollapsibleDescription
            value={flow?.description ?? ''}
            onValueChange={(value) => flow && patchOneFlow(flow.id, { description: value })}
          />
        )}
      </Scroll>
    </Editor>
  );
};
