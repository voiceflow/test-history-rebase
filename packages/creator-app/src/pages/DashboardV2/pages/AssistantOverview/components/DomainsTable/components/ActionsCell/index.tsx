import * as Realtime from '@voiceflow/realtime-sdk';
import { Dropdown, IconButton, Table, TableTypes, toast } from '@voiceflow/ui';
import React from 'react';

import Domain from '@/components/Domain';
import { LimitType } from '@/constants/limits';
import * as DomainDuck from '@/ducks/domain';
import { useDispatch, usePlanLimitedAction, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const ActionsCell: React.FC<TableTypes.ItemProps<Realtime.Domain>> = ({ item }) => {
  const row = Table.useRowContext();
  const table = Table.useContext();

  const editModal = ModalsV2.useModal(ModalsV2.Domain.Edit);
  const deleteModal = ModalsV2.useModal(ModalsV2.Domain.Delete);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const patchDomain = useDispatch(DomainDuck.patch, item.id);
  const getDomainByID = useSelector(DomainDuck.getDomainByIDSelector);
  const duplicateDomain = useDispatch(DomainDuck.duplicate);

  const onDuplicate = usePlanLimitedAction(LimitType.DOMAINS, {
    value: table.items.length,

    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal()),
    onAction: async () => {
      const domainToDuplicate = getDomainByID({ id: item.id });

      await duplicateDomain(item.id, { navigateToDomain: true });

      if (!domainToDuplicate) return;

      toast.success(`Successfully duplicated "${domainToDuplicate.name}" domain.`);
    },
  });

  return (
    <Dropdown
      menu={
        <Domain.Actions
          live={item.live}
          status={item.status}
          onEdit={() => editModal.openVoid({ domainID: item.id })}
          onDelete={() => deleteModal.openVoid({ domainID: item.id })}
          onDuplicate={() => onDuplicate()}
          onToggleLive={(live) => patchDomain({ live })}
          onChangeStatus={(status) => patchDomain({ status })}
        />
      }
      placement="right-start"
      selfDismiss
    >
      {(ref, onToggle, isOpen) => (
        <S.Container rowHovered={row.hovered || isOpen}>
          <IconButton ref={ref} onClick={onToggle} activeClick={isOpen} size={15} icon="ellipsis" variant={IconButton.Variant.BASIC} />
        </S.Container>
      )}
    </Dropdown>
  );
};

export default ActionsCell;
