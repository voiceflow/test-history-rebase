import { Constants } from '@voiceflow/general-types';
import { Box, Button, ButtonVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';
import { Tooltip } from 'react-tippy';

import { ConfirmProps } from '@/components/ConfirmModal';
import { ModalType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, useSelector } from '@/hooks';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions';
import { createPlatformSelector } from '@/utils/platform';

import { ActionsItemContainer, ColumnItemContainer, RowItem } from './components';

const RESTORE_VERSION_MESSAGE = createPlatformSelector(
  {
    [Constants.PlatformType.GOOGLE]: 'This action will not change your Google Actions endpoint.',
  },
  ''
);

interface Index {
  version: ProjectVersion;
  swapVersions: (versionID: string) => void;
  creatorID: number;
}

const VersionItem: React.FC<Index> = ({ version, swapVersions, creatorID }) => {
  const { open: openConfirmModal } = useModals<ConfirmProps>(ModalType.CONFIRM);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const memberByID = useSelector(WorkspaceV2.active.getMemberByIDSelector);
  const member = React.useMemo(() => memberByID(creatorID), [creatorID]);
  const { manualSave, autoSaveFromRestore } = version;
  const name = React.useMemo(() => {
    if (autoSaveFromRestore) return 'Automatic from Restore';
    if (manualSave) return version.name;
    return 'Automatic';
  }, [manualSave, autoSaveFromRestore]);

  const NameWrapper = manualSave ? TippyTooltip : React.Fragment;

  const confirmRestore = (versionID: string) => {
    openConfirmModal({
      header: 'Restore Version',
      canCancel: true,
      confirmButtonText: 'Restore',
      body: (
        <span>
          <b>This action can't be undone.</b> If you restore a backup, we'll create a new backup of the current version.{' '}
          {RESTORE_VERSION_MESSAGE(platform)}
        </span>
      ),
      confirm: () => swapVersions(versionID),
    });
  };

  const handlePreview = () => {
    alert('Loading Preview!');
  };

  return (
    <RowItem>
      <ColumnItemContainer>{dayjs(version.created).fromNow()}</ColumnItemContainer>
      <ColumnItemContainer style={{ color: manualSave && !autoSaveFromRestore ? 'black' : '#62778c' }}>
        <NameWrapper title={name}>{name}</NameWrapper>
      </ColumnItemContainer>
      <ColumnItemContainer>{member?.name}</ColumnItemContainer>
      <ActionsItemContainer>
        <Box display="inline-block">
          <Tooltip title="Restore Version">
            <Button squareRadius variant={ButtonVariant.PRIMARY} onClick={() => confirmRestore(version.versionID)}>
              <SvgIcon icon="publishSpin" size={20} />
            </Button>
          </Tooltip>
        </Box>
        <Box display="inline-block" mr={12}>
          <Button flat variant={ButtonVariant.SECONDARY} onClick={handlePreview}>
            Preview
          </Button>
        </Box>
      </ActionsItemContainer>
    </RowItem>
  );
};

export default VersionItem;
