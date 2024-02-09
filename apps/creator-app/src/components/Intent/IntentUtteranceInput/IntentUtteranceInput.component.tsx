import { Box, FocusIndicator, forwardRef, SlateEditor, Text, useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/cjs/components/Inputs/SlateEditor';
import React, { useMemo, useRef } from 'react';
import type { Descendant } from 'slate';

import { Designer } from '@/ducks';
import { useInput } from '@/hooks/input.hook';
import { useEntityCreateModal, useEntityEditModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';
import { withEnterPress } from '@/utils/handler.util';
import { utteranceTextToSlate } from '@/utils/utterance.util';

import { errorStyle } from './IntentUtteranceInput.css';
import type { IIntentUtteranceInput } from './IntentUtteranceInput.interface';

export const IntentUtteranceInput = forwardRef<SlateEditorRef, IIntentUtteranceInput>('IntentUtteranceInput')(
  (
    {
      value: propValue,
      error,
      autoFocus,
      placeholder = 'Enter sample phrase or {entity}',
      onValueEmpty,
      onEnterPress: onEnterPressProp,
      onValueChange,
      onEntityAdded,
      testID,
    },
    ref
  ) => {
    const editor = useCreateConst(() => SlateEditor.createEditor([SlateEditor.PluginType.VARIABLE, SlateEditor.PluginType.SINGLE_LINE]));
    const emptyRef = useRef(false);
    const entitiesMap = useSelector(Designer.selectors.slateEntitiesMapByID);

    const entityEditModal = useEntityEditModal();
    const entityCreateModal = useEntityCreateModal();

    const input = useInput({
      ref,
      error,
      value: useMemo(() => utteranceTextToSlate.fromDB(propValue), [propValue]),
      onSave: (value: Descendant[]) => onValueChange(utteranceTextToSlate.toDB(value)),
      onEmpty: onValueEmpty,
      isEmpty: SlateEditor.StaticEditor.isEmptyState,
      autoFocus,
      flushSyncOnFocus: true,
    });

    const onChange = usePersistFunction((value: Descendant[]) => {
      input.setValue(value);

      if (!onValueEmpty) return;

      const isEmpty = SlateEditor.StaticEditor.isEmptyState(value);

      if (emptyRef.current !== isEmpty) {
        emptyRef.current = isEmpty;
        onValueEmpty(isEmpty);
      }
    });

    const onClickEntity = usePersistFunction((entity: SlateEditor.VariableItem) => {
      requestAnimationFrame(() => entityEditModal.openVoid({ entityID: entity.id }));
    });

    const onCreateEntity = usePersistFunction(async (name: string) => {
      const entity = await entityCreateModal.open({ name, folderID: null });

      return {
        id: entity.id,
        name: entity.name,
        kind: SlateEditor.VariableElementVariant.ENTITY,
        color: entity.color,
        variant: SlateEditor.VariableElementVariant.ENTITY,
      };
    });

    const onAddedEntity = usePersistFunction((entity: SlateEditor.VariableItem) => onEntityAdded?.(entity.id));

    const onKeyDownCapture = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.isPropagationStopped()) return;

      if (onEnterPressProp) {
        withEnterPress(onEnterPressProp)(event, utteranceTextToSlate.toDB(input.value));
      }
    };

    const pluginsOptions = useMemo<SlateEditor.ISlateEditor['pluginsOptions']>(
      () => ({
        [SlateEditor.PluginType.VARIABLE]: {
          onClick: onClickEntity,
          onAdded: onAddedEntity,
          onCreate: onCreateEntity,
          canCreate: true,
          variablesMap: entitiesMap,
          createButtonLabel: 'Create entity',
        },
      }),
      [entitiesMap]
    );

    return (
      <SlateEditor.Component
        {...input.attributes}
        editor={editor}
        placeholder={placeholder}
        onValueChange={onChange}
        pluginsOptions={pluginsOptions}
        onKeyDownCapture={onKeyDownCapture}
        testID={testID}
        editableContainer={({ editable }) => (
          <FocusIndicator.Container pl={24} overflow="hidden">
            <Box width="100%" direction="column" align="center">
              {editable}
            </Box>

            {input.errored && (
              <Text className={errorStyle} variant="fieldCaption">
                {input.errorMessage}
              </Text>
            )}
          </FocusIndicator.Container>
        )}
      />
    );
  }
);
