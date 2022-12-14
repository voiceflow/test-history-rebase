import { Box, Button, Text, ThemeColor, useLocalStorage, useSetup } from '@voiceflow/ui';
import React from 'react';

import { importIntents } from '@/assets';
import client from '@/client';
import Popup from '@/components/JobInterface/Popup/index';
import * as NLU from '@/config/nlu';
import { NLUImportOrigin } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { useActiveProjectNLUConfig, useDispatch, useModelTracking, useNLUImport, useSelector } from '@/hooks';
import { NLUImportModel } from '@/models';

const FirstUsePopper: React.FC = () => {
  const nluConfig = useActiveProjectNLUConfig();

  const [getNluSeen, setNluSeen] = useLocalStorage('nlu-seen', false);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);
  const modelImportTracking = useModelTracking();

  const [open, setOpen] = React.useState(() => !getNluSeen());

  useSetup(() => {
    setNluSeen(true);
  });

  const onImport = async (importedModel: NLUImportModel) => {
    const data = await client.version.patchMergeIntentsAndSlots(versionID, importedModel);

    modelImportTracking({ nluType: nluConfig.type, importedModel });

    if (data) {
      await Promise.all([refreshSlots(), refreshIntents()]);
    }
  };

  const nluImport = useNLUImport({ nluType: nluConfig.type, platform, onImport });

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
            Import your existing {NLU.Voiceflow.CONFIG.is(nluConfig.type) ? 'NLU' : nluConfig.name} model to start improving it
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
