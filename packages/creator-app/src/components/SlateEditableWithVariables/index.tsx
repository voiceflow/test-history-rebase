import composeRef from '@seznam/compose-react-refs';
import { Normalized, Nullish } from '@voiceflow/common';
import { Box, Input, stopPropagation, toast, useContextApi, useCreateConst, usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import SlateEditable, {
  HyperlinkButton,
  SlateEditableProps,
  SlateEditableRef,
  SlateEditorAPI,
  SlatePluginsOptions,
  SlatePluginType,
  SlateValue,
  SlateVariableItem,
  TextBoldButton,
  TextItalicButton,
  TextStrikeThroughButton,
  TextUnderlineButton,
  useSetupSlateEditor,
  useSlateEditorForceNormalize,
} from '@/components/SlateEditable';
import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import { useDispatch, useLinkedState, useSelector } from '@/hooks';

import { Toolbar } from './components';

export type { SlateValue } from '@/components/SlateEditable';

export interface SlateEditableWithVariablesProps
  extends Omit<SlateEditableProps, 'value' | 'editor' | 'onBlur' | 'topToolbar' | 'onChange' | 'pluginsOptions'> {
  value?: Nullish<SlateEditableProps['value']>;
  onBlur?: Nullish<(value: SlateValue) => void>;
  onChange?: Nullish<SlateEditableProps['onChange']>;
  variables?: Normalized<SlateVariableItem>;
  pluginsOptions?: Nullish<Omit<SlateEditableProps['pluginsOptions'], SlatePluginType.VARIABLES>>;
  variablesCreatable?: boolean;
  variablesWithSlots?: boolean;
  extraToolbarButtons?: React.ReactNode;
}

const SlateEditableWithVariables: React.ForwardRefRenderFunction<SlateEditableRef, SlateEditableWithVariablesProps> = (
  {
    value,
    onBlur,
    onChange,
    variables: propVariables,
    placeholder = 'Enter text reply, {} to add variables',
    pluginsOptions,
    variablesCreatable = true,
    variablesWithSlots,
    extraToolbarButtons,
    ...props
  },
  ref
) => {
  const editor = useSetupSlateEditor(SlatePluginType.LINKS, SlatePluginType.VARIABLES);

  const localVariables = useSelector(DiagramV2.active.allSlotsAndVariablesNormalizedSelector);
  const addGlobalVariable = useDispatch(Version.addGlobalVariable);

  const defaultValue = useCreateConst(() => SlateEditorAPI.getEmptyState());
  const [localValue, setLocalValue] = useLinkedState(value ?? defaultValue);

  const onPersistedChange = usePersistFunction(onChange);

  const onLocalChange = React.useCallback((nextValue: SlateValue) => {
    setLocalValue(nextValue);
    onPersistedChange?.(nextValue);
  }, []);

  const onCreateVariable = React.useCallback(async (name: string) => {
    try {
      await addGlobalVariable(name, CanvasCreationType.EDITOR);

      return { id: name, name };
    } catch (err) {
      toast.error(err.message);

      return null;
    }
  }, []);

  const variables = propVariables ?? localVariables;

  const localPluginsOptions = useContextApi<SlatePluginsOptions>({
    ...pluginsOptions,
    [SlatePluginType.VARIABLES]: useContextApi<SlatePluginsOptions[SlatePluginType.VARIABLES]>({
      onCreate: onCreateVariable,
      variables,
      creatable: variablesCreatable,
      withSlots: variablesWithSlots,
    }),
  });

  useSlateEditorForceNormalize(editor, [variables]);

  return (
    <Input>
      {({ ref: inputRef }) => (
        <SlateEditable
          ref={composeRef(inputRef, ref)}
          value={localValue}
          editor={editor}
          onBlur={() => onBlur?.(localValue)}
          onChange={onLocalChange}
          placeholder={placeholder}
          pluginsOptions={localPluginsOptions}
          {...props}
        >
          <Toolbar onClick={stopPropagation()}>
            <TextBoldButton />
            <TextItalicButton />
            <TextUnderlineButton />
            <TextStrikeThroughButton />
            <Box width="1px" height="15px" backgroundColor="#dfe3ed" />
            <HyperlinkButton />

            {extraToolbarButtons}
          </Toolbar>
        </SlateEditable>
      )}
    </Input>
  );
};

export default React.forwardRef<SlateEditableRef, SlateEditableWithVariablesProps>(SlateEditableWithVariables);
