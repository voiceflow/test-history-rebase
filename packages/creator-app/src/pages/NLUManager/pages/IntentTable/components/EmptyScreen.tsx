import React from 'react';

import client from '@/client';
import { NLUImportOrigin } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { useDispatch, useModelTracking, useSelector, useTrackingEvents } from '@/hooks';
import { PLATFORM_PROJECT_META_MAP } from '@/pages/NewProjectV2/constants';
import { useNLUImport } from '@/pages/NewProjectV2/hooks';
import { ImportModel, SupportedPlatformProjectType } from '@/pages/NewProjectV2/types';
import EmptyView from '@/pages/NLUManager/components/EmptyView';
import NoResultsScreen from '@/pages/NLUManager/components/NoResultsScreen';
import { useNLUManager } from '@/pages/NLUManager/context';

const EmptyScreen: React.FC = () => {
  const nluManager = useNLUManager();

  const platform = useSelector(ProjectV2.active.platformSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);
  const fileExtensions = platform && PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType]?.importMeta?.fileExtensions;
  const [trackingEvents] = useTrackingEvents();
  const modelImportTracking = useModelTracking();

  const onImportModel = async (importedModel: ImportModel) => {
    const data = await client.version.patchMergeIntentsAndSlots(versionID, importedModel);

    modelImportTracking(platform, importedModel, trackingEvents);

    if (data) {
      await Promise.all([refreshSlots(), refreshIntents()]);
    }
  };

  const nluImport = useNLUImport({ fileExtensions, platform, onImportModel });

  if (nluManager.search) {
    return <NoResultsScreen itemName="intents" onCleanFilters={() => nluManager.setSearch('')} />;
  }

  return <EmptyView tab={nluManager.activeTab} onCreate={() => nluImport.onUploadClick(NLUImportOrigin.NLU_MANAGER)} />;
};

export default EmptyScreen;
