import { Node } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { ControlOptions } from '@/pages/Canvas/components/Editor';
import ListEditorContent, { ListItemComponent } from '@/pages/Canvas/components/ListEditorContent';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Text/constants';

const factory = (): Node.Text.TextData => ({
  id: Utils.id.cuid.slug(),
  content: SlateEditorAPI.getEmptyState(),
});

export type ItemComponent = ListItemComponent<Node.Text.TextData>;

export interface TextListProps {
  items: Node.Text.TextData[];
  maxItems?: number;
  renderMenu?: Nullable<() => React.ReactNode>;
  itemComponent: ItemComponent;
  onChangeItems: (items: Node.Text.TextData[]) => void;
  howItWorksLink?: string;
  label?: string;
  randomize?: boolean;
  getControlOptions?: (options: { isMaxMatches: boolean; onAdd: () => void }) => ControlOptions[];
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
    extraItemProps={{
      isRandomized: randomize,
    }}
    onChangeItems={onChangeItems}
    itemComponent={itemComponent}
    howItWorksLink={howItWorksLink}
    getControlOptions={({ onAdd, isMaxMatches, scrollToBottom }) =>
      getControlOptions
        ? getControlOptions({ isMaxMatches, onAdd: Utils.functional.chainVoid(onAdd, () => requestAnimationFrame(() => scrollToBottom())) })
        : [
            {
              label,
              icon: NODE_CONFIG.icon,
              onClick: Utils.functional.chainVoid(onAdd, () => requestAnimationFrame(() => scrollToBottom())),
              disabled: isMaxMatches,
            },
          ]
    }
  />
);

export default TextList;
