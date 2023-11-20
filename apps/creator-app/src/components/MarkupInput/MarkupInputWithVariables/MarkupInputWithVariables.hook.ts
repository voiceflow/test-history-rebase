// import { useVariableCreateModal, useVariableEditModal } from '@/ModalsV2';
import type { Markup } from '@voiceflow/dtos';
import { SlateEditor, useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/cjs/components/Inputs/SlateEditor';
import { markupToSlate } from '@voiceflow/utils-designer';
import { useMemo, useRef } from 'react';
import type { Descendant } from 'slate';

import { Designer } from '@/ducks';
import { useInput } from '@/hooks/input.hook';
import { useSelector } from '@/hooks/store.hook';

export default function useMarkupWithVariables({
  ref,
  value: propValue,
  onBlur,
  plugins = [],
  onFocus,
  autoFocus,
  placeholder,
  onValueEmpty,
  pluginOptions,
  onValueChange,
  autoFocusIfEmpty,
}: {
  ref?: React.RefObject<SlateEditorRef> | React.ForwardedRef<SlateEditorRef>;
  value: Markup;
  onBlur?: VoidFunction;
  onFocus?: VoidFunction;
  plugins?: SlateEditor.PluginType[];
  autoFocus?: boolean;
  placeholder?: string | { default: string; focused: string };
  onValueEmpty?: (isEmpty: boolean) => void;
  onValueChange?: (value: Markup) => void;
  pluginOptions?: SlateEditor.PluginsOptions;
  autoFocusIfEmpty?: boolean;
}) {
  const editor = useCreateConst(() => SlateEditor.createEditor([SlateEditor.PluginType.VARIABLE, ...plugins]));
  const emptyRef = useRef(false);
  const variablesMap = useSelector(
    (state) => pluginOptions?.[SlateEditor.PluginType.VARIABLE]?.variablesMap ?? Designer.selectors.uniqueSlateEntitiesAndVariablesMapByID(state)
  );

  // const editVariableModal = useVariableEditModal();
  // const createVariableModal = useVariableCreateModal();

  const input = useInput({
    ref,
    value: propValue,
    onSave: (value: Descendant[]) => onValueChange?.(markupToSlate.toDB(value)),
    onBlur,
    onFocus,
    onEmpty: onValueEmpty,
    isEmpty: SlateEditor.StaticEditor.isEmptyState,
    autoFocus,
    transform: (propValue) => markupToSlate.fromDB(propValue),
    autoFocusIfEmpty,
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

  // const onClickVariable = usePersistFunction((entity: SlateEditor.VariableItem) => {
  //   requestAnimationFrame(() => editVariableModal.openVoid({ variableID: entity.id }));
  // });

  // const onCreateEntity = usePersistFunction(async (name: string) => {
  //   const entity = await createVariableModal.open({ name, folderID: null });

  //   return {
  //     id: entity.id,
  //     name: entity.name,
  //     kind: SlateEditor.VariableElementVariant.VARIABLE,
  //     color: entity.color,
  //     variant: SlateEditor.VariableElementVariant.VARIABLE,
  //   };
  // });

  const pluginsOptions = useMemo<SlateEditor.ISlateEditor['pluginsOptions']>(
    () => ({
      ...pluginOptions,
      [SlateEditor.PluginType.VARIABLE]: {
        // onClick: onClickVariable,
        // onCreate: onCreateEntity,
        // canCreate: true,
        // createButtonLabel: 'Create variable',

        ...pluginOptions,

        variablesMap,
      },
    }),
    [variablesMap, pluginOptions]
  );

  const getPlaceholder = () => {
    if (typeof placeholder !== 'object') {
      return placeholder;
    }

    return input.focused ? placeholder.focused : placeholder.default;
  };

  return {
    ...input.attributes,
    editor,
    placeholder: getPlaceholder(),
    onValueChange: onChange,
    pluginsOptions,
  };
}
