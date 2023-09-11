import { useMolecule } from 'jotai-molecules';

import { CMSResourceMolecule } from './CMSManager.atom';
import type { CMSManager, CMSResource } from './CMSManager.interface';

export const useCMSManager = <Item extends CMSResource>() => useMolecule(CMSResourceMolecule) as CMSManager<Item>;
