import React from 'react';

import TextEditor, { PluginType } from '@/components/TextEditor';
import { toast } from '@/components/Toast';
import { addGlobalVariable } from '@/ducks/skill';
import { connect } from '@/hocs';
import { allVariablesSelector } from '@/store/selectors';
import { compose } from '@/utils/functional';

import { Container } from './components';

const pluginsTypes = [PluginType.VARIABLES];

const VariablesInput = (
  {
    space = false,
    onBlur,
    multiline = false,
    variables,
    creatable,
    characters,
    onEnterPress,
    addGlobalVariable,
    createInputPlaceholder = 'New Variable',
    ...props
  },
  ref
) => {
  const containerRef = React.useRef();
  const vars = React.useMemo(() => variables.map((name) => ({ id: name, name, isVariable: true })), [variables]);

  const onAddVariable = React.useCallback(
    (name) => {
      try {
        addGlobalVariable(name);

        return { id: name, name, isVariable: true };
      } catch (err) {
        toast.error(err);

        return null;
      }
    },
    [addGlobalVariable]
  );

  const onVariableAdded = React.useCallback(({ name }) => {
    requestAnimationFrame(() => {
      const scroller = containerRef.current.querySelector('.public-DraftEditor-content');

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
    <Container ref={containerRef} multiline={multiline}>
      <TextEditor
        {...props}
        ref={ref}
        onBlur={onBlurCallback}
        onEnterPress={onEnterPressCallback}
        pluginsTypes={pluginsTypes}
        pluginsProps={pluginProps}
      />
    </Container>
  );
};

const mapStateToProps = {
  variables: allVariablesSelector,
};

const mapDispatchToProps = {
  addGlobalVariable,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { forwardRef: true }
  ),
  React.forwardRef
)(VariablesInput);
