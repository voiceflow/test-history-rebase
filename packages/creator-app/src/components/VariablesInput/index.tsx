import { InputRenderer, toast } from '@voiceflow/ui';
import React from 'react';

import TextEditor, { PluginType } from '@/components/TextEditor';
import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

import * as S from './styles';

const pluginsTypes = [PluginType.VARIABLES];

type InputCallback = (value: { text: string; variables: any[] }) => void;

interface VariablesInputProps {
  characters?: string;
  creatable?: boolean;
  createInputPlaceholder?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  space?: boolean;
  onBlur?: InputCallback;
  onEnterPress?: InputCallback;
}

const VariablesInput = React.forwardRef<HTMLDivElement, VariablesInputProps>(
  (
    {
      space = false,
      onBlur,
      fullWidth = false,
      multiline = false,
      creatable,
      characters,
      onEnterPress,
      createInputPlaceholder = 'New Variable',
      ...props
    },
    ref
  ) => {
    const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
    const addGlobalVariable = useDispatch(Version.addGlobalVariable);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const vars = React.useMemo(() => variables.map((name) => ({ id: name, name, isVariable: true })), [variables]);

    const onAddVariable = React.useCallback(
      async (name) => {
        if (!name) return null;

        try {
          await addGlobalVariable(name, CanvasCreationType.EDITOR);

          return { id: name, name, isVariable: true };
        } catch (err) {
          toast.error(err.message);

          return null;
        }
      },
      [addGlobalVariable]
    );

    const onVariableAdded = React.useCallback(({ name }) => {
      requestAnimationFrame(() => {
        const scroller = containerRef.current?.querySelector('.public-DraftEditor-content');
        if (!scroller) return;

        const scrollDistance = (name.length + 2) * 9;

        scroller.scrollLeft += scrollDistance;
      });
    }, []);

    const pluginProps = React.useMemo(
      () => ({
        [PluginType.VARIABLES]: { space, variables: vars, creatable, characters, onAddVariable, createInputPlaceholder, onVariableAdded },
      }),
      [space, vars, creatable, characters, onAddVariable, createInputPlaceholder, onVariableAdded]
    );

    const onBlurCallback = React.useCallback(
      ({ text, pluginsData }) => onBlur?.({ text, variables: pluginsData[PluginType.VARIABLES]?.variables || [] }),
      [onBlur]
    );

    const onEnterPressCallback = React.useCallback(
      ({ text, pluginsData }) => onEnterPress?.({ text, variables: pluginsData[PluginType.VARIABLES]?.variables || [] }),
      [onEnterPress]
    );

    return (
      <S.Container ref={containerRef} multiline={multiline} fullWidth={fullWidth}>
        <TextEditor
          {...props}
          ref={ref}
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
