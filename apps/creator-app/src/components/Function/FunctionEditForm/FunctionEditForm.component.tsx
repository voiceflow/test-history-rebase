import { FunctionVariableKind } from '@voiceflow/dtos';
import { Divider } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { FunctionPathSection } from '../FunctionPathSection/FunctionPathSection.component';
import { FunctionVariableSection } from '../FunctionVariableSection/FunctionVariableSection.component';
import type { IFunctionEditForm } from './FunctionEditForm.interface';

export const FunctionEditForm: React.FC<IFunctionEditForm> = ({ functionID }) => {
  const autofocus = useInputAutoFocusKey();
  const functionPaths = useSelector(Designer.Function.FunctionPath.selectors.allByFunctionID, { functionID });
  const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, { functionID });
  const outputVariables = useSelector(Designer.Function.FunctionVariable.selectors.outputByFunctionID, { functionID });

  const patchFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.patchOne);
  const deleteFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.deleteOne);
  const createFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.createOne, functionID);
  const patchFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.patchOne);
  const deleteFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.deleteOne);
  const createFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.createOne, functionID);

  const onVariableAdd = async (type: FunctionVariableKind) => {
    const { id } = await createFunctionVariable({ type, name: '', description: '' });

    autofocus.setKey(id);
  };

  const onPathAdd = async () => {
    const { id } = await createFunctionPath({ name: '', label: '' });

    autofocus.setKey(id);
  };

  return (
    <>
      <FunctionVariableSection
        title="Input variables"
        functionVariables={inputVariables}
        onFunctionVariableAdd={() => onVariableAdd(FunctionVariableKind.INPUT)}
        onDeleteFunctionVariable={deleteFunctionVariable}
        onFunctionVariableChange={patchFunctionVariable}
        autoFocusKey={autofocus.key}
      />

      <Divider noPadding />

      <FunctionVariableSection
        title="Output variables"
        functionVariables={outputVariables}
        onFunctionVariableAdd={() => onVariableAdd(FunctionVariableKind.OUTPUT)}
        onDeleteFunctionVariable={deleteFunctionVariable}
        onFunctionVariableChange={patchFunctionVariable}
        autoFocusKey={autofocus.key}
      />

      <Divider noPadding />

      <FunctionPathSection
        title="Paths"
        functionPaths={functionPaths}
        onFunctionPathAdd={onPathAdd}
        onDeleteFunctionPath={deleteFunctionPath}
        onFunctionPathChange={patchFunctionPath}
        autoFocusKey={autofocus.key}
      />

      <Divider noPadding />
    </>
  );
};
