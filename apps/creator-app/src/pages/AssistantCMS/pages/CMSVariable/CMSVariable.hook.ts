import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useVariableCreateModal } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSVariable } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSResourceGetPath } from '../../hooks/cms-resource.hook';

export const useVariableCMSManager = useCMSManager<CMSVariable>;

export const useOnVariableCreate = () => {
  const history = useHistory();
  const cmsManager = useVariableCMSManager();
  const getAtomValue = useGetAtomValue();
  const cmsResourceGetPath = useCMSResourceGetPath();
  const variableCreateModal = useVariableCreateModal();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const entity = await variableCreateModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(cmsResourceGetPath(entity.id).path);
    } catch {
      // closed
    }
  };
};
