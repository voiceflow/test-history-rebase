import { FunctionVariableKind } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Divider } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { mapSort } from '@/utils/array.util';

import { FunctionPathSection } from '../FunctionPathSection/FunctionPathSection.component';
import { FunctionVariableSection } from '../FunctionVariableSection/FunctionVariableSection.component';
import type { IFunctionEditForm } from './FunctionEditForm.interface';

export const FunctionEditForm: React.FC<IFunctionEditForm> = ({ functionID }) => {
  const TEST_ID = 'function';

  const autofocus = useInputAutoFocusKey();
  const functionObj = useSelector(Designer.Function.selectors.oneByID, { id: functionID });
  const functionPaths = useSelector(Designer.Function.FunctionPath.selectors.allByFunctionID, { functionID });
  const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, { functionID });
  const outputVariables = useSelector(Designer.Function.FunctionVariable.selectors.outputByFunctionID, { functionID });

  const patchFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.patchOne);
  const deleteFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.deleteOne);
  const createFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.createOne, functionID);
  const reorderFunctionPaths = useDispatch(Designer.Function.effect.patchOne, functionID);
  const patchFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.patchOne);
  const deleteFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.deleteOne);
  const createFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.createOne, functionID);

  const pathsOrdered = mapSort(functionPaths, functionObj?.pathOrder || [], 'id');

  const onVariableAdd = async (type: FunctionVariableKind) => {
    const { id } = await createFunctionVariable({ type, name: '', description: '' });

    autofocus.setKey(id);
  };

  const onPathAdd = async () => {
    const { id } = await createFunctionPath({ name: '', label: '' });

    autofocus.setKey(id);
  };

  const onPathsReorder = async (pathIds: string[] = []) => {
    return reorderFunctionPaths({ pathOrder: pathIds });
  };

  return (
    <>
      <FunctionVariableSection
        title="Input variables"
        autoFocusKey={autofocus.key}
        functionVariables={inputVariables}
        onFunctionVariableAdd={() => onVariableAdd(FunctionVariableKind.INPUT)}
        onDeleteFunctionVariable={deleteFunctionVariable}
        onFunctionVariableChange={patchFunctionVariable}
        testID={tid(TEST_ID, 'input-variables')}
      />

      <Divider noPadding />

      <FunctionVariableSection
        title="Output variables"
        autoFocusKey={autofocus.key}
        functionVariables={outputVariables}
        onFunctionVariableAdd={() => onVariableAdd(FunctionVariableKind.OUTPUT)}
        onDeleteFunctionVariable={deleteFunctionVariable}
        onFunctionVariableChange={patchFunctionVariable}
        testID={tid(TEST_ID, 'output-variables')}
      />

      <Divider noPadding />

      <FunctionPathSection
        title="Paths"
        autoFocusKey={autofocus.key}
        functionPaths={pathsOrdered}
        onFunctionPathAdd={onPathAdd}
        onDeleteFunctionPath={deleteFunctionPath}
        onFunctionPathChange={patchFunctionPath}
        onFunctionPathReorder={onPathsReorder}
      />

      <Divider noPadding />
    </>
  );
};
