import { Version, VersionPlatformData } from '@voiceflow/api-sdk';
import { Constants } from '@voiceflow/general-types';
import { Box, BoxFlexCenter, ClickableText, LoadCircle, SvgIcon, toast } from '@voiceflow/ui';
import ObjectID from 'bson-objectid';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';

import { noIntentsGraphic } from '@/assets';
import client from '@/client';
import { SettingsSection } from '@/components/Settings';
import { TableContainer, TableHeader, TableRow } from '@/components/Table';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as Modal from '@/ducks/modal';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useFeature, useModals, usePermission, useSetup, useTrackingEvents } from '@/hooks';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import { DEFAULT_MAX_WIDTH, getSettingsMetaProps } from '@/pages/Settings/constants';
import { FadeLeftContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

import { Heading, HotKeyContainer } from './components';
import VersionList from './components/VersionList';
import { PLATFORM_VERSION_HEADER_TEXT } from './constants';

// Need to move this to general types
export interface ProjectVersion {
  versionID: string;
  creatorID: number;
  name?: string;
  manualSave?: boolean;
  created: string;
  platform: Constants.PlatformType;
}

const ProjectVersions: React.FC<ConnectedProjectVersions> = ({ projectID, activeVersionID, setConfirm, goToCanvas, platform }) => {
  const [loading, setLoading] = React.useState(true);
  const [versions, setVersions] = React.useState<ProjectVersion[]>([]);
  const { name } = getSettingsMetaProps(platform);
  const projectVersionsEnabled = useFeature(FeatureFlag.PROJECT_VERSIONS)?.isEnabled;
  const [hasFullVersionPermissions] = usePermission(Permission.FULL_PROJECT_VERSIONS);
  const [trackingEvents] = useTrackingEvents();

  const upgradeModal = useModals(ModalType.PAYMENT);

  const onClickUpgrade = useCallback(() => upgradeModal.open(), [upgradeModal]);

  const swapVersions = async (versionID: string) => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
      await client.backup.restore(projectID, versionID);
      goToCanvas(versionID);
      toast.success('Successfully restored version');
    } catch (err) {
      toast.error('Unable to restore version');
    }
  };

  const confirmRestore = (versionID: string) => {
    setConfirm({
      warning: true,
      text: "This action can not be undone, will delete all your current work since your last backup, and will not change your skill's Amazon endpoint.",
      confirm: () => swapVersions(versionID),
    });
  };

  const fetchBackups = React.useCallback(async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
      // legacy backup system, requires design and refactor
      const dbVersions = (await client.api.project.getVersions(projectID)).filter(
        (version) => (version.platformData as any).status?.stage !== 'LIVE'
      );
      setVersions(
        dbVersions.map((version: Version<VersionPlatformData> & { manualSave?: boolean }) => ({
          creatorID: version.creatorID,
          versionID: version._id,
          platform,
          manualSave: version.manualSave,
          name: version.name,
          created: ObjectID.isValid(version._id) ? new ObjectID(version._id).getTimestamp().toString() : '',
        }))
      );
    } catch (err) {
      toast.error('Unable to Fetch Backup Versions');
    } finally {
      setLoading(false);
    }
  }, []);

  useSetup(() => {
    trackingEvents.trackActiveProjectVersionPage();
    fetchBackups();
  });

  return (
    <Box maxWidth={projectVersionsEnabled ? 900 : DEFAULT_MAX_WIDTH}>
      <SettingsSection title="All Versions" noContentPadding={!!projectVersionsEnabled}>
        <Heading>
          {projectVersionsEnabled ? (
            <>
              {PLATFORM_VERSION_HEADER_TEXT(platform)} To manually save a version, use the shortcut{' '}
              <HotKeyContainer>Shift + {getHotkeyLabel(Hotkey.SAVE_VERSION)}</HotKeyContainer>.{' '}
              {!hasFullVersionPermissions && (
                <>
                  Free users can only view 30 days of a project's version history.{' '}
                  <ClickableText onClick={onClickUpgrade}>Upgrade to unlock unlimited version history</ClickableText>
                </>
              )}
            </>
          ) : (
            <>New versions are created every time your project is uploaded to {name}.</>
          )}
        </Heading>
        {loading ? (
          <BoxFlexCenter minHeight={320}>
            <LoadCircle />
          </BoxFlexCenter>
        ) : (
          <FadeLeftContainer>
            {projectVersionsEnabled ? (
              // Project Versions V2
              <VersionList versions={versions} swapVersions={swapVersions} />
            ) : (
              <>
                {versions.length ? (
                  <TableContainer topBorder columns={[3, 8, 2]} minHeight={320}>
                    <TableHeader>
                      <span>Date</span>
                      <span>Name</span>
                      <span>Version</span>
                    </TableHeader>
                    {versions.map((version, index) => (
                      <TableRow key={index}>
                        <span>{dayjs(version.created).fromNow()}</span>
                        <span style={{ color: '#62778c' }}>
                          <Box display="inline-block" mr={6} mb={-1}>
                            <SvgIcon size={12} icon={version.platform === Constants.PlatformType.GOOGLE ? 'google' : 'amazon'} />
                          </Box>
                          Automatic
                        </span>
                        <span>
                          {version.versionID === activeVersionID ? (
                            'Current'
                          ) : (
                            <ClickableText onClick={() => confirmRestore(version.versionID)}>Restore</ClickableText>
                          )}
                        </span>
                      </TableRow>
                    ))}
                  </TableContainer>
                ) : (
                  <BoxFlexCenter minHeight={320}>
                    <Box textAlign="center">
                      <img src={noIntentsGraphic} height={64} alt="no intents" />
                      <Box mt={10}>No versions exist</Box>
                    </Box>
                  </BoxFlexCenter>
                )}
              </>
            )}
          </FadeLeftContainer>
        )}
      </SettingsSection>
    </Box>
  );
};

const mapStateToProps = {
  activeVersionID: Session.activeVersionIDSelector,
  projectID: Session.activeProjectIDSelector,
  platform: ProjectV2.active.platformSelector,
};

const mapDispatchToProps = {
  setConfirm: Modal.setConfirm,
  goToCanvas: Router.goToCanvas,
};

export type ConnectedProjectVersions = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectVersions);
