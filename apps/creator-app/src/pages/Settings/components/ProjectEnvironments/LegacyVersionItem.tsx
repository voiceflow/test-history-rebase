import { Box, Menu, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import { designerClient } from '@/client/designer';
import OverflowMenu from '@/components/OverflowMenu';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { useConfirmModal } from '@/hooks/modal.hook';
import THEME from '@/styles/theme';

import { ProjectVersion } from './hooks';
import * as S from './styles';

interface VersionItemProps {
  version: ProjectVersion;
  creatorID: number;
  projectID: string;
  deleteVersion: () => Promise<void>;
}

const VersionItem: React.FC<VersionItemProps> = ({ version, creatorID, projectID, deleteVersion }) => {
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });
  const confirmModal = useConfirmModal();

  const { manualSave, autoSaveFromRestore } = version;

  const getName = () => {
    if (autoSaveFromRestore) return 'Automatic from restore';
    if (manualSave) return version.name || 'Automatic';
    return 'Automatic';
  };

  const getColor = () => (manualSave && version.name !== '' ? 'black' : THEME.colors[ThemeColor.SECONDARY]);

  const removeVersion = React.useCallback(
    (options: { convert: boolean }) => () =>
      confirmModal.openVoid({
        header: options.convert ? 'Converting Legacy Version' : 'Deleting Legacy Version',

        body: (
          <>
            <b>versionID:</b> {version.versionID}
            <br />
            <br />
            If called in any production setting, this legacy version can no longer be referenced.
          </>
        ),

        confirmButtonText: 'Confirm',

        confirm: async () => {
          // create a backup of the version before deleting it
          if (options.convert) {
            await designerClient.backup.createOne(projectID, { versionID: version.versionID, name: version.name || 'Converted from Legacy Version' });
          }
          await deleteVersion();
        },
      }),
    []
  );

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

      <Box.FlexEnd>
        <OverflowMenu
          placement="bottom-end"
          menu={
            <Menu
              width={180}
              options={[
                { label: 'Convert to Backup', onClick: removeVersion({ convert: true }) },
                { label: 'Delete', onClick: removeVersion({ convert: false }) },
              ]}
            />
          }
        />
      </Box.FlexEnd>
    </S.RowItem>
  );
};

export default VersionItem;
