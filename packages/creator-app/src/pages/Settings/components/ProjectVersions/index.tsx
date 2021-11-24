import { Models } from '@voiceflow/base-types';
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
import { useFeature, useHotKeys, useModals, usePermission, useSetup, useTrackingEvents } from '@/hooks';
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
  autoSaveFromRestore?: boolean;
  created: string;
}

const FREE_PLAN_RETRIEVAL_LIMIT_IN_DAYS = 30;

const DEFAULT_FETCH_LIMIT = 10;

const versionListAdapter = (version: Models.Version<Models.VersionPlatformData> & { manualSave?: boolean; autoSaveFromRestore?: boolean }) => ({
  creatorID: version.creatorID,
  versionID: version._id,
  manualSave: version.manualSave,
  autoSaveFromRestore: version.autoSaveFromRestore,
  name: version.name,
  created: ObjectID.isValid(version._id) ? new ObjectID(version._id).getTimestamp().toString() : '',
});

const ProjectVersions: React.FC<ConnectedProjectVersions> = ({ projectID, activeVersionID, setConfirm, goToCanvas, platform }) => {
  const [loading, setLoading] = React.useState(true);
  const [noMoreVersions, setNoMoreVersions] = React.useState(false);
  const [versionListV2, setVersionListV2] = React.useState<ProjectVersion[]>([]);
  const [versions, setVersions] = React.useState<ProjectVersion[]>([]);
  const { name } = getSettingsMetaProps(platform);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const projectVersionsEnabled = useFeature(FeatureFlag.PROJECT_VERSIONS)?.isEnabled;
  const [hasFullVersionPermissions] = usePermission(Permission.FULL_PROJECT_VERSIONS);
  const [trackingEvents] = useTrackingEvents();
  const manualSaveModal = useModals(ModalType.MANUAL_SAVE_MODAL);

  const upgradeModal = useModals(ModalType.PAYMENT);
  const onClickUpgrade = useCallback(() => upgradeModal.open(), [upgradeModal]);

  const openManualSaveModal = () => {
    manualSaveModal.open({
      reFetchVersions: reFetchAllVersions,
    });
  };

  const resetState = () => {
    setNoMoreVersions(false);
    setVersionListV2([]);
    setVersions([]);
    setLoading(true);
  };

  const fetchVersions = async () => {
    await (projectVersionsEnabled ? fetchBackupsV2() : fetchBackups());
  };

  const reFetchAllVersions = async () => {
    resetState();
    await fetchVersions();
    setLoading(false);
  };

  const swapVersions = async (versionID: string) => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
      if (projectVersionsEnabled) {
        // Don't await snapshot (Creates another version)
        client.version.getVersionSnapshot(activeVersionID!, '', { manualSave: false, autoSaveFromRestore: true });
      }
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
      confirm: async () => {
        await swapVersions(versionID);
      },
    });
  };

  const fetchBackupsV2 = React.useCallback(async () => {
    if (noMoreVersions) return;
    const offset = versionListV2.length;

    if (offset > FREE_PLAN_RETRIEVAL_LIMIT_IN_DAYS) {
      toast.error('Upgrade workspace plan to access older versions.');
      return;
    }
    let limit = DEFAULT_FETCH_LIMIT;
    if (offset + limit > FREE_PLAN_RETRIEVAL_LIMIT_IN_DAYS) {
      limit = FREE_PLAN_RETRIEVAL_LIMIT_IN_DAYS - offset;
    }

    try {
      const moreVersions = (await client.api.project.getVersionsV2(projectID!, { offset, limit })) || [];
      if (moreVersions.length < limit) {
        setNoMoreVersions(true);
      }
      setVersionListV2([
        ...versionListV2,
        ...moreVersions
          .filter(({ _id }) => _id !== activeVersionID)
          .map((version: Models.Version<Models.VersionPlatformData> & { manualSave?: boolean }) => versionListAdapter(version)),
      ]);
    } catch (err) {
      toast.error('Error fetching versions');
    } finally {
      setLoading(false);
    }
  }, [noMoreVersions, versionListV2]);

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
        // eslint-disable-next-line sonarjs/no-identical-functions
        dbVersions.map((version: Models.Version<Models.VersionPlatformData> & { manualSave?: boolean }) => ({
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
    fetchVersions();
  });

  useHotKeys(Hotkey.OPEN_MANUAL_SAVE_MODAL, openManualSaveModal, { preventDefault: true, disable: !canEditCanvas }, [manualSaveModal.open]);

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
              <VersionList versions={versionListV2} swapVersions={swapVersions} fetchVersions={fetchBackupsV2} />
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
                            <SvgIcon size={12} icon={platform === Constants.PlatformType.GOOGLE ? 'google' : 'amazon'} />
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
