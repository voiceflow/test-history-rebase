import composeRef from '@seznam/compose-react-refs';
import { InputRenderer, InputVariant, toast, useSetup } from '@voiceflow/ui';
import React from 'react';

import TextEditor, { PluginType } from '@/components/TextEditor';
import type { TextEditorBlurData, TextEditorProps, TextEditorRef, VariablesPluginsData } from '@/components/TextEditor/types';
import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import { useDispatch, useRAF, useSelector } from '@/hooks';
import { getErrorMessage } from '@/utils/error';

import * as S from './styles';

export type { TextEditorRef as VariablesInputRef } from '@/components/TextEditor/types';

const pluginsTypes = [PluginType.VARIABLES];

export interface VariablesInputValue {
  text: string;
  variables: string[];
}

export type SaveCallback = (data: VariablesInputValue) => void;

interface VariablesInputProps
  extends Omit<TextEditorProps, 'onBlur' | 'onEnterPress' | 'pluginsTypes' | 'pluginsProps'>,
    Omit<VariablesPluginsData, 'variables' | 'onAddVariable' | 'onVariableAdded'> {
  onBlur?: SaveCallback;
  variant?: InputVariant;
  fullWidth?: boolean;
  multiline?: boolean;
  onEnterPress?: SaveCallback;
}

const AVERAGE_SYMBOL_WIDTH = 9;

const VariablesInput = React.forwardRef<TextEditorRef, VariablesInputProps>(
  (
    {
      space = false,
      onBlur,
      fullWidth = false,
      multiline = false,
      autoFocus,
      creatable,
      characters,
      onEnterPress,
      createInputPlaceholder = 'Search variables',
      ...props
    },
    ref
  ) => {
    const [autofocusScheduler] = useRAF();
    const [addVariableScheduler] = useRAF();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const textEditorRef = React.useRef<TextEditorRef>(null);

    const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
    const addGlobalVariable = useDispatch(Version.addGlobalVariable);

    const onAddVariable = React.useCallback(
      async (name?: string) => {
        if (!name) return null;

        try {
          await addGlobalVariable(name, CanvasCreationType.EDITOR);

          return { id: name, name, isVariable: true };
        } catch (err) {
          toast.error(getErrorMessage(err));

          return null;
        }
      },
      [addGlobalVariable]
    );

    const onVariableAdded = React.useCallback(({ name }: { name: string }) => {
      addVariableScheduler(() => {
        const draftEditorContent = containerRef.current?.querySelector('.public-DraftEditor-content');

        if (!draftEditorContent) return;

        draftEditorContent.scrollLeft += (name.length + 2) * AVERAGE_SYMBOL_WIDTH;
      });
    }, []);

    const pluginProps = React.useMemo(
      () => ({
        [PluginType.VARIABLES]: { space, variables, creatable, characters, onAddVariable, createInputPlaceholder, onVariableAdded },
      }),
      [space, variables, creatable, characters, onAddVariable, createInputPlaceholder, onVariableAdded]
    );

    const onBlurCallback = React.useCallback(
      ({ text, pluginsData }: TextEditorBlurData) => onBlur?.({ text, variables: pluginsData[PluginType.VARIABLES]?.variables || [] }),
      [onBlur]
    );

    const onEnterPressCallback = React.useCallback(
      ({ text, pluginsData }: TextEditorBlurData) => onEnterPress?.({ text, variables: pluginsData[PluginType.VARIABLES]?.variables || [] }),
      [onEnterPress]
    );

    useSetup(() => {
      if (autoFocus) {
        autofocusScheduler(() => textEditorRef.current?.focus());
      }
    });

    return (
      <S.Container ref={containerRef} multiline={multiline} fullWidth={fullWidth}>
        <TextEditor
          {...props}
          ref={composeRef(ref, textEditorRef)}
          onBlur={onBlurCallback}
          onEnterPress={onEnterPress && onEnterPressCallback}
          pluginsTypes={pluginsTypes}
          pluginsProps={pluginProps}
        />
      </S.Container>
    );
  }
);

const renderInput: InputRenderer = (props) => <VariablesInput {...props} />;

export default Object.assign(VariablesInput, {
  renderInput,
});
