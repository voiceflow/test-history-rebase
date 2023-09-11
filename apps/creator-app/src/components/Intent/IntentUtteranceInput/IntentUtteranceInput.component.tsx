import { FocusIndicator, forwardRef, SlateEditor, useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/cjs/components/Inputs/SlateEditor';
import React, { useMemo, useRef } from 'react';
import type { Descendant } from 'slate';

import { Designer } from '@/ducks';
import { useInput } from '@/hooks/input.hook';
import { useSelector } from '@/hooks/store.hook';
import { useEntityCreateModalV2, useEntityEditModalV2 } from '@/ModalsV2/hooks';
import { utteranceTextToSlate } from '@/utils/utterance.util';

import type { IIntentUtteranceInput } from './IntentUtteranceInput.interface';

export const IntentUtteranceInput = forwardRef<SlateEditorRef, IIntentUtteranceInput>(
  'IntentUtteranceInput',
  ({ value: propValue, autoFocus, placeholder = 'Enter sample phrase or {entity}', onValueChange, onValueEmpty }, ref) => {
    const editor = useCreateConst(() => SlateEditor.createEditor([SlateEditor.PluginType.VARIABLE]));
    const emptyRef = useRef(false);
    const entitiesMap = useSelector(Designer.selectors.slateEntitiesMapByID);

    const editEntityModal = useEntityEditModalV2();
    const createEntityModal = useEntityCreateModalV2();

    const input = useInput({
      ref,
      value: propValue,
      onSave: (value: Descendant[]) => onValueChange(utteranceTextToSlate.toDB(value)),
      onEmpty: onValueEmpty,
      isEmpty: SlateEditor.StaticEditor.isEmptyState,
      autoFocus,
      transform: (propValue) => utteranceTextToSlate.fromDB(propValue),
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

    return (
      <SlateEditor.Component
        {...input.attributes}
        editor={editor}
        placeholder={placeholder}
        onValueChange={onChange}
        pluginsOptions={pluginsOptions}
        editableContainer={({ editable }) => (
          <FocusIndicator.Container pl={24} mt={7} overflow="hidden">
            {editable}
          </FocusIndicator.Container>
        )}
      />
    );
  }
);
