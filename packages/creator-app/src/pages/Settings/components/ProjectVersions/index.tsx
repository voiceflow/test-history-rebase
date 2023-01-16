import { BaseVersion } from '@voiceflow/base-types';
import { Box, ClickableText, LoadCircle, toast } from '@voiceflow/ui';
import ObjectID from 'bson-objectid';
import React, { useCallback } from 'react';

import client from '@/client';
import * as Settings from '@/components/Settings';
import * as Errors from '@/config/errors';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useHotKeys, useModals, usePermission, useSetup, useTrackingEvents } from '@/hooks';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { FadeLeftContainer } from '@/styles/animations';
import * as Sentry from '@/vendors/sentry';

import { Heading, HotKeyContainer } from './components';
import VersionList from './components/VersionList';
import { PLATFORM_VERSION_HEADER_TEXT } from './constants';

// TODO: Need to move this to general types
export interface ProjectVersion {
  name?: string;
  created: string;
  versionID: string;
  creatorID: number;
  manualSave: boolean;
  autoSaveFromRestore: boolean;
}

const DEFAULT_FETCH_LIMIT = 10;

type Version = Omit<BaseVersion.Version, 'nluUnclassifiedData'>;

const versionAdapter = (version: Version) => ({
  name: version.name,
  created: ObjectID.isValid(version._id) ? new ObjectID(version._id).getTimestamp().toString() : '',
  creatorID: version.creatorID,
  versionID: version._id,
  manualSave: version.manualSave,
  autoSaveFromRestore: version.autoSaveFromRestore,
});

const ProjectVersions: React.FC = () => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const goToDomain = useDispatch(Router.goToDomain);

  const [loading, setLoading] = React.useState(true);
  const [noMoreVersions, setNoMoreVersions] = React.useState(false);
  const [versionList, setVersionList] = React.useState<ProjectVersion[]>([]);
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);

  const [hasFullVersionPermissions] = usePermission(Permission.FULL_PROJECT_VERSIONS);
  const [trackingEvents] = useTrackingEvents();
  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSave);

  const liveVersion = useSelector(ProjectV2.active.liveVersionSelector);

  const upgradeModal = useModals(ModalType.PAYMENT);
  const onClickUpgrade = useCallback(() => upgradeModal.open(), [upgradeModal]);

  const openManualSaveModal = () => {
    manualSaveModal.openVoid({
      reFetchVersions: reFetchAllVersions,
    });
  };

  const resetState = () => {
    setNoMoreVersions(false);
    setVersionList([]);
    setLoading(true);
  };

  const fetchVersions = async () => {
    await fetchBackupsV2();
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
      const clonedVersion = await client.backup.restore(projectID, versionID);

      const { versionID: clonedVersionID } = versionAdapter(clonedVersion);

      goToDomain({ versionID: clonedVersionID });

      toast.success('Version successfully restored.');
    } catch (err) {
      toast.error('Unable to restore version');
    }
  };

  const fetchBackupsV2 = React.useCallback(async () => {
    const limit = DEFAULT_FETCH_LIMIT;
    if (noMoreVersions) return;
    const offset = versionList.length;
    try {
      const moreVersions = (await client.api.project.getVersionsV2<BaseVersion.PlatformData>(projectID!, { offset, limit })) || [];

      if (moreVersions.length < limit) {
        setNoMoreVersions(true);
      }

      setVersionList([...versionList, ...moreVersions.map((version) => versionAdapter(version))]);
    } catch (err) {
      toast.error('Error fetching versions');
    } finally {
      setLoading(false);
    }
  }, [noMoreVersions, versionList]);

  useSetup(() => {
    trackingEvents.trackActiveProjectVersionPage();
    fetchVersions();
  });

  useHotKeys(Hotkey.OPEN_MANUAL_SAVE_MODAL, openManualSaveModal, { preventDefault: true, disable: !canEditCanvas }, [manualSaveModal.open]);

  return (
    <Settings.Section>
      <Settings.Card>
        <Heading>
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
        </Heading>

        {loading ? (
          <Box.FlexCenter minHeight={320}>
            <LoadCircle />
          </Box.FlexCenter>
        ) : (
          <FadeLeftContainer>
            <VersionList
              versions={versionList}
              liveVersion={liveVersion}
              swapVersions={swapVersions}
              fetchVersions={fetchBackupsV2}
              activeVersionID={activeVersionID}
            />
          </FadeLeftContainer>
        )}
      </Settings.Card>
    </Settings.Section>
  );
};

export default ProjectVersions;
