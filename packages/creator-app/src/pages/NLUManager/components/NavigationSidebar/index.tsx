import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon, TippyTooltip, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import NavigationSidebar from '@/components/NavigationSidebar';
import { NLURoute } from '@/config/routes';
import { ModalType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useActiveProjectNLUConfig, useDispatch, useFeature, useModals, useNLUImport, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { NLUManagerContext } from '@/pages/NLUManager/context';

import * as S from './styles';

const NLUNavigationSidebar: React.FC = () => {
  const nluConfig = useActiveProjectNLUConfig();

  const [importClicked, setImportClicked] = useLocalStorageState('import-clicked', false);
  const { open } = ModalsV2.useModal(ModalsV2.NLU.Import);

  const nluManager = React.useContext(NLUManagerContext);
  const { open: openExportModelModal } = useModals<{ checkedItems: string[] }>(ModalType.EXPORT_MODEL);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const { isEnabled: isUnclassifiedDataEnabled } = useFeature(Realtime.FeatureFlag.NLU_MANAGER_UNCLASSIFIED);

  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const nluImportIntentsModal = ModalsV2.useModal(ModalsV2.NLU.IntentImport);

  const nluImport = useNLUImport({ nluType: nluConfig.type, platform });

  const onImportClick = () => {
    nluImportIntentsModal.openVoid();
    setImportClicked(true);
  };

  return (
    <NavigationSidebar>
      <NavigationSidebar.ItemsContainer>
        {isUnclassifiedDataEnabled && (
          <Box mb={24}>
            <NavigationSidebar.Item
              icon="noMatch"
              title="Unclassified"
              onClick={() => nluManager.goToTab(NLURoute.UNCLASSIFIED)}
              isActive={nluManager.activeTab === NLURoute.UNCLASSIFIED}
            >
              {({ isActive }) =>
                isActive ? (
                  <NavigationSidebar.Item.AddButton tooltip={{ title: 'Import data' }} onClick={() => open()} />
                ) : (
                  <NavigationSidebar.Item.SubText>{nluManager.unclassifiedUtterances.length}</NavigationSidebar.Item.SubText>
                )
              }
            </NavigationSidebar.Item>
          </Box>
        )}

        <NavigationSidebar.Item
          icon="intent"
          title="Intent"
          onClick={() => nluManager.goToTab(NLURoute.INTENTS)}
          isActive={nluManager.activeTab === NLURoute.INTENTS}
        >
          {({ isActive }) =>
            isActive ? (
              <NavigationSidebar.Item.AddButton tooltip={{ title: 'Create intent' }} onClick={() => nluManager.createIntent()} />
            ) : (
              <NavigationSidebar.Item.SubText>{nluManager.intents.length}</NavigationSidebar.Item.SubText>
            )
          }
        </NavigationSidebar.Item>

        <NavigationSidebar.Item
          icon="setV2"
          title="Entities"
          onClick={() => nluManager.goToTab(NLURoute.ENTITIES)}
          isActive={nluManager.activeTab === NLURoute.ENTITIES}
        >
          {({ isActive }) =>
            isActive ? (
              <NavigationSidebar.Item.AddButton tooltip={{ title: 'Create entity' }} onClick={() => nluManager.createEntity()} />
            ) : (
              <NavigationSidebar.Item.SubText>{nluManager.entities.length}</NavigationSidebar.Item.SubText>
            )
          }
        </NavigationSidebar.Item>
      </NavigationSidebar.ItemsContainer>

      {!!nluConfig.nlps[0].import && (
        <TippyTooltip
          html={
            <TippyTooltip.Complex title={<S.ImportTooltipTitle>{platform} import</S.ImportTooltipTitle>}>
              Imports must be in {nluImport.acceptedFileFormatsLabel} format
            </TippyTooltip.Complex>
          }
          position="top"
          bodyOverflow
        >
          <Box px={16} pb={4}>
            <NavigationSidebar.Item onClick={onImportClick} icon="importCircle" title="Import" />
            {!importClicked && <S.StatusBubble />}
          </Box>
        </TippyTooltip>
      )}

      <Box px={16} pb={12}>
        <NavigationSidebar.Item
          icon="uploadCircle"
          title="Export"
          onClick={() => openExportModelModal({ checkedItems: Array.from(nluManager.selectedIntentIDs) })}
        />
      </Box>

      <NavigationSidebar.Footer onClick={goToCurrentCanvas}>
        <SvgIcon icon="arrowDown" size={18} color="#6e849a" inline style={{ marginRight: '10px' }} />
        Go to Designer
      </NavigationSidebar.Footer>
    </NavigationSidebar>
  );
};

export default NLUNavigationSidebar;
