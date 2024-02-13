import { useMolecule } from 'jotai-molecules';

import { CMSRouteFoldersMolecule } from './CMSRouteFolders.atom';

export const useCMSRouteFolders = () => useMolecule(CMSRouteFoldersMolecule);
