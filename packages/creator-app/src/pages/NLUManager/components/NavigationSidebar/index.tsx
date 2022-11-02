import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon, TippyTooltip, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as NLU from '@/config/nlu';
import { NLURoute } from '@/config/routes';
import { ModalType, NLUImportOrigin } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Slot from '@/ducks/slot';
import { useDispatch, useFeature, useModals, useModelTracking, useNLUImport, useSelector, useTrackingEvents } from '@/hooks';
import { NLUImportModel } from '@/models';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import { Item } from './components';
import * as S from './styles';

const NavigationSidebar: React.FC = () => {
  const [importClicked, setImportClicked] = useLocalStorageState('import-clicked', false);

  const nluManager = React.useContext(NLUManagerContext);
  const { open: openExportModelModal } = useModals<{ checkedItems: string[] }>(ModalType.EXPORT_MODEL);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const { isEnabled: isUnclassifiedDataEnabled } = useFeature(Realtime.FeatureFlag.NLU_MANAGER_UNCLASSIFIED);

  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const [trackingEvents] = useTrackingEvents();
  const modelImportTracking = useModelTracking();

  const onImport = async (importedModel: NLUImportModel) => {
    const data = await client.version.patchMergeIntentsAndSlots(versionID, importedModel);

    modelImportTracking(platform, importedModel, trackingEvents);

    if (data) {
      await Promise.all([refreshSlots(), refreshIntents()]);
    }
  };

  const nluImport = useNLUImport({ platform, onImport });

  const onImportClick = () => {
    nluImport.onUploadClick(NLUImportOrigin.NLU_MANAGER);
    setImportClicked(true);
  };

  return (
    <S.Container>
      <S.ItemsContainer>
        {isUnclassifiedDataEnabled && (
          <Box mb={24}>
            <Item
              icon="noMatch"
              title="Unclassified"
              onAdd={() => {}}
              onClick={() => nluManager.goToTab(NLURoute.UNCLASSIFIED)}
              isActive={nluManager.activeTab === NLURoute.UNCLASSIFIED}
              createPlaceholder="unclassified"
              counter={0}
            />
          </Box>
        )}

        <Item
          icon="intent"
          title="Intent"
          onAdd={nluManager.createIntent}
          onClick={() => nluManager.goToTab(NLURoute.INTENTS)}
          isActive={nluManager.activeTab === NLURoute.INTENTS}
          createPlaceholder="intent"
          counter={nluManager.intents.length}
        />

        <Item
          icon="setV2"
          title="Entities"
          onAdd={nluManager.createEntity}
          onClick={() => nluManager.goToTab(NLURoute.ENTITIES)}
          isActive={nluManager.activeTab === NLURoute.ENTITIES}
          createPlaceholder="entity"
          counter={nluManager.entities.length}
        />
      </S.ItemsContainer>

      {!!NLU.Config.get(platform).nlps[0].import && (
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
            <Item onClick={onImportClick} icon="importCircle" title="Import" />
            {!importClicked && <S.StatusBubble />}
          </Box>
        </TippyTooltip>
      )}
      <Box px={16} pb={12}>
        <Item onClick={() => openExportModelModal({ checkedItems: Array.from(nluManager.selectedIntentIDs) })} icon="uploadCircle" title="Export" />
      </Box>

      <S.Footer onClick={goToCurrentCanvas}>
        <SvgIcon icon="arrowDown" size={18} color="#6e849a" inline style={{ marginRight: '10px' }} />
        Go to Designer
      </S.Footer>
    </S.Container>
  );
};

export default NavigationSidebar;
