import { Table, usePersistFunction } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';

export const useCMSActiveResourceID = () => {
  const tableState = Table.useStateMolecule();

  return useAtomValue(tableState.activeID)!;
};

export const useCMSRenameColumn = <ColumnType extends string>(columnType?: ColumnType) => {
  const tableStateMolecule = Table.useStateMolecule();
  const setEditMode = useSetAtom(tableStateMolecule.editMode);

  return usePersistFunction((itemID: string) => columnType && setEditMode({ itemID, columnType }));
};
