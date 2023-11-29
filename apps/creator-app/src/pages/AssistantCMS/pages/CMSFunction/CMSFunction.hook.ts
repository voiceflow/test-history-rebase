import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useModal } from '@/hooks/modal.hook';
import { Modals } from '@/ModalsV2';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSFunction } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSRouteFolders } from '../../contexts/CMSRouteFolders';

export const useFunctionCMSManager = useCMSManager<CMSFunction>;

export const useOnFunctionCreate = () => {
  const history = useHistory();
  const cmsManager = useFunctionCMSManager();
  const createModal = useModal(Modals.Function.Create);
  const getAtomValue = useGetAtomValue();
  const cmsRouteFolders = useCMSRouteFolders();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const functionData = await createModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(`${getAtomValue(cmsRouteFolders.activeFolderURL) ?? getAtomValue(cmsManager.url)}/${functionData.id}`);
    } catch {
      // closed
    }
  };
};
