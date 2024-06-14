import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Editor, Scroll, SortableList, SquareButton, Text } from '@voiceflow/ui-next';
import { Tokens } from '@voiceflow/ui-next/styles';
import React from 'react';

import { useEditor } from '@/pages/Canvas/components/EditorV3/EditorV3.hook';
import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { SetV2EditorItem } from './SetV2EditorItem.component';

const MAX_SETS = 20;

export const SetV2EditorRoot: NodeEditorV2<Realtime.NodeData.SetV2> = () => {
  const editor = useEditor<Realtime.NodeData.SetV2>();

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
    <Editor title="Set variables" readOnly headerActions={<EditorV3HeaderActions />}>
      <Scroll>
        <Box direction="column" width="100%" maxHeight="calc(100vh - 60px - 56px * 2)" pb={11}>
          <Box align="center" justify="space-between" width="100%" pr={16} pl={24} height="58px" gap={16}>
            <Text
              weight="semiBold"
              color={
                sets.length === 0
                  ? Tokens.colors.neutralDark.neutralsDark200
                  : Tokens.colors.neutralDark.neutralsDark900
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
                <SetV2EditorItem
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
      </Scroll>
    </Editor>
  );
};
