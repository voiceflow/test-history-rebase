import { Box, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDispatch, useSelector } from '@/hooks';
import { getPlatformOrProjectTypeMeta } from '@/pages/NewProjectV2/constants';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { upload } from '@/utils/dom';

import { Footer, ItemSidebar, SidebarContainer } from './components';
import MenuItem from './components/MenuItem';

const Sidebar: React.FC = () => {
  const { createAndSelect, setActiveTab, activeTab } = React.useContext(NLUManagerContext);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const goToCurrentCanvas = useDispatch(Router.goToCurrentCanvas);

  const canImportModel = true;

  const onImport = async () => {
    // TODO: import endpoint
  };

  const handleImport = () => {
    const fileExtensions = platform && getPlatformOrProjectTypeMeta[platform]?.importMeta?.fileExtensions;
    const acceptedFileFormats = fileExtensions?.join(',');

    upload(onImport, { accept: acceptedFileFormats, multiple: false });
  };

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
        {canImportModel && (
          <TippyTooltip
            {...{
              position: 'right-end',
              offset: -65,
              distance: -250,
              html: <TippyTooltip.Complex title="XYZ Import">Imports must be in ABC format</TippyTooltip.Complex>,
            }}
          >
            <Box p={16} pb={12}>
              <MenuItem onClick={handleImport} icon="downloadCircle" title="Import" />
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
