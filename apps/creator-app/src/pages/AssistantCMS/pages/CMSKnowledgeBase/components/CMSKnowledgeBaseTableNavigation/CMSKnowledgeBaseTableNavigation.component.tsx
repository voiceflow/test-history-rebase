import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, Table } from '@voiceflow/ui-next';
import { useAtomValue, useSetAtom } from 'jotai';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { Designer } from '@/ducks';
import { useGetAtomValue } from '@/hooks/atom.hook';
import { useFeature } from '@/hooks/feature';
import { usePermission } from '@/hooks/permission';
import { useDispatch } from '@/hooks/store.hook';
import { CMSResourceActions } from '@/pages/AssistantCMS/components/CMSResourceActions';
import { CMSTableNavigation } from '@/pages/AssistantCMS/components/CMSTableNavigation/CMSTableNavigation.component';

import { useKnowledgeBaseCMSManager } from '../../CMSKnowledgeBase.hook';
import { CMSKnowledgeBaseTableNavigationRefreshRateButton } from './CMSKnowledgeBaseTableNavigationRefreshRateButton.component';

export const CMSKnowledgeBaseTableNavigation: React.FC = () => {
  const { isEnabled: isRefreshEnabled } = useFeature(Realtime.FeatureFlag.KB_REFRESH);
  const [canSetRefreshRate] = usePermission(Permission.KB_REFRESH_RATE);

  const resyncMany = useDispatch(Designer.KnowledgeBase.Document.effect.resyncMany);

  const tableState = Table.useStateMolecule();
  const cmsManager = useKnowledgeBaseCMSManager();
  const getAtomValue = useGetAtomValue();
  const setSelectedIDs = useSetAtom(tableState.selectedIDs);

  const count = useAtomValue(cmsManager.dataToRenderSize);

  const onResync = async () => {
    const selectedIDs = getAtomValue(tableState.selectedIDs);

    setSelectedIDs(new Set());

    await resyncMany(Array.from(selectedIDs));
  };

  return (
    <CMSTableNavigation
      label={`All data sources (${count})`}
      actions={
        <>
          {isRefreshEnabled && (
            <>
              <Button label="Re-sync" iconName="Sync" size="medium" variant="secondary" onClick={onResync} />

              {canSetRefreshRate && <CMSKnowledgeBaseTableNavigationRefreshRateButton />}
            </>
          )}

          <CMSResourceActions.Delete />
        </>
      }
    />
  );
};
