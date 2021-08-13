import { TextData } from '@voiceflow/general-types/build/nodes/text';
import { Box, Input, stopPropagation, SvgIcon, toast, useContextApi } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import SlateEditable, {
  HyperlinkButton,
  SlatePluginsOptions,
  SlatePluginType,
  TextBoldButton,
  TextItalicButton,
  TextStrikeThroughButton,
  TextUnderlineButton,
  useSetupSlateEditor,
  useSlateEditorForceNormalize,
} from '@/components/SlateEditable';
import * as Diagram from '@/ducks/diagram';
import * as Version from '@/ducks/version';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';
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

  const editor = useSetupSlateEditor(SlatePluginType.LINKS, SlatePluginType.VARIABLES);
  const variables = useSelector(Diagram.activeDiagramAllVariablesNormalizedSelector);
  const addGlobalVariable = useDispatch(Version.addGlobalVariable);

  const [content, setContent] = useLinkedState(item.content);

  const onBlur = () => onUpdate({ content: editor.children });

  const onCreateVariable = React.useCallback((name: string) => {
    try {
      addGlobalVariable(name);

      return { id: name, name };
    } catch (err) {
      toast.error(err.message);

      return null;
    }
  }, []);

  const pluginsOptions = useContextApi<SlatePluginsOptions>({
    [SlatePluginType.VARIABLES]: useContextApi<SlatePluginsOptions[SlatePluginType.VARIABLES]>({
      variables,
      creatable: true,
      onCreate: onCreateVariable,
    }),
  });

  useSlateEditorForceNormalize(editor, [variables]);

  return (
    <EditorSection
      ref={ref}
      namespace={['textListItem', item.id]}
      header={header || `Text Variant ${index + 1}`}
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
                pluginsOptions={pluginsOptions}
              >
                {/* <Suggestions value={content} suggestionRegExp="[\\w]*" suggestionTrigger="{" suggestionPrefix="{" suggestionSuffix="}" /> */}

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
