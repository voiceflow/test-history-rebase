import { BaseNode } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { ControlOptions } from '@/pages/Canvas/components/Editor';
import ListEditorContent, { ListItemComponent } from '@/pages/Canvas/components/ListEditorContent';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Text/constants';

const factory = (): BaseNode.Text.TextData => ({
  id: Utils.id.cuid.slug(),
  content: SlateEditorAPI.getEmptyState(),
});

export type ItemComponent = ListItemComponent<BaseNode.Text.TextData>;

export interface TextListProps {
  items: BaseNode.Text.TextData[];
  maxItems?: number;
  renderMenu?: Nullable<() => React.ReactNode>;
  itemComponent: ItemComponent;
  onChangeItems: (items: BaseNode.Text.TextData[]) => void;
  howItWorksLink?: string;
  label?: string;
  randomize?: boolean;
  getControlOptions?: (options: { isMaxReached: boolean; onAdd: () => void }) => ControlOptions[];
}

const TextList = ({
  items,
  children,
  maxItems,
  renderMenu,
  randomize,
  onChangeItems,
  itemComponent,
  howItWorksLink,
  label = 'Add Variant',
  getControlOptions,
}: React.PropsWithChildren<TextListProps>): React.ReactElement<any, any> => (
  <ListEditorContent
    type="text-editor"
    items={items}
    footer={children}
    factory={factory}
    maxItems={maxItems}
    renderMenu={renderMenu}
    onChangeItems={onChangeItems}
    itemComponent={itemComponent}
    howItWorksLink={howItWorksLink}
    extraItemProps={{ isRandomized: randomize }}
    getControlOptions={(mapManager, { scrollToBottom }) =>
      getControlOptions
        ? getControlOptions({
            onAdd: Utils.functional.chainVoidAsync(mapManager.onAdd, scrollToBottom),
            isMaxReached: mapManager.isMaxReached,
          })
        : [
            {
              label,
              icon: NODE_CONFIG.icon,
              onClick: Utils.functional.chainVoidAsync(mapManager.onAdd, scrollToBottom),
              disabled: mapManager.isMaxReached,
            },
          ]
    }
  />
);

export default TextList;
