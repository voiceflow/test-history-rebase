import { datadogRum } from '@datadog/browser-rum';
import { BaseVersion } from '@voiceflow/base-types';
import { Box, LoadCircle, System, toast } from '@voiceflow/ui';
import ObjectID from 'bson-objectid';
import React from 'react';

import client from '@/client';
import * as Settings from '@/components/Settings';
import * as Errors from '@/config/errors';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useHotkey, usePermission, useSetup, useTrackingEvents } from '@/hooks';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import { usePaymentModal } from '@/ModalsV2/hooks';
import { FadeLeftContainer } from '@/styles/animations';

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
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const [hasFullVersionPermissions] = usePermission(Permission.PROJECT_FULL_VERSIONS);
  const [trackingEvents] = useTrackingEvents();
  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSave);

  const liveVersion = useSelector(ProjectV2.active.liveVersionSelector);

  const paymentModal = usePaymentModal();

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

  React.useEffect(() => {
    if (noMoreVersions) return;
    fetchVersions();
  }, [noMoreVersions]);

  const fetchVersions = async () => {
    await fetchBackupsV2();
  };

  const reFetchAllVersions = async () => {
    resetState();
  };

  const swapVersions = async (versionID: string) => {
    if (!projectID) {
      datadogRum.addError(Errors.noActiveProjectID());
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

    const offset = versionList.length;

    if (noMoreVersions) {
      setLoading(false);
      return;
    }

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
  });

  useHotkey(Hotkey.OPEN_MANUAL_SAVE_MODAL, openManualSaveModal, { preventDefault: true, disable: !canEditCanvas });

  return (
    <Settings.Section>
      <Settings.Card>
        <Heading>
          <>
            {PLATFORM_VERSION_HEADER_TEXT(platform)} To manually save a version, use the shortcut{' '}
            <HotKeyContainer>Shift + {getHotkeyLabel(Hotkey.SAVE_VERSION)}</HotKeyContainer>.{' '}
            {!hasFullVersionPermissions && (
              <>
                Free users can only view 30 days of an assistant's version history.{' '}
                <System.Link.Button onClick={() => paymentModal.openVoid({})}>Upgrade to unlock unlimited version history</System.Link.Button>
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
