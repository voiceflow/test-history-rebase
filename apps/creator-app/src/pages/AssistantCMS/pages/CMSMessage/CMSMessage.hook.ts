import { ResponseType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { useHistory } from 'react-router-dom';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSMessage } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSResourceGetPath } from '../../hooks/cms-resource.hook';

export const useResponseCMSManager = useCMSManager<CMSMessage>;

export const DEFAULT_MESSAGE: Actions.Response.CreateData['messages'] = [
  {
    text: [''],
    delay: 0,
    condition: null,
  },
];

export const useOnResponseCreate = () => {
  const history = useHistory();
  const createResponse = useDispatch(Designer.Response.effect.createOne);
  const cmsManager = useResponseCMSManager();
  const getAtomValue = useGetAtomValue();
  const getCMSResourcePath = useCMSResourceGetPath();

  return async ({ name }: { name: string } = { name: '' }) => {
    try {
      const entity = await createResponse({
        name,
        type: ResponseType.MESSAGE,
        variants: [],
        messages: DEFAULT_MESSAGE,
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(entity.id).path);
    } catch {
      // do nothing
    }
  };
};
