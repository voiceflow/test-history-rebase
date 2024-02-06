import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useComponentCreateModal } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSFlow } from '../../contexts/CMSManager/CMSManager.interface';
import { useGetCMSResourcePath } from '../../hooks/cms-resource.hook';

export const useComponentCMSManager = useCMSManager<CMSFlow>;

export const useOnComponentCreate = () => {
  const history = useHistory();
  const cmsManager = useComponentCMSManager();
  const getAtomValue = useGetAtomValue();
  const getCMSResourcePath = useGetCMSResourcePath();
  const componentCreateModal = useComponentCreateModal();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const entity = await componentCreateModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(entity.id).path);
    } catch {
      // closed
    }
  };
};
