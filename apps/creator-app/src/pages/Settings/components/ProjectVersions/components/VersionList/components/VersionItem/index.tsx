import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Menu, SvgIcon, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';
import { generatePath } from 'react-router-dom';

import OverflowMenu from '@/components/OverflowMenu';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { Path } from '@/config/routes';
import { VersionTag } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useActiveProjectPlatformConfig, useFeature, useSelector, useTrackingEvents } from '@/hooks';
import { useConfirmModal } from '@/hooks/modal.hook';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions/hooks';
import THEME from '@/styles/theme';
import { createPlatformSelector } from '@/utils/platform';
import { downloadVF } from '@/utils/vf';
import { onOpenInternalURLInANewTabFactory, openURLInANewTab } from '@/utils/window';

import * as S from './styles';

const RESTORE_VERSION_MESSAGE = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.GOOGLE]: 'This action will not change your Google Actions endpoint.',
  },
  ''
);

interface VersionItemProps {
  tag: VersionTag;
  version: ProjectVersion;
  creatorID: number;
  swapVersions: (versionID: string) => Promise<void>;
  restoreEnabled: boolean;
}

const VersionItem: React.FC<VersionItemProps> = ({ version, restoreEnabled, swapVersions, creatorID, tag }) => {
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });
  const platform = useSelector(ProjectV2.active.platformSelector);
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);
  const realtimeProjectExport = useFeature(Realtime.FeatureFlag.REALTIME_PROJECT_EXPORT);

  const confirmModal = useConfirmModal();
  const platformConfig = useActiveProjectPlatformConfig();

  const [trackingEvents] = useTrackingEvents();

  const { manualSave, autoSaveFromRestore } = version;
  const isLive = tag === VersionTag.PRODUCTION;

  const getName = () => {
    if (autoSaveFromRestore) return 'Automatic from restore';
    if (manualSave) return version.name || 'Automatic';

    return 'Automatic';
  };

  const getColor = () => (manualSave && version.name !== '' ? 'black' : THEME.colors[ThemeColor.SECONDARY]);

  const getStatusText = () => {
    if (!isLive) return 'Draft';

    return platformConfig.withThirdPartyUpload ? 'Uploaded' : 'Production';
  };

  const getTooltipText = () => {
    if (isLive) {
      return platformConfig.withThirdPartyUpload
        ? `This is the most recent version uploaded to ${platformConfig.name}.`
        : 'This version is live and actively being referenced by the Dialog API';
    }

    return platformConfig.withThirdPartyUpload ? 'This is an inactive version' : 'This version is not live';
  };

  const confirmRestore = () => {
    confirmModal.open({
      header: 'Restore version',

      confirmButtonText: (
        <Box.Flex gap={12}>
          <SvgIcon icon="arrowSpin" />

          <span>Restore</span>
        </Box.Flex>
      ),

      body: (
        <>
          When you restore a version, we'll create a new automatic version of the current designer state. Please confirm you want to continue.
          <br />
          {RESTORE_VERSION_MESSAGE(platform)}
        </>
      ),

      confirm: async () => {
        await swapVersions(version.versionID);

        trackingEvents.trackProjectRestore({ versionID: version.versionID });
      },
    });
  };

  const downloadVersion = () => downloadVF({ name: version.name, versionID: version.versionID, realtimeExport: realtimeProjectExport.isEnabled });

  const handlePreview = () => {
    openURLInANewTab(`${window.location.origin}${generatePath(Path.PROJECT_DOMAIN, { versionID: version.versionID })}`);

    trackingEvents.trackVersionPreview({ versionID: version.versionID });
  };

  return (
    <S.RowItem>
      <S.ColumnItemContainer>
        <TippyTooltip content={dayjs(version.created).format('MMM DD, YYYY, h:mm A')}>{dayjs(version.created).fromNow()}</TippyTooltip>
      </S.ColumnItemContainer>

      <S.ColumnItemContainer style={{ color: getColor() }}>
        <TippyTooltip content={getName()} disabled={!manualSave}>
          {getName()}
        </TippyTooltip>
      </S.ColumnItemContainer>

      <S.ColumnItemContainer>{member?.name ?? 'Unknown'}</S.ColumnItemContainer>

      <TippyTooltip
        width={232}
        position="top"
        interactive={true}
        content={
          !platformConfig.withThirdPartyUpload && isLive ? (
            <TippyTooltip.FooterButton buttonText="More" onClick={onOpenInternalURLInANewTabFactory(DIALOG_MANAGER_API)}>
              <div>{getTooltipText()}</div>
            </TippyTooltip.FooterButton>
          ) : (
            <div>{getTooltipText()}</div>
          )
        }
      >
        <S.StatusIndicatorContainer>
          <S.StatusIndicator size={12} isLive={isLive} />

          {getStatusText()}
        </S.StatusIndicatorContainer>
      </TippyTooltip>

      <S.ActionsItemContainer>
        <OverflowMenu
          placement="bottom-end"
          disabled={!restoreEnabled}
          menu={
            <Menu
              width={120}
              options={[
                { label: 'Preview', onClick: handlePreview },
                { label: '', divider: true },
                hideExports.isEnabled ? null : { label: 'Download', onClick: downloadVersion },
                { label: 'Restore', onClick: confirmRestore },
              ]}
            />
          }
        />
      </S.ActionsItemContainer>
    </S.RowItem>
  );
};

export default VersionItem;
