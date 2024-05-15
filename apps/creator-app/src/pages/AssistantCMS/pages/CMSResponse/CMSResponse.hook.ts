import { ResponseVariantType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { useHistory } from 'react-router-dom';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks';
import { useGetAtomValue } from '@/hooks/atom.hook';

import { useCMSManager } from '../../contexts/CMSManager';
import type { CMSResponse } from '../../contexts/CMSManager/CMSManager.interface';
import { useCMSResourceGetPath } from '../../hooks/cms-resource.hook';

export const useResponseCMSManager = useCMSManager<CMSResponse>;

const DEFAULT_RESPONSE_VARIANT: Actions.Response.CreateData['variants'] = [
  {
    type: ResponseVariantType.TEXT,
    text: [''],
    speed: 5,
    cardLayout: 'list',
    condition: null,
    attachments: [],
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
        variants: DEFAULT_RESPONSE_VARIANT,
        folderID: getAtomValue(cmsManager.folderID),
      });

      history.push(getCMSResourcePath(entity.id).path);
    } catch {
      // closed
    }
  };
};
