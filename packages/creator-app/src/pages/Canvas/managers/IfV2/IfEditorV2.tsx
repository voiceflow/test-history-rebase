import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import DraggableList, { DeleteComponent } from '@/components/DraggableList';
import * as Documentation from '@/config/documentation';
import { useMapManager, useToggle } from '@/hooks';
import { Content, Controls, MaxOptionsMessage } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

import { ConditionsSection, HelpTooltip, NoMatchSection } from './components';
import { MAX_IF_ITEMS, NODE_CONFIG } from './constants';

const IfEditor: NodeEditor<Realtime.NodeData.IfV2, Realtime.NodeData.IfV2BuiltInPorts> = ({ data, node, engine, pushToPath, onChange }) => {
  const [isDragging, toggleDragging] = useToggle(false);

  const mapManager = useMapManager(data.expressions, (expressions) => onChange({ expressions }), {
    clone: ({ id }, targetVal) => ({ ...targetVal, id }),
    onAdd: (_, index) => engine.port.addDynamic(node.id, index),
    factory: () => NODE_CONFIG.factory(undefined).data.expressions[0],
    onRemove: (_, index) => engine.port.removeDynamic(node.ports.out.dynamic[index]),
    onReorder: (from, to) => engine.port.reorderDynamic(node.id, from, to),
  });

  return (
    <Content
      footer={({ scrollToBottom }) =>
        mapManager.size < MAX_IF_ITEMS ? (
          <Controls
            options={[
              {
                label: 'Add Condition',
                onClick: () => mapManager.onAdd().then(() => scrollToBottom()),
              },
            ]}
            tutorial={{
              content: <HelpTooltip />,
              blockType: data.type,
              helpTitle: 'Having trouble?',
              helpMessage: (
                <>
                  Check out this{' '}
                  <a href={Documentation.CONDITION_STEP} target="_blank" rel="noopener noreferrer">
                    doc
                  </a>{' '}
                  that goes over using IF blocks inside Voiceflow.
                </>
              ),
            }}
          />
        ) : (
          <MaxOptionsMessage>Maximum options reached</MaxOptionsMessage>
        )
      }
      hideFooter={isDragging}
    >
      <DraggableList
        type="if-editor"
        footer={<NoMatchSection noMatch={data.noMatch} pushToPath={pushToPath} />}
        onEndDrag={toggleDragging}
        itemProps={{ latestCreatedKey: mapManager.latestCreatedKey, isOnlyItem: mapManager.isOnlyItem }}
        mapManager={mapManager}
        onStartDrag={toggleDragging}
        itemComponent={ConditionsSection}
        deleteComponent={DeleteComponent}
        partialDragItem
        previewComponent={ConditionsSection}
        withContextMenuDelete
        withContextMenuDuplicate
      />
    </Content>
  );
};

export default IfEditor;
