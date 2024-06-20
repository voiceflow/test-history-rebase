import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Divider, Scroll, SortableList, SquareButton, Text } from '@voiceflow/ui-next';
import { Tokens } from '@voiceflow/ui-next/styles';
import React from 'react';

import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { SetV3EditorItem } from './SetV3EditorItem.component';

const MAX_SETS = 20;

interface ISetV3EditorForm {
  editor: NodeEditorV2Props<Realtime.NodeData.SetV2, Realtime.BuiltInPortRecord<string>>;
}

export const SetV3EditorForm: React.FC<ISetV3EditorForm> = ({ editor }) => {
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

  const onSubEditorClose = () => {
    setJustAddedSetID(null);
  };

  return (
    <Scroll>
      <Box direction="column" width="100%" maxHeight="calc(100vh - 60px - 56px * 2)" pb={sets.length === 0 ? 0 : 11}>
        <Box align="center" justify="space-between" width="100%" pr={16} pl={24} height="58px" gap={16}>
          <Text
            weight="semiBold"
            color={
              sets.length === 0 ? Tokens.colors.neutralDark.neutralsDark200 : Tokens.colors.neutralDark.neutralsDark900
            }
          >
            Variables to set
          </Text>
          <SquareButton size="medium" iconName="Plus" onClick={() => onSetAdd()} />
        </Box>
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
