import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useEntityCreateModalV2 } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSEntity } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSRouteFolders } from '../../contexts/CMSRouteFolders';

export const useEntityCMSManager = useCMSManager<CMSEntity>;

export const useOnEntityCreate = () => {
  const history = useHistory();
  const cmsManager = useEntityCMSManager();
  const createModal = useEntityCreateModalV2();
  const getAtomValue = useGetAtomValue();
  const cmsRouteFolders = useCMSRouteFolders();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const entity = await createModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(`${getAtomValue(cmsRouteFolders.activeFolderURL) ?? getAtomValue(cmsManager.url)}/${entity.id}`);
    } catch {
      // closed
    }
  };
};
