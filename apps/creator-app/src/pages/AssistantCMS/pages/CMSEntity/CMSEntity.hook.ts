import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useEntityCreateModal } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSEntity } from '../../contexts/CMSManager/CMSManager.interface';
import { useGetCMSResourcePath } from '../../hooks/cms-resource.hook';

export const useEntityCMSManager = useCMSManager<CMSEntity>;

export const useOnEntityCreate = () => {
  const history = useHistory();
  const cmsManager = useEntityCMSManager();
  const getAtomValue = useGetAtomValue();
  const entityCreateModal = useEntityCreateModal();
  const getCMSResourcePath = useGetCMSResourcePath();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const entity = await entityCreateModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(entity.id).path);
    } catch {
      // closed
    }
  };
};
