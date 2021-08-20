import { Node } from '@voiceflow/base-types';
import cuid from 'cuid';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { ControlOptions, EditorControlsProps } from '@/pages/Canvas/components/Editor';
import ListEditorContent, { ListItemComponent } from '@/pages/Canvas/components/ListEditorContent';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Text/constants';
import { chainVoid } from '@/utils/functional';

const factory = (): Node.Text.TextData => ({
  id: cuid.slug(),
  content: SlateEditorAPI.getEmptyState(),
});

export type ItemComponent = ListItemComponent<Node.Text.TextData>;

export interface TextListProps {
  items: Node.Text.TextData[];
  maxItems?: number;
  tutorial?: EditorControlsProps['tutorial'];
  renderMenu: () => React.ReactNode;
  itemComponent: ItemComponent;
  onChangeItems: (items: Node.Text.TextData[]) => void;
  getControlOptions?: (options: { isMaxMatches: boolean; onAdd: () => void }) => ControlOptions[];
}

const TextList = ({
  items,
  tutorial,
  children,
  maxItems,
  renderMenu,
  onChangeItems,
  itemComponent,
  getControlOptions,
}: React.PropsWithChildren<TextListProps>): React.ReactElement<any, any> => (
  <ListEditorContent
    type="speak-editor"
    items={items}
    footer={children}
    factory={factory}
    tutorial={tutorial}
    maxItems={maxItems}
    renderMenu={renderMenu}
    onChangeItems={onChangeItems}
    itemComponent={itemComponent}
    getControlOptions={({ onAdd, isMaxMatches, scrollToBottom }) =>
      getControlOptions
        ? getControlOptions({ isMaxMatches, onAdd: chainVoid(onAdd, scrollToBottom) })
        : [
            {
              label: 'Add variant',
              icon: NODE_CONFIG.icon,
              onClick: chainVoid(onAdd, scrollToBottom),
              disabled: isMaxMatches,
              iconProps: { color: NODE_CONFIG.iconColor },
            },
          ]
    }
  />
);

export default TextList;
