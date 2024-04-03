import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useWorkflowCreateModal } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSWorkflow } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSResourceGetPath } from '../../hooks/cms-resource.hook';

export const useWorkflowCMSManager = useCMSManager<CMSWorkflow>;

export const useOnWorkflowCreate = () => {
  const history = useHistory();
  const cmsManager = useWorkflowCMSManager();
  const getAtomValue = useGetAtomValue();
  const getCMSResourcePath = useCMSResourceGetPath();
  const workflowCreateModal = useWorkflowCreateModal();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const entity = await workflowCreateModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(entity.id).path);
    } catch {
      // closed
    }
  };
};
