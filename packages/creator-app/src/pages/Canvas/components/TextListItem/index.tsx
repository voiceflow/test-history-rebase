import { TextData } from '@voiceflow/general-types/build/nodes/text';
import { Box, Input, stopPropagation, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import SlateEditable, {
  HyperlinkButton,
  TextBoldButton,
  TextItalicButton,
  TextStrikeThroughButton,
  TextUnderlineButton,
  useSetupSlateEditor,
} from '@/components/SlateEditable';
import { useLinkedState } from '@/hooks';
import { FormControl } from '@/pages/Canvas/components/Editor';
import EditorSection from '@/pages/Canvas/components/EditorSection';
import { ListItemComponentProps } from '@/pages/Canvas/components/ListEditorContent';
import { NODE_CONFIG } from '@/pages/Canvas/managers/Text/constants';
import { compose } from '@/utils/functional';

import { Toolbar } from './components';

export type TextListItemProps = ListItemComponentProps<TextData, { header?: React.ReactNode }>;

const TextListItem: React.ForwardRefRenderFunction<HTMLDivElement, TextListItemProps> = (
  {
    item,
    index,
    header,
    itemKey,
    onUpdate,
    isOnlyItem,
    isDragging,
    onContextMenu,
    latestCreatedKey,
    connectedDragRef,
    isDraggingPreview,
    isContextMenuOpen,
  },
  ref
) => {
  const isNew = latestCreatedKey === itemKey;
  const editor = useSetupSlateEditor();

  const [content, setContent] = useLinkedState(item.content);

  const onBlur = () => onUpdate({ content: editor.children });

  return (
    <EditorSection
      ref={ref}
      namespace={['textListItem', item.id]}
      header={header || `Variant ${index + 1}`}
      prefix={<SvgIcon icon={NODE_CONFIG.icon!} color={NODE_CONFIG.iconColor} />}
      headerRef={connectedDragRef}
      isDragging={isDragging}
      initialOpen={isNew || isOnlyItem}
      headerToggle
      onContextMenu={onContextMenu}
      collapseVariant={!isDragging && !isDraggingPreview ? SectionToggleVariant.ARROW : null}
      isDraggingPreview={isDraggingPreview}
      isContextMenuOpen={isContextMenuOpen}
    >
      {isDragging || isDraggingPreview ? null : (
        <FormControl contentBottomUnits={2.5}>
          <Input>
            {({ ref }) => (
              <SlateEditable
                ref={ref}
                value={content}
                editor={editor}
                onBlur={onBlur}
                onChange={setContent}
                placeholder="Enter text reply, {} to add variables"
              >
                <Toolbar onClick={stopPropagation()}>
                  <TextBoldButton />
                  <TextItalicButton />
                  <TextUnderlineButton />
                  <TextStrikeThroughButton />

                  <Box width="1px" height="15px" backgroundColor="#dfe3ed" />

                  <HyperlinkButton />
                </Toolbar>
              </SlateEditable>
            )}
          </Input>
        </FormControl>
      )}
    </EditorSection>
  );
};

export default compose(React.memo, React.forwardRef)(TextListItem);
