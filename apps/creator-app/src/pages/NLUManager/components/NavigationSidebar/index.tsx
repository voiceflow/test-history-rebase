import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, SvgIcon, TippyTooltip, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import NavigationSidebar from '@/components/NavigationSidebar';
import { NLURoute } from '@/config/routes';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useActiveProjectNLUConfig, useDispatch, useFeature, useNLUImport, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import * as S from './styles';

const NLUNavigationSidebar: React.FC = () => {
  const nluConfig = useActiveProjectNLUConfig();

  const [importClicked, setImportClicked] = useLocalStorageState('import-clicked', false);

  const nluManager = React.useContext(NLUManagerContext);
  const nluImportModal = ModalsV2.useModal(ModalsV2.NLU.Import);
  const nluExportModal = ModalsV2.useModal(ModalsV2.NLU.Export);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);

  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const nluImport = useNLUImport({ nluType: nluConfig.type, platform });

  const onImportClick = () => {
    nluImportModal.openVoid({ importType: ModalsV2.NLU.ImportType.INTENT });
    setImportClicked(true);
  };

  return (
    <NavigationSidebar>
      <NavigationSidebar.ItemsContainer>
        <NavigationSidebar.Item
          icon="intent"
          title="Intents"
          onClick={() => nluManager.goToTab(NLURoute.INTENTS)}
          isActive={nluManager.activeTab === NLURoute.INTENTS}
          clickable
        >
          {({ isActive }) =>
            isActive ? (
              <NavigationSidebar.Item.AddButton tooltip={{ content: 'Create intent' }} onClick={() => nluManager.createIntent()} />
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
          clickable
        >
          {({ isActive }) =>
            isActive ? (
              <NavigationSidebar.Item.AddButton tooltip={{ content: 'Create entity' }} onClick={() => nluManager.createEntity()} />
            ) : (
              <NavigationSidebar.Item.SubText>{nluManager.entities.length}</NavigationSidebar.Item.SubText>
            )
          }
        </NavigationSidebar.Item>
      </NavigationSidebar.ItemsContainer>
      <Box pb={12} px={16}>
        {!!nluConfig.nlps[0].import && (
          <TippyTooltip
            width={232}
            placement="top"
            interactive
            content={
              <>
                <TippyTooltip.Complex title={<S.ImportTooltipTitle>{nluConfig.name} import</S.ImportTooltipTitle>}>
                  Imports must be in {nluImport.acceptedFileFormatsLabel} format
                </TippyTooltip.Complex>

                {!!nluConfig.helpURL && (
                  <TippyTooltip.FooterButton onClick={onOpenURLInANewTabFactory(nluConfig.helpURL)} buttonText="More"></TippyTooltip.FooterButton>
                )}
              </>
            }
          >
            <div>
              <NavigationSidebar.Item onClick={onImportClick} icon="importCircle" title="Import" />
              {!importClicked && <S.StatusBubble />}
            </div>
          </TippyTooltip>
        )}
        {!hideExports.isEnabled && (
          <NavigationSidebar.Item
            icon="uploadCircle"
            title="Export"
            onClick={() => nluExportModal.openVoid({ checkedItems: Array.from(nluManager.selectedIntentIDs) })}
            clickable
          />
        )}
      </Box>

      <NavigationSidebar.Footer onClick={goToCurrentCanvas}>
        <SvgIcon icon="arrowDown" size={18} color="#6e849a" inline style={{ marginRight: '10px' }} />
        Go to Designer
      </NavigationSidebar.Footer>
    </NavigationSidebar>
  );
};

export default NLUNavigationSidebar;
