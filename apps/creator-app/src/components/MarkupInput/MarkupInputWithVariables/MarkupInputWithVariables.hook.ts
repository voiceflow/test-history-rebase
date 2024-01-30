import type { Markup } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { SlateEditor, useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import type { SlateEditorRef } from '@voiceflow/ui-next/build/cjs/components/Inputs/SlateEditor';
import { useMemo, useRef } from 'react';
import type { Descendant } from 'slate';

import { Designer } from '@/ducks';
import { slateLegacyVariableFactory, slateVariableItemFactory } from '@/ducks/designer/selectors';
import { useFeature } from '@/hooks/feature';
import { useInput } from '@/hooks/input.hook';
import { useCreateVariableModal, useEntityEditModal, useVariableCreateModal, useVariableEditModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';
import { markupToSlate } from '@/utils/markup.util';

export const useMarkupWithVariables = ({
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
}) => {
  const editor = useCreateConst(() => SlateEditor.createEditor([SlateEditor.PluginType.VARIABLE, ...plugins]));
  const emptyRef = useRef(false);
  const cmsVariables = useFeature(Realtime.FeatureFlag.CMS_VARIABLES);
  const entityEditModal = useEntityEditModal();
  const variableEditModal = useVariableEditModal();
  const variableCreateModal = useVariableCreateModal();
  const createLegacyVariableModal = useCreateVariableModal();

  const variablesMap = useSelector(
    (state) => pluginOptions?.[SlateEditor.PluginType.VARIABLE]?.variablesMap ?? Designer.selectors.uniqueSlateEntitiesAndVariablesMapByID(state)
  );

  const input = useInput({
    ref,
    value: useMemo(() => markupToSlate.fromDB(propValue), [propValue]),
    onSave: (value: Descendant[]) => onValueChange?.(markupToSlate.toDB(value)),
    onBlur,
    onFocus,
    onEmpty: onValueEmpty,
    isEmpty: SlateEditor.StaticEditor.isEmptyState,
    autoFocus,
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

  const onClickVariable = usePersistFunction((variableItem: SlateEditor.VariableItem) => {
    requestAnimationFrame(() => {
      if (variableItem.variant === SlateEditor.VariableElementVariant.VARIABLE) {
        variableEditModal.open({ variableID: variableItem.id });
      } else {
        entityEditModal.open({ entityID: variableItem.id });
      }
    });
  });

  const onCreateVariable = usePersistFunction(async (name: string) => {
    if (cmsVariables.isEnabled) {
      const variable = await variableCreateModal.open({ name, folderID: null });

      return slateVariableItemFactory(SlateEditor.VariableElementVariant.VARIABLE)(variable);
    }

    const [firstVar] = await createLegacyVariableModal.open({ name });

    return slateLegacyVariableFactory(SlateEditor.VariableElementVariant.VARIABLE)(firstVar);
  });

  const pluginsOptions = useMemo<SlateEditor.ISlateEditor['pluginsOptions']>(
    () => ({
      ...pluginOptions,
      [SlateEditor.PluginType.VARIABLE]: {
        onClick: cmsVariables.isEnabled ? onClickVariable : undefined,
        ...pluginOptions?.[SlateEditor.PluginType.VARIABLE],
        onCreate: onCreateVariable,
        variablesMap,
        createButtonLabel: 'Create variable',
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
};
