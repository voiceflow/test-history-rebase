import * as Platform from '@voiceflow/platform-config';
import { Box, Menu, SvgIcon, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { ConfirmProps } from '@/components/ConfirmModal';
import { StatusIndicator } from '@/components/Indicator';
import OverflowMenu from '@/components/OverflowMenu';
import { DIALOG_MANAGER_API } from '@/config/documentation';
import { Path } from '@/config/routes';
import { ModalType } from '@/constants';
import { VersionTag } from '@/constants/platforms';
import * as ProjectV2 from '@/ducks/projectV2';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useModals, useSelector, useTrackingEvents } from '@/hooks';
import { QUERY_PARAMS } from '@/pages/Project/constants';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions';
import THEME from '@/styles/theme';
import { createPlatformSelector } from '@/utils/platform';
import { isPlatformWithThirdPartyUpload } from '@/utils/typeGuards';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import {
  ActionsItemContainer,
  bgGradientMap as indicatorbgGradientMap,
  borderColorMap as indicatorBorderColorMap,
  ColumnItemContainer,
  PublishIndicatorVariant,
  RowItem,
  StatusIndicatorContainer,
} from './components';

const RESTORE_VERSION_MESSAGE = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.GOOGLE]: 'This action will not change your Google Actions endpoint.',
  },
  ''
);

interface Index {
  version: ProjectVersion;
  swapVersions: (versionID: string) => Promise<void>;
  restoreEnabled: boolean;
  creatorID: number;
  tag: VersionTag;
}

const VersionItem: React.OldFC<Index> = ({ version, restoreEnabled, swapVersions, creatorID, tag }) => {
  const confirmModal = useModals<ConfirmProps>(ModalType.CONFIRM);

  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });
  const platform = useSelector(ProjectV2.active.platformSelector);

  const [trackingEvents] = useTrackingEvents();

  const { manualSave, autoSaveFromRestore } = version;

  const name = React.useMemo(() => {
    if (autoSaveFromRestore) return 'Automatic from restore';
    if (manualSave) return version.name || 'Automatic';
    return 'Automatic';
  }, [manualSave, autoSaveFromRestore]);

  const color = React.useMemo(
    () => (manualSave && version.name !== '' ? 'black' : THEME.colors[ThemeColor.SECONDARY]),
    [manualSave, autoSaveFromRestore]
  );

  const isLive = tag === VersionTag.PRODUCTION;

  const statusText = React.useMemo(() => {
    if (isLive) {
      return isPlatformWithThirdPartyUpload(platform) ? 'Uploaded' : 'Production';
    }
    return 'Draft';
  }, [isLive, platform]);

  const tooltipText = React.useMemo(() => {
    if (isLive) {
      return isPlatformWithThirdPartyUpload(platform)
        ? `This is the most recent version uploaded to ${Platform.Config.get(platform).name}.`
        : 'This version is live and actively being referenced by the Dialog API';
    }
    return isPlatformWithThirdPartyUpload(platform) ? 'This is an inactive version' : 'This version is not live';
  }, [isLive, platform]);

  const confirmRestore = (versionID: string) => {
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
        await swapVersions(versionID);
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
        <TippyTooltip content={dayjs(version.created).format('MMM Do, YYYY, h:mm A')}>{dayjs(version.created).fromNow()}</TippyTooltip>
      </ColumnItemContainer>
      <ColumnItemContainer style={{ color }}>
        <TippyTooltip content={name} disabled={!manualSave}>
          {name}
        </TippyTooltip>
      </ColumnItemContainer>
      <ColumnItemContainer>{member?.name}</ColumnItemContainer>
      <TippyTooltip
        width={232}
        position="top"
        interactive={true}
        content={
          !isPlatformWithThirdPartyUpload(platform) && isLive ? (
            <TippyTooltip.FooterButton buttonText="More" onClick={onOpenInternalURLInANewTabFactory(DIALOG_MANAGER_API)}>
              <div>{tooltipText}</div>
            </TippyTooltip.FooterButton>
          ) : (
            <div>{tooltipText}</div>
          )
        }
      >
        <StatusIndicatorContainer>
          <StatusIndicator
            variant={isLive ? PublishIndicatorVariant.PRODUCTION : PublishIndicatorVariant.DEVELOPMENT}
            size={12}
            borderColorMap={indicatorBorderColorMap}
            bgGradientMap={indicatorbgGradientMap}
          />
          {statusText}
        </StatusIndicatorContainer>
      </TippyTooltip>
      <ActionsItemContainer>
        <OverflowMenu
          placement="bottom-end"
          disabled={!restoreEnabled}
          style={{ flat: true }}
          menu={
            <Menu
              width={103}
              options={[
                {
                  label: 'Preview',
                  onClick: handlePreview,
                },
                {
                  label: '',
                  divider: true,
                },
                {
                  label: 'Restore',
                  onClick: () => confirmRestore(version.versionID),
                },
              ]}
            />
          }
        />
      </ActionsItemContainer>
    </RowItem>
  );
};

export default VersionItem;
