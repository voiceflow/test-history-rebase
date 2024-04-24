import { Router } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useWorkflowCreateModal } from '@/hooks/modal.hook';
import { useDispatch } from '@/hooks/store.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSWorkflow } from '../../contexts/CMSManager/CMSManager.interface';

export const useWorkflowCMSManager = useCMSManager<CMSWorkflow>;

export const useOnWorkflowCreate = () => {
  const cmsManager = useWorkflowCMSManager();
  const goToDiagram = useDispatch(Router.goToDiagram);
  const getAtomValue = useGetAtomValue();
  const workflowCreateModal = useWorkflowCreateModal();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const entity = await workflowCreateModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      goToDiagram(entity.diagramID, entity.triggerNodeID ?? undefined);
    } catch {
      // closed
    }
  };
};
