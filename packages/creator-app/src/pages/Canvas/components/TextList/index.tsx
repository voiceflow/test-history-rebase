import { Node } from '@voiceflow/base-types';
import cuid from 'cuid';
import React from 'react';

import { SlateEditorAPI } from '@/components/SlateEditable';
import { ControlOptions } from '@/pages/Canvas/components/Editor';
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
  renderMenu?: () => React.ReactNode;
  itemComponent: ItemComponent;
  onChangeItems: (items: Node.Text.TextData[]) => void;
  howItWorksLink?: string;
  getControlOptions?: (options: { isMaxMatches: boolean; onAdd: () => void }) => ControlOptions[];
}

const TextList = ({
  items,
  children,
  maxItems,
  renderMenu,
  onChangeItems,
  itemComponent,
  howItWorksLink,
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
    getControlOptions={({ onAdd, isMaxMatches, scrollToBottom }) =>
      getControlOptions
        ? getControlOptions({ isMaxMatches, onAdd: chainVoid(onAdd, () => requestAnimationFrame(() => scrollToBottom())) })
        : [
            {
              label: 'Add Variant',
              icon: NODE_CONFIG.icon,
              onClick: chainVoid(onAdd, () => requestAnimationFrame(() => scrollToBottom())),
              disabled: isMaxMatches,
              iconProps: { color: NODE_CONFIG.iconColor },
            },
          ]
    }
  />
);

export default TextList;
