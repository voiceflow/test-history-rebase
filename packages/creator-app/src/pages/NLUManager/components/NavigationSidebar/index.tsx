import { Box, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { InteractionModelTabType, NLUImportOrigin } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { useDispatch, useSelector } from '@/hooks';
import { PLATFORM_PROJECT_META_MAP } from '@/pages/NewProjectV2/constants';
import { useNLUImport } from '@/pages/NewProjectV2/hooks';
import { ImportModel, SupportedPlatformProjectType } from '@/pages/NewProjectV2/types';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Item } from './components';
import * as S from './styles';

const NavigationSidebar: React.FC = () => {
  const nluManager = React.useContext(NLUManagerContext);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const hasImport = platform && PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType]?.importMeta;
  const fileExtensions = platform && PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType]?.importMeta?.fileExtensions;

  const onImportModel = async (importedModel: ImportModel) => {
    const data = await client.version.patchMergeIntentsAndSlots(versionID, importedModel);

    if (data) {
      await Promise.all([refreshSlots(), refreshIntents()]);
    }
  };

  const nluImport = useNLUImport({ fileExtensions, platform, onImportModel });

  return (
    <S.Container>
      <S.ItemsContainer>
        <Item
          icon="intent"
          title="Intent"
          onAdd={nluManager.createAndGoToItem}
          onClick={() => nluManager.goToTab(InteractionModelTabType.INTENTS)}
          isActive={nluManager.activeTab === InteractionModelTabType.INTENTS}
          createPlaceholder="intent"
        />

        <Item
          icon="entities"
          title="Entities"
          onAdd={nluManager.createAndGoToItem}
          onClick={() => nluManager.goToTab(InteractionModelTabType.SLOTS)}
          isActive={nluManager.activeTab === InteractionModelTabType.SLOTS}
          createPlaceholder="entity"
        />

        <Item
          icon="variables"
          title="Variables"
          onAdd={nluManager.createAndGoToItem}
          onClick={() => nluManager.goToTab(InteractionModelTabType.VARIABLES)}
          isActive={nluManager.activeTab === InteractionModelTabType.VARIABLES}
          createPlaceholder="variable"
        />
      </S.ItemsContainer>

      {hasImport && (
        <TippyTooltip
          html={
            <TippyTooltip.Complex title={<S.ImportTooltipTitle>{platform} import</S.ImportTooltipTitle>}>
              Imports must be in {nluImport.acceptedFileFormatsLabel} format
            </TippyTooltip.Complex>
          }
          position="top"
          bodyOverflow
        >
          <Box px={16} pb={12}>
            <Item onClick={() => nluImport.onUploadClick(NLUImportOrigin.NLU_MANAGER)} icon="downloadCircle" title="Import" />
          </Box>
        </TippyTooltip>
      )}

      <S.Footer onClick={goToCurrentCanvas}>
        <SvgIcon icon="arrowDown" size={18} color="#6e849a" inline style={{ marginRight: '10px' }} />
        Go to Designer
      </S.Footer>
    </S.Container>
  );
};

export default NavigationSidebar;
