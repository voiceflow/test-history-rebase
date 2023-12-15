import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useIntentCreateModalV2 } from '@/hooks/modal.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSIntent } from '../../contexts/CMSManager/CMSManager.interface';
import { useGetCMSResourcePath } from '../../hooks/cms-resource.hook';

export const useIntentCMSManager = useCMSManager<CMSIntent>;

export const useOnIntentCreate = () => {
  const history = useHistory();
  const cmsManager = useIntentCMSManager();
  const createModal = useIntentCreateModalV2();
  const getAtomValue = useGetAtomValue();
  const getCMSResourcePath = useGetCMSResourcePath();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const intent = await createModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(intent.id).path);
    } catch {
      // closed
    }
  };
};
