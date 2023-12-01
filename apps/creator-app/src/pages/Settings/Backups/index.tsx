import type { Backup as BackupEntity } from '@voiceflow/dtos';
import { Animations, Box, DataTypes, download, LoadCircle, SectionV2, System, toast } from '@voiceflow/ui';
import React from 'react';
import { generatePath } from 'react-router-dom';

import { designerClient } from '@/client/designer';
import { realtimeClient } from '@/client/realtime';
import * as Settings from '@/components/Settings';
import { Path } from '@/config/routes';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import { useDispatch, useHotkey, usePermission, useSetup, useTrackingEvents } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/redux';
import { getHotkeyLabel, Hotkey } from '@/keymap';
import * as ModalsV2 from '@/ModalsV2';
import * as S from '@/pages/Settings/components/ProjectVersions/components';
import { openURLInANewTab } from '@/utils/window';

import BackupsList from './List';

const DEFAULT_FETCH_LIMIT = 10;

const SettingsBackups: React.FC = () => {
  const projectID = useSelector(Session.activeProjectIDSelector)!;
  const versionID = useSelector(Session.activeVersionIDSelector)!;
  const goToCanvasWithVersionID = useDispatch(Router.goToCanvasWithVersionID);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [hasFullVersionPermissions] = usePermission(Permission.PROJECT_FULL_VERSIONS);

  const [backups, setBackups] = React.useState<BackupEntity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [trackingEvents] = useTrackingEvents();

  const manualSaveModal = ModalsV2.useModal(ModalsV2.Project.ManualSaveBackup);

  const paymentModal = usePaymentModal();

  const fetchBackups = async (offset: number) => {
    try {
      const nextBackups = await designerClient.backup.findMany(projectID, { offset, limit: DEFAULT_FETCH_LIMIT });

      if (!nextBackups || nextBackups.data.length < DEFAULT_FETCH_LIMIT) {
        setHasMore(false);
      }

      setBackups((prevBackups) => [...prevBackups, ...nextBackups.data]);
    } catch (err) {
      toast.error('Error fetching backups');
    }
  };

  const onLoadMore = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    await fetchBackups(backups.length);

    setLoadingMore(false);
  };

  const fetchInitialVersions = async () => {
    await fetchBackups(0);

    setLoading(false);
  };

  const resetState = () => {
    setBackups([]);
    setHasMore(true);
    setLoading(true);

    fetchInitialVersions();
  };

  const openManualSaveModal = () => {
    manualSaveModal.openVoid({ reFetchBackups: resetState });
  };

  useSetup(async () => {
    fetchInitialVersions();
  });

  useHotkey(Hotkey.OPEN_MANUAL_SAVE_MODAL, openManualSaveModal, { preventDefault: true, disable: !canEditCanvas });

  const handleDownloadBackup = async (backup: BackupEntity) => {
    try {
      const result = await designerClient.backup.downloadOne(projectID, backup.id);
      download(`${backup.name ?? backup.id}.vf`, JSON.stringify(result.data, null, 2), DataTypes.JSON);
    } catch (error) {
      toast.error('Backup download failed');
    }
  };

  const handleDeleteBackup = async (backup: BackupEntity) => {
    await designerClient.backup.deleteOne(projectID, backup.id);

    setBackups((prevBackups) => prevBackups.filter(({ id }) => backup.id !== id));
  };

  const handleRestore = async (backup: BackupEntity) => {
    setLoading(true);
    await designerClient.backup.restoreOne(projectID, backup.id, { clientID: realtimeClient.clientId });

    goToCanvasWithVersionID(versionID);
  };

  const handlePreview = async (backup: BackupEntity) => {
    const { versionID } = await designerClient.backup.previewOne(projectID, backup.id);
    openURLInANewTab(`${window.location.origin}${generatePath(Path.PROJECT_DOMAIN, { versionID })}`);

    trackingEvents.trackBackupPreview({ versionID, backupID: backup.id });
  };

  return (
    <Settings.Section>
      <Settings.Card>
        <S.Heading>
          <>
            New backups are created when you publish your assistant. To manually save a backup, use the shortcut{' '}
            <S.HotKeyContainer>Shift + {getHotkeyLabel(Hotkey.SAVE_VERSION)}</S.HotKeyContainer>.{' '}
            {!hasFullVersionPermissions && (
              <>
                Free users can only view 30 days of an assistant's version history.{' '}
                <System.Link.Button onClick={() => paymentModal.openVoid({})}>Upgrade to unlock unlimited version history</System.Link.Button>
              </>
            )}
          </>
        </S.Heading>

        {loading ? (
          <Box.FlexCenter minHeight={320}>
            <LoadCircle />
          </Box.FlexCenter>
        ) : (
          <Animations.FadeLeft>
            <SectionV2.Divider />
            <BackupsList
              data={backups}
              onLoadMore={onLoadMore}
              onDownload={handleDownloadBackup}
              onDelete={handleDeleteBackup}
              onRestore={handleRestore}
              onPreview={handlePreview}
              loadingMore={loadingMore}
              hasMore={hasMore}
            />
          </Animations.FadeLeft>
        )}
      </Settings.Card>
    </Settings.Section>
  );
};

export default SettingsBackups;
