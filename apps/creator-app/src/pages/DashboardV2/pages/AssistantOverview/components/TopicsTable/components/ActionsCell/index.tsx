import { Dropdown, System, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as VersionV2 from '@/ducks/versionV2';
import { usePermission } from '@/hooks/permission';
import { useSelector } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';

import { Topic } from '../../types';
import * as S from './styles';

const ActionsCell: React.FC<TableTypes.ItemProps<Topic>> = ({ item }) => {
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);

  const renameModal = ModalsV2.useModal(ModalsV2.Topic.Rename);
  const deleteModal = ModalsV2.useModal(ModalsV2.Topic.Delete);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  const isRootTopic = item.id === rootDiagramID;

  return (
    <Dropdown
      options={[
        { label: 'Rename', onClick: () => renameModal.openVoid({ topicID: item.id }) },
        isRootTopic ? null : { label: 'divider', divider: true },
        isRootTopic ? null : { label: 'Delete', onClick: () => deleteModal.openVoid({ domainID: item.domainID, topicID: item.id }) },
      ]}
      placement="right-start"
      selfDismiss
    >
      {({ ref, onToggle, isOpen }) => (
        <S.Container>
          <System.IconButtonsGroup.Base>
            <System.IconButton.Base ref={ref} icon="ellipsis" active={isOpen} onClick={onToggle} disabled={!canEditCanvas} iconProps={{ size: 15 }} />
          </System.IconButtonsGroup.Base>
        </S.Container>
      )}
    </Dropdown>
  );
};

export default ActionsCell;
