import { ReferenceResourceType } from '@voiceflow/dtos';
import { useAtomValue } from 'jotai';
import { getOne } from 'normal-store';
import React, { useCallback } from 'react';

import { intentMapAtom } from '@/atoms/intent.atom';
import { messageIDResourceIDMapAtom, normalizedResourcesAtom } from '@/atoms/reference.atom';
import { CMSRoute } from '@/config/routes';
import { Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';
import { CMSTableUsedByCell } from '@/pages/AssistantCMS/components/CMSTableUsedByCell/CMSTableUsedByCell.component';
import { useCMSTableUsedByCellGetItem } from '@/pages/AssistantCMS/components/CMSTableUsedByCell/CMSTableUsedByCell.hook';
import { CMSTableUsedByCellItem } from '@/pages/AssistantCMS/components/CMSTableUsedByCell/CMSTableUsedByCell.interface';
import { CMSTableUsedByCellItemType } from '@/pages/AssistantCMS/components/CMSTableUsedByCell/CMSTableUsedByCellItemType.enum';

interface ICMSResponseTableUsedByCell {
  messageID: string;
}

export const CMSResponseTableUsedByCell: React.FC<ICMSResponseTableUsedByCell> = ({ messageID }) => {
  const goToCMSIntent = useDispatch(Router.goToCMSResource, CMSRoute.INTENT);

  const intentMap = useAtomValue(intentMapAtom);
  const normalizedResources = useAtomValue(normalizedResourcesAtom);
  const messageIDResourceIDMap = useAtomValue(messageIDResourceIDMapAtom);

  const defaultGetItem = useCMSTableUsedByCellGetItem();

  const getItem = useCallback(
    (id: string | null): null | CMSTableUsedByCellItem => {
      const resource = id ? getOne(normalizedResources, id) : null;

      if (!id || resource?.type !== ReferenceResourceType.INTENT) return defaultGetItem(id);

      const intent = intentMap[id];

      if (!intent) return null;

      return {
        id,
        type: CMSTableUsedByCellItemType.INTENT,
        label: intent.name,
        onClick: () => goToCMSIntent(resource.resourceID),
      };
    },
    [normalizedResources, defaultGetItem, intentMap]
  );

  return (
    <CMSTableUsedByCell
      getItem={getItem}
      resourceID={messageID}
      referenceResourceIDByResourceIDMap={messageIDResourceIDMap}
    />
  );
};
