import { useHistory } from 'react-router-dom';

import { useGetAtomValue } from '@/hooks/atom.hook';
import { useModal } from '@/hooks/modal.hook';
import { Modals } from '@/ModalsV2';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSFunction } from '../../contexts/CMSManager/CMSManager.interface';
import { useGetCMSResourcePath } from '../../hooks/cms-resource.hook';

export const useFunctionCMSManager = useCMSManager<CMSFunction>;

export const useOnFunctionCreate = () => {
  const history = useHistory();
  const cmsManager = useFunctionCMSManager();
  const createModal = useModal(Modals.Function.Create);
  const getAtomValue = useGetAtomValue();
  const getCMSResourcePath = useGetCMSResourcePath();

  return async ({ name }: { name?: string } = {}) => {
    try {
      const functionData = await createModal.open({
        name: name || getAtomValue(cmsManager.originalSearch),
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(functionData.id).path);
    } catch {
      // closed
    }
  };
};
