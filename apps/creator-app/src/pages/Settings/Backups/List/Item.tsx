import type { Backup } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Menu, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useFeature, useSelector } from '@/hooks';
import { useConfirmModal } from '@/ModalsV2/hooks';
import * as S from '@/pages/Settings/components/ProjectVersions/components/VersionList/components/VersionItem/styles';

interface SettingsBackupsListItemProps {
  backup: Backup;
  creatorID: number;
  onRestore: (backup: Backup) => Promise<void>;
  onDownload: (backup: Backup) => Promise<void>;
  onDelete: (backup: Backup) => Promise<void>;
  onPreview: (backup: Backup) => Promise<void>;
}

const SettingsBackupsListItem: React.FC<SettingsBackupsListItemProps> = ({ backup, creatorID, onRestore, onDownload, onDelete, onPreview }) => {
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });
  const hideExports = useFeature(Realtime.FeatureFlag.HIDE_EXPORTS);

  const confirmModal = useConfirmModal();

  const confirmRestore = () => {
    confirmModal.open({
      header: 'Restore backup',
      confirmButtonText: (
        <Box.Flex gap={12}>
          <SvgIcon icon="arrowSpin" />

          <span>Restore</span>
        </Box.Flex>
      ),

      body: (
        <>
          When you restore a backup, we'll create a new automatic backup of the current designer state. Please confirm you want to continue.
          <br />
        </>
      ),

      confirm: () => {
        onRestore(backup);
      },
    });
  };

  const confirmDelete = () => {
    confirmModal.open({
      header: 'Delete backup',

      confirmButtonText: (
        <Box.Flex gap={12}>
          <SvgIcon icon="trash" />

          <span>Delete</span>
        </Box.Flex>
      ),

      body: (
        <>
          Are you sure you want to delete this backup? This action cannot be undone.
          <br />
        </>
      ),

      confirm: async () => {
        await onDelete(backup);
      },
    });
  };

  return (
    <S.RowItem>
      <S.ColumnItemContainer>
        <TippyTooltip content={dayjs(backup.createdAt).format('MMM DD, YYYY, h:mm A')}>{dayjs(backup.createdAt).fromNow()}</TippyTooltip>
      </S.ColumnItemContainer>

      <S.ColumnItemContainer>{backup.name ?? 'Untitled'}</S.ColumnItemContainer>

      <S.ColumnItemContainer>{member?.name ?? 'Unknown'}</S.ColumnItemContainer>

      <S.ActionsItemContainer>
        <OverflowMenu
          placement="bottom-end"
          disabled={false}
          menu={
            <Menu
              width={120}
              options={[
                { label: 'Preview', onClick: () => onPreview(backup) },
                { label: '', divider: true },
                { label: 'Restore', onClick: confirmRestore },
                { label: 'Delete', onClick: confirmDelete },
                hideExports.isEnabled ? null : { label: 'Download', onClick: () => onDownload(backup) },
              ]}
            />
          }
        />
      </S.ActionsItemContainer>
    </S.RowItem>
  );
};

export default SettingsBackupsListItem;
