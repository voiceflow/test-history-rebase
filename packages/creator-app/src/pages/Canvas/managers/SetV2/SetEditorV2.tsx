import * as Realtime from '@voiceflow/realtime-sdk';
import { BoxFlex, Input, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import Section from '@/components/Section';
import { useMapManager, useToggle } from '@/hooks';
import { Content, Controls } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { DraggableItemV2, HelpMessage, HelpTooltip } from './components';
import { MAX_SETS } from './constants';
import { setClone, setFactory } from './utils';

const SetEditorV2: NodeEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({ data, onChange }) => {
  const [isDragging, toggleDragging] = useToggle(false);
  const [stepName, setStepName] = useLinkedState(data.title);

  const mapManager = useMapManager(data.sets, (sets) => onChange({ sets }), {
    clone: setClone,
    factory: setFactory,
    maxItems: MAX_SETS,
  });

  return (
    <Content
      footer={({ scrollToBottom }) =>
        !mapManager.isMaxReached ? (
          <Controls
            options={[{ label: 'Add Set', onClick: () => mapManager.onAdd().then(() => scrollToBottom()) }]}
            tutorial={{ blockType: data.type, content: <HelpTooltip />, helpTitle: 'Still having trouble?', helpMessage: <HelpMessage /> }}
          />
        ) : (
          <div>Maximum options reached</div>
        )
      }
      hideFooter={isDragging}
    >
      <>
        <BoxFlex fullWidth zIndex={2} position="fixed" top={0} borderBottom="1px solid #eaeff4">
          <Section fullWidth>
            <Input value={stepName} onBlur={() => onChange({ title: stepName })} onChangeText={setStepName} placeholder="Set Label" />
          </Section>
        </BoxFlex>
        <BoxFlex style={{ marginTop: '84px' }}>
          <DraggableList
            type="set-editor"
            onEndDrag={toggleDragging}
            itemProps={{ latestCreatedKey: mapManager.latestCreatedKey, isOnlyItem: mapManager.isOnlyItem }}
            mapManager={mapManager}
            onStartDrag={toggleDragging}
            itemComponent={DraggableItemV2}
            deleteComponent={DeleteComponent}
            partialDragItem
            previewComponent={DraggableItemV2}
            withContextMenuDelete
            withContextMenuDuplicate
          />
        </BoxFlex>
      </>
    </Content>
  );
};

export default SetEditorV2;
