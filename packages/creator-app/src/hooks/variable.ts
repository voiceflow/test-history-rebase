import * as DiagramV2 from '@/ducks/diagramV2';
import { CanvasCreationType } from '@/ducks/tracking/constants';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

export const useVariableCreation = () => {
  const variables = useSelector(DiagramV2.active.allSlotsAndVariablesSelector);
  const addVariable = useDispatch(Version.addGlobalVariable);

  const createVariable = async (item: string) => {
    if (!item) return;
    await addVariable(item, CanvasCreationType.EDITOR);
  };

  return { variables, createVariable };
};
