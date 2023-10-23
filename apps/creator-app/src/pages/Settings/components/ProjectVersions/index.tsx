import { datadogRum } from '@datadog/browser-rum';
import { BaseVersion } from '@voiceflow/base-types';
import { Animations, Box, LoadCircle, System, toast } from '@voiceflow/ui';
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

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [hasFullVersionPermissions] = usePermission(Permission.PROJECT_FULL_VERSIONS);

  const [versionList, setVersionList] = React.useState<ProjectVersion[]>([]);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [noMoreVersions, setNoMoreVersions] = React.useState(false);
  const [initialFetching, setInitialFetching] = React.useState(true);

  const [trackingEvents] = useTrackingEvents();
  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSave);

  const liveVersion = useSelector(ProjectV2.active.liveVersionSelector);

  const paymentModal = usePaymentModal();

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

  const fetchVersions = async (offset: number) => {
    try {
      const nextVersions = await client.api.project.getVersionsV2<BaseVersion.PlatformData>(projectID!, { offset, limit: DEFAULT_FETCH_LIMIT });

      setVersionList((prevList) => [...prevList, ...nextVersions.map((version) => versionAdapter(version))]);

      if (!nextVersions || nextVersions.length < DEFAULT_FETCH_LIMIT) {
        setNoMoreVersions(true);
      }
    } catch (err) {
      toast.error('Error fetching versions');
    }
  };

  const onLoadMore = async () => {
    if (noMoreVersions || loadingMore) return;

    setLoadingMore(true);

    await fetchVersions(versionList.length);

    setLoadingMore(false);
  };

  const fetchInitialVersions = async () => {
    await fetchVersions(0);

    setInitialFetching(false);
  };

  const resetState = () => {
    setVersionList([]);
    setNoMoreVersions(false);
    setInitialFetching(true);

    fetchInitialVersions();
  };

  const openManualSaveModal = () => {
    manualSaveModal.openVoid({ reFetchVersions: resetState });
  };

  useSetup(async () => {
    trackingEvents.trackActiveProjectVersionPage();

    fetchInitialVersions();
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

        {initialFetching ? (
          <Box.FlexCenter minHeight={320}>
            <LoadCircle />
          </Box.FlexCenter>
        ) : (
          <Animations.FadeLeft>
            <VersionList
              versions={versionList}
              onLoadMore={onLoadMore}
              liveVersion={liveVersion}
              loadingMore={loadingMore}
              swapVersions={swapVersions}
              noMoveVersions={noMoreVersions}
              activeVersionID={activeVersionID}
            />
          </Animations.FadeLeft>
        )}
      </Settings.Card>
    </Settings.Section>
  );
};

export default ProjectVersions;
