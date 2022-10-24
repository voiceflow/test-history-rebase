import { Box, Button, Text, ThemeColor, useLocalStorage, useSetup } from '@voiceflow/ui';
import React from 'react';

import { importIntents } from '@/assets';
import client from '@/client';
import Popup from '@/components/JobInterface/Popup/index';
import { NLUImportOrigin } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { useDispatch, useModelTracking, useSelector, useTrackingEvents } from '@/hooks';
import { PLATFORM_PROJECT_META_MAP } from '@/pages/NewProjectV2/constants';
import { useNLUImport } from '@/pages/NewProjectV2/hooks';
import { ImportModel, SupportedPlatformProjectType } from '@/pages/NewProjectV2/types';

import { getPlatformTitle, getPopperContent } from './constants';

const FirstUsePopper: React.FC = () => {
  const [getNluSeen, setNluSeen] = useLocalStorage('nlu-seen', false);

  const [trackingEvents] = useTrackingEvents();

  const platform = useSelector(ProjectV2.active.platformSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);
  const modelImportTracking = useModelTracking();
  const platformTitle = getPlatformTitle(platform);

  const fileExtensions = platform && PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType]?.importMeta?.fileExtensions;

  const [open, setOpen] = React.useState(() => !getNluSeen());

  useSetup(() => {
    setNluSeen(true);
  });

  const onImportModel = async (importedModel: ImportModel) => {
    const data = await client.version.patchMergeIntentsAndSlots(versionID, importedModel);

    modelImportTracking(platform, importedModel, trackingEvents);

    if (data) {
      await Promise.all([refreshSlots(), refreshIntents()]);
    }
  };

  const nluImport = useNLUImport({ fileExtensions, platform, onImportModel });

  if (!open) return null;

  return (
    <Box.Flex style={{ position: 'absolute', top: 16, right: 16 }}>
      <Popup dismissable={false} closeable={true} cancel={() => setOpen(false)}>
        <Box.FlexCenter flexDirection="column" p={24} width={300}>
          <Box.FlexCenter size={104} borderRadius="50%" backgroundColor={ThemeColor.SKY_BLUE}>
            <img alt="import intents" height={80} src={importIntents} />
          </Box.FlexCenter>
          <Text mt={16} mb={8} color={ThemeColor.PRIMARY} fontWeight={600}>
            Have an existing NLU model?
          </Text>
          <Text textAlign="center" mb={20} color={ThemeColor.SECONDARY}>
            {getPopperContent(platformTitle)(platform)}
          </Text>
          <Button onClick={() => nluImport.onUploadClick(NLUImportOrigin.NLU_MANAGER)} fullWidth squareRadius>
            Import Model
          </Button>
        </Box.FlexCenter>
      </Popup>
    </Box.Flex>
  );
};

export default FirstUsePopper;
