import { FunctionVariableKind } from '@voiceflow/dtos';
import { Divider, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { FunctionPathSection } from '../FunctionPathSection/FunctionPathSection.component';
import { FunctionVariableSection } from '../FunctionVariableSection/FunctionVariableSection.component';
import type { IFunctionEditForm } from './FunctionEditForm.interface';

export const FunctionEditForm: React.FC<IFunctionEditForm> = ({ functionID }) => {
  const functionPaths = useSelector(Designer.Function.FunctionPath.selectors.allByFunctionID, { functionID });
  const inputVariables = useSelector(Designer.Function.FunctionVariable.selectors.inputByFunctionID, { functionID });
  const outputVariables = useSelector(Designer.Function.FunctionVariable.selectors.outputByFunctionID, { functionID });

  const patchFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.patchOne);
  const deleteFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.deleteOne);
  const createFunctionPath = useDispatch(Designer.Function.FunctionPath.effect.createOne, functionID);
  const patchFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.patchOne);
  const deleteFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.deleteOne);
  const createFunctionVariable = useDispatch(Designer.Function.FunctionVariable.effect.createOne, functionID);

  return (
    <Scroll>
      <FunctionVariableSection
        title="Input variables"
        functionVariables={inputVariables}
        onFunctionVariableAdd={() => createFunctionVariable({ type: FunctionVariableKind.INPUT, name: '', description: '' })}
        onDeleteFunctionVariable={deleteFunctionVariable}
        onFunctionVariableChange={patchFunctionVariable}
      />

      <Divider />

      <FunctionVariableSection
        title="Output variables"
        functionVariables={outputVariables}
        onFunctionVariableAdd={() => createFunctionVariable({ type: FunctionVariableKind.OUTPUT, name: '', description: '' })}
        onDeleteFunctionVariable={deleteFunctionVariable}
        onFunctionVariableChange={patchFunctionVariable}
      />

      <Divider />

      <FunctionPathSection
        title="Paths"
        functionPaths={functionPaths}
        onFunctionPathAdd={() => createFunctionPath({ name: '', label: '' })}
        onDeleteFunctionPath={deleteFunctionPath}
        onFunctionPathChange={patchFunctionPath}
      />

      <Divider />
    </Scroll>
  );
};
