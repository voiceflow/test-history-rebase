import { Box, Button, Dropdown, FocusIndicator, SlateEditor, SquareButton, useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';
import type { Descendant } from 'slate';

import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { Designer } from '@/ducks';
import { useInput } from '@/hooks/input.hook';
import { useEntityCreateModalV2, useEntityEditModalV2 } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';
import { markupToSlate } from '@/utils/markup.util';

import { slateEditorStyle } from './IntentRepromptInput.css';
import type { IIntentRepromptInput } from './IntentRepromptInput.interface';

export const IntentRepromptInput: React.FC<IIntentRepromptInput> = ({ value, onValueChange, onDelete }) => {
  const editor = useCreateConst(() => SlateEditor.createEditor([SlateEditor.PluginType.VARIABLE, SlateEditor.PluginType.LINK]));
  const entitiesMap = useSelector(Designer.selectors.slateEntitiesMapByID);

  const editEntityModal = useEntityEditModalV2();
  const createEntityModal = useEntityCreateModalV2();

  const onClickEntity = usePersistFunction((entity: SlateEditor.VariableItem) => {
    requestAnimationFrame(() => editEntityModal.openVoid({ entityID: entity.id }));
  });

  const onCreateEntity = usePersistFunction(async (name: string) => {
    const entity = await createEntityModal.open({ name, folderID: null });

    return {
      id: entity.id,
      name: entity.name,
      kind: SlateEditor.VariableElementVariant.ENTITY,
      color: entity.color,
      variant: SlateEditor.VariableElementVariant.ENTITY,
    };
  });

  const pluginsOptions = useMemo<SlateEditor.ISlateEditor['pluginsOptions']>(
    () => ({
      [SlateEditor.PluginType.VARIABLE]: {
        onClick: onClickEntity,
        onCreate: onCreateEntity,
        canCreate: true,
        variablesMap: entitiesMap,
        createButtonLabel: 'Create entity',
      },
    }),
    [entitiesMap]
  );

  const input = useInput({
    value: useMemo(() => markupToSlate.fromDB(value), [value]),
    onSave: (value: Descendant[]) => onValueChange(markupToSlate.toDB(value)),
  });

  return (
    <Box direction="column">
      <Box direction="row" width="100%" justify="space-between" pl={14} pr={16}>
        <Box align="center">
          <Dropdown isSmall bordered={false} value="Text">
            {() => <></>}
          </Dropdown>
          <SquareButton iconName="TextFormattingS" size="medium" />
          <SquareButton iconName="Link" size="medium" />
        </Box>

        <Box align="center">
          <SquareButton iconName="Attachement" size="medium" />
          <CMSFormListButtonRemove onClick={onDelete} />
        </Box>
      </Box>

      <Box width="100%" overflow="hidden" direction="column" pt={2}>
        <SlateEditor.Component
          value={input.value}
          editor={editor}
          autoFocus
          placeholder="Enter reprompt"
          onValueChange={input.setValue}
          pluginsOptions={pluginsOptions}
          className={slateEditorStyle}
          editableContainer={({ editable }) => (
            <FocusIndicator.Container pl={24} overflow="hidden">
              {editable}
            </FocusIndicator.Container>
          )}
        />
      </Box>

      <Box pt={10} pl={24}>
        <Button iconName="More" variant="tertiary" size="small" />
      </Box>
    </Box>
  );
};
