import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useIntentCreateModalV2 } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSIntent } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSRouteFolders } from '../../contexts/CMSRouteFolders';

export const useIntentCMSManager = useCMSManager<CMSIntent>;

export const useOnIntentCreate = () => {
  const history = useHistory();
  const cmsManager = useIntentCMSManager();
  const createModal = useIntentCreateModalV2();
  const getAtomValue = useGetAtomValue();
  const cmsRouteFolders = useCMSRouteFolders();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const intent = await createModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(`${getAtomValue(cmsRouteFolders.activeFolderURL) ?? getAtomValue(cmsManager.url)}/${intent.id}`);
    } catch {
      // closed
    }
  };
};
