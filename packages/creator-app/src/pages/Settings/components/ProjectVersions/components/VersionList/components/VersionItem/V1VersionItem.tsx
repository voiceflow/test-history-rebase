import { Box, Button, ButtonVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import dayjs from 'dayjs';
import React from 'react';
import { generatePath } from 'react-router-dom';
import { Tooltip } from 'react-tippy';

import { ConfirmProps } from '@/components/ConfirmModal';
import { Path } from '@/config/routes';
import { ModalType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, useSelector, useTrackingEvents } from '@/hooks';
import { QUERY_PARAMS } from '@/pages/Project/constants';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions';
import { createPlatformSelector } from '@/utils/platform';

import { ActionsItemContainerV1, ColumnItemContainer, RowItem } from './components';

const RESTORE_VERSION_MESSAGE = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.GOOGLE]: 'This action will not change your Google Actions endpoint.',
  },
  ''
);

interface Index {
  version: ProjectVersion;
  swapVersions: (versionID: string) => void;
  creatorID: number;
  restoreEnabled: boolean;
}

// TODO - Remove this when `FeatureFlag.PRODUCTION_VERSION_MANAGEMENT` is removed
const VersionItem: React.FC<Index> = ({ version, restoreEnabled, swapVersions, creatorID }) => {
  const confirmModal = useModals<ConfirmProps>(ModalType.CONFIRM);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });
  const [trackingEvents] = useTrackingEvents();
  const { manualSave, autoSaveFromRestore } = version;
  const name = React.useMemo(() => {
    if (autoSaveFromRestore) return 'Automatic from Restore';
    if (manualSave) return version.name;
    return 'Automatic';
  }, [manualSave, autoSaveFromRestore]);

  const confirmRestore = (versionID: string) => {
    confirmModal.open({
      body: (
        <>
          <b>This action can't be undone.</b> If you restore a backup, we'll create a new backup of the current version.{' '}
          {RESTORE_VERSION_MESSAGE(platform)}
        </>
      ),
      header: 'Restore Version',
      confirmButtonText: 'Restore',

      confirm: () => {
        swapVersions(versionID);

        trackingEvents.trackProjectRestore({ versionID });
      },
    });
  };

  const handlePreview = () => {
    window.open(`${generatePath(Path.PROJECT_DOMAIN, { versionID: version.versionID })}?${QUERY_PARAMS.PREVIEWING}=true`, '_blank')?.focus();

    trackingEvents.trackVersionPreview({ versionID: version.versionID });
  };

  return (
    <RowItem>
      <ColumnItemContainer>
        <Tooltip title={dayjs(version.created).format('MMM Do, YYYY, h:mm A')}>{dayjs(version.created).fromNow()}</Tooltip>
      </ColumnItemContainer>
      <ColumnItemContainer style={{ color: manualSave && !autoSaveFromRestore ? 'black' : '#62778c' }}>
        <TippyTooltip disabled={!manualSave} title={name}>
          {name}
        </TippyTooltip>
      </ColumnItemContainer>
      <ColumnItemContainer>{member?.name}</ColumnItemContainer>
      <ActionsItemContainerV1>
        <Box display="inline-block">
          <Tooltip title="Restore Version">
            <Button disabled={!restoreEnabled} squareRadius variant={ButtonVariant.PRIMARY} onClick={() => confirmRestore(version.versionID)}>
              <SvgIcon icon="arrowSpin" size={20} />
            </Button>
          </Tooltip>
        </Box>
        <Box display="inline-block" mr={12}>
          <Button disabled={!restoreEnabled} flat variant={ButtonVariant.SECONDARY} onClick={handlePreview}>
            Preview
          </Button>
        </Box>
      </ActionsItemContainerV1>
    </RowItem>
  );
};

export default VersionItem;
