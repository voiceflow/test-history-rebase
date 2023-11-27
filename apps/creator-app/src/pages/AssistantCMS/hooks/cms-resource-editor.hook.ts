import { useMolecule } from 'jotai-molecules';

import { CMSResourceEditorMolecule } from '../components/CMSResourceEditor/CMSResourceEditor.atom';

export const useCMSResourceEditor = () => useMolecule(CMSResourceEditorMolecule);
