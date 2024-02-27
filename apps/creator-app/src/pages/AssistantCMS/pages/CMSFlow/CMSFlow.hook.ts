import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useFlowCreateModal } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSFlow } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSResourceGetPath } from '../../hooks/cms-resource.hook';

export const useFlowCMSManager = useCMSManager<CMSFlow>;

export const useOnFlowCreate = () => {
  const history = useHistory();
  const cmsManager = useFlowCMSManager();
  const getAtomValue = useGetAtomValue();
  const getCMSResourcePath = useCMSResourceGetPath();
  const flowCreateModal = useFlowCreateModal();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const entity = await flowCreateModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(entity.id).path);
    } catch {
      // closed
    }
  };
};
