import { datadogRum } from '@datadog/browser-rum';
import { Animations, Box, LoadCircle, SectionV2, System, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Settings from '@/components/Settings';
import * as Errors from '@/config/errors';
import { Permission } from '@/constants/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useHotkey, usePermission, useSetup, useTrackingEvents } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { useDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';

import { Heading, HotKeyContainer } from './components';
import VersionList from './components/VersionList';
import { PLATFORM_VERSION_HEADER_TEXT } from './constants';
import { useProjectVersions, versionAdapter } from './hooks';

const ProjectVersions: React.FC = () => {
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const projectID = useSelector(Session.activeProjectIDSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const goToDomain = useDispatch(Router.goToDomain);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [hasFullVersionPermissions] = usePermission(Permission.PROJECT_FULL_VERSIONS);

  const { versionList, loadingMore, noMoreVersions, initialFetching, resetState, fetchInitialVersions, onLoadMore } = useProjectVersions(projectID!);

  const [trackingEvents] = useTrackingEvents();
  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSaveVersion);

  const liveVersion = useSelector(ProjectV2.active.liveVersionSelector);

  const paymentModal = usePaymentModal();

  const swapVersions = async (versionID: string) => {
    if (!projectID) {
      if (LOGROCKET_ENABLED) {
        LogRocket.error(Errors.noActiveProjectID());
      } else {
        datadogRum.addError(Errors.noActiveProjectID());
      }
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
            <SectionV2.Divider />
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
