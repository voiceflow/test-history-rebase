import { useAtomValue } from 'jotai';
import { useMolecule } from 'jotai-molecules';

import { CMSRouteFoldersMolecule } from './CMSRouteFolders.atom';

export const useCMSRouteFolders = () => useMolecule(CMSRouteFoldersMolecule);

export const useCMSActiveRouteFolderID = () => {
  const { activeFolderID } = useCMSRouteFolders();

  return useAtomValue(activeFolderID);
};
