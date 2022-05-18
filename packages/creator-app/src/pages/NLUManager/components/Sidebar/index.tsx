import { Box, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { InteractionModelTabType } from '@/constants';
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

import { Footer, ItemSidebar, SidebarContainer } from './components';
import MenuItem from './components/MenuItem';

const Sidebar: React.FC = () => {
  const { createAndSelect, setActiveTab, activeTab } = React.useContext(NLUManagerContext);

  const platform = useSelector(ProjectV2.active.platformSelector);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);
  const versionID = useSelector(Session.activeVersionIDSelector)!;

  const refreshSlots = useDispatch(Slot.refreshSlots);
  const refreshIntents = useDispatch(Intent.refreshIntents);

  const hasImport = platform && PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType]?.importMeta;
  const fileExtensions = platform && PLATFORM_PROJECT_META_MAP[platform as SupportedPlatformProjectType]?.importMeta?.fileExtensions;

  const onImportModel = async (importedModel: ImportModel) => {
    const data = await client.version.patchMergeIntentsAndSlots(versionID, importedModel);
    if (data) {
      await Promise.all([refreshSlots(), refreshIntents()]);
    }
  };

  const { onUploadClick, acceptedFileFormatsLabel } = useNLUImport({ fileExtensions, platform, onImportModel });

  return (
    <SidebarContainer>
      <ItemSidebar>
        <MenuItem
          onClick={() => setActiveTab(InteractionModelTabType.INTENTS)}
          isActive={activeTab === InteractionModelTabType.INTENTS}
          icon="intent"
          title="Intent"
          createPlaceholder="intent"
          onAdd={createAndSelect}
        />
        <MenuItem
          onClick={() => setActiveTab(InteractionModelTabType.SLOTS)}
          isActive={activeTab === InteractionModelTabType.SLOTS}
          icon="entities"
          title="Entities"
          createPlaceholder="entity"
          onAdd={createAndSelect}
        />
        <MenuItem
          onClick={() => setActiveTab(InteractionModelTabType.VARIABLES)}
          isActive={activeTab === InteractionModelTabType.VARIABLES}
          icon="variables"
          title="Variables"
          createPlaceholder="variable"
          onAdd={createAndSelect}
        />
      </ItemSidebar>
      <span>
        {hasImport && (
          <TippyTooltip
            {...{
              position: 'right-end',
              offset: -65,
              distance: -250,
              html: <TippyTooltip.Complex title={`${platform} import`}>Imports must be in {acceptedFileFormatsLabel} format</TippyTooltip.Complex>,
            }}
          >
            <Box p={16} pb={12}>
              <MenuItem onClick={onUploadClick} icon="downloadCircle" title="Import" />
            </Box>
          </TippyTooltip>
        )}
        <Footer onClick={goToCurrentCanvas}>
          <SvgIcon icon="arrowDown" size={18} color="#6e849a" inline style={{ marginRight: '10px', transform: 'rotate(90deg)' }} />
          Go to Designer
        </Footer>
      </span>
    </SidebarContainer>
  );
};

export default Sidebar;
