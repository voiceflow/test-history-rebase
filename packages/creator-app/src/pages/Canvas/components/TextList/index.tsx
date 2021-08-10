import { TextData } from '@voiceflow/general-types/build/nodes/text';
import cuid from 'cuid';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { ControlOptions } from '@/pages/Canvas/components/Editor';
import ListEditorContent, { ListItemComponent } from '@/pages/Canvas/components/ListEditorContent';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Text/constants';
import { chainVoid } from '@/utils/functional';

const factory = (): TextData => ({
  id: cuid.slug(),
  content: SlateEditorAPI.getEmptyState(),
});

export type ItemComponent = ListItemComponent<TextData>;

export interface TextListProps {
  items: TextData[];
  maxItems?: number;
  renderMenu: () => React.ReactNode;
  itemComponent: ItemComponent;
  onChangeItems: (items: TextData[]) => void;
  getControlOptions?: (options: { isMaxMatches: boolean; onAdd: () => void }) => ControlOptions[];
}

const TextList = ({
  items,
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
