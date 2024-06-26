import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Divider, Scroll, Section, SortableList } from '@voiceflow/ui-next';
import React from 'react';

import type { NodeEditorV2Props } from '@/pages/Canvas/managers/types';
import { stopPropagation } from '@/utils/handler.util';

import { SetV3EditorItem } from './SetV3EditorItem/SetV3EditorItem.component';

interface ISetV3EditorForm {
  editor: NodeEditorV2Props<Realtime.NodeData.SetV2, Realtime.BuiltInPortRecord<string>>;
}

export const SetV3EditorForm: React.FC<ISetV3EditorForm> = ({ editor }) => {
  const MAX_SETS = 20;

  const sets = editor.data.sets ?? [];
  const [justAddedSetID, setJustAddedSetID] = React.useState<string | null>(null);

  const onSetsChange = (sets: Realtime.NodeData.SetExpressionV2[]) => {
    editor.onChange({ sets });
  };

  const onSetAdd = (item?: Partial<Realtime.NodeData.SetExpressionV2>) => {
    const set: Realtime.NodeData.SetExpressionV2 = {
      id: Utils.id.cuid(),
      type: BaseNode.Utils.ExpressionTypeV2.ADVANCE,
      variable: item?.variable ?? null,
      expression: item?.expression ?? '',
      label: item?.label ? `${item.label} copy` : null,
    };

    setJustAddedSetID(set.id);

    onSetsChange([...sets, set]);
  };

  const onSetDuplicate = (setID: string) => {
    const set = sets.find((s) => s.id === setID);

    if (set) {
      onSetAdd(set);
    }
  };

  const onSetRemove = (setID: string) => {
    onSetsChange(sets.filter((s) => s.id !== setID));
  };

  const onSetUpdate = (setID: string, set: Partial<Realtime.NodeData.SetExpressionV2>) => {
    const newSets = sets.map((s) => (s.id === setID ? { ...s, ...set } : s));

    onSetsChange(newSets);
  };

  const onSetsReorder = (newSets: Realtime.NodeData.SetExpressionV2[]) => {
    onSetsChange(newSets);
  };

  const isMaxSets = React.useMemo(() => sets.length >= MAX_SETS, [sets]);

  const onSubEditorClose = (setID: string) => {
    if (setID === justAddedSetID) {
      setJustAddedSetID(null);
    }
  };

  return (
    <Scroll>
      <Section.Header.Container
        pt={11}
        pb={sets.length === 0 ? 11 : 0}
        title={'Variables to set'}
        variant={sets.length === 0 ? 'basic' : 'active'}
        onHeaderClick={sets.length === 0 ? () => onSetAdd() : undefined}
      >
        <Section.Header.Button onClick={stopPropagation(() => onSetAdd())} iconName="Plus" />
      </Section.Header.Container>
      <Box pb={sets.length === 0 ? 0 : 11} direction="column">
        <SortableList
          items={sets}
          getItemKey={(item) => item.id}
          onItemsReorder={onSetsReorder}
          renderItem={({ ref, item, dragContainerProps, styles }) => (
            <div {...dragContainerProps} ref={ref} style={{ transition: styles.transition }}>
              <SetV3EditorItem
                item={item}
                onChange={onSetUpdate}
                onDuplicate={isMaxSets ? undefined : onSetDuplicate}
                onRemove={onSetRemove}
                onSetAnother={() => onSetAdd()}
                isJustAdded={justAddedSetID === item.id}
                onSubEditorClose={onSubEditorClose}
              />
            </div>
          )}
        />
      </Box>
      <Divider noPadding />
    </Scroll>
  );
};
