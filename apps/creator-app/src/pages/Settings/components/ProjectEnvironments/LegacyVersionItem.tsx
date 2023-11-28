import { Menu, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import dayjs from 'dayjs';
import React from 'react';

import OverflowMenu from '@/components/OverflowMenu';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import * as S from '@/pages/Settings/components/ProjectVersions/components/VersionList/components/VersionItem/styles';
import { ProjectVersion } from '@/pages/Settings/components/ProjectVersions/hooks';
import THEME from '@/styles/theme';

interface VersionItemProps {
  version: ProjectVersion;
  creatorID: number;
  deleteVersion: () => void;
}

const VersionItem: React.FC<VersionItemProps> = ({ version, creatorID, deleteVersion }) => {
  const member = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID });

  const { manualSave, autoSaveFromRestore } = version;

  const getName = () => {
    if (autoSaveFromRestore) return 'Automatic from restore';
    if (manualSave) return version.name || 'Automatic';
    return 'Automatic';
  };

  const getColor = () => (manualSave && version.name !== '' ? 'black' : THEME.colors[ThemeColor.SECONDARY]);

  const convertToBackup = () => {
    // TODO: implement
  };

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

      <S.ActionsItemContainer>
        <OverflowMenu
          placement="bottom-end"
          menu={
            <Menu
              width={180}
              options={[
                { label: 'Convert to Backup', onClick: convertToBackup },
                { label: 'Delete', onClick: deleteVersion },
              ]}
            />
          }
        />
      </S.ActionsItemContainer>
    </S.RowItem>
  );
};

export default VersionItem;
