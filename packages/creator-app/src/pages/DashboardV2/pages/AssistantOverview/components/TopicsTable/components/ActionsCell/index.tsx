import { Dropdown, System, TableTypes } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import { Topic } from '../../types';
import * as S from './styles';

const ActionsCell: React.FC<TableTypes.ItemProps<Topic>> = ({ item }) => {
  const renameModal = ModalsV2.useModal(ModalsV2.Topic.Rename);
  const deleteModal = ModalsV2.useModal(ModalsV2.Topic.Delete);

  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  return (
    <Dropdown
      options={[
        { label: 'Rename', onClick: () => renameModal.openVoid({ topicID: item.id }) },
        { label: 'divider', divider: true },
        { label: 'Delete', onClick: () => deleteModal.openVoid({ domainID: item.domainID, topicID: item.id }) },
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
