import type * as Realtime from '@voiceflow/realtime-sdk';
import type { TableTypes } from '@voiceflow/ui';
import { Dropdown, System, Table, toast } from '@voiceflow/ui';
import React from 'react';

import Domain from '@/components/Domain';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as DomainDuck from '@/ducks/domain';
import * as Organization from '@/ducks/organization';
import { useDispatch, usePermission, usePlanLimitedAction, useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const ActionsCell: React.FC<TableTypes.ItemProps<Realtime.Domain>> = ({ item }) => {
  const table = Table.useContext();

  const editModal = ModalsV2.useModal(ModalsV2.Domain.Edit);
  const deleteModal = ModalsV2.useModal(ModalsV2.Domain.Delete);
  const upgradeModal = ModalsV2.useModal(ModalsV2.Upgrade);

  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const patchDomain = useDispatch(DomainDuck.patch, item.id);
  const getDomainByID = useSelector(DomainDuck.getDomainByIDSelector);
  const duplicateDomain = useDispatch(DomainDuck.duplicate);

  const domainEditPermission = usePermission(Permission.DOMAIN_EDIT);

  const onDuplicateAction = async () => {
    const domainToDuplicate = getDomainByID({ id: item.id });

    await duplicateDomain(item.id, { navigateToDomain: true });

    if (!domainToDuplicate) return;

    toast.success(`Successfully duplicated "${domainToDuplicate.name}" domain.`);
  };

  const legacyOnDuplicate = usePlanLimitedAction(LimitType.DOMAINS, {
    value: table.items.length,
    onLimit: (config) => upgradeModal.openVoid(config.upgradeModal()),
    onAction: onDuplicateAction,
  });

  const onDuplicate = subscription ? onDuplicateAction : legacyOnDuplicate;

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
      {({ ref, onToggle, isOpen }) => (
        <S.Container>
          <System.IconButtonsGroup.Base>
            <System.IconButton.Base
              ref={ref}
              icon="ellipsis"
              active={isOpen}
              onClick={onToggle}
              disabled={!domainEditPermission.allowed}
              iconProps={{ size: 15 }}
            />
          </System.IconButtonsGroup.Base>
        </S.Container>
      )}
    </Dropdown>
  );
};

export default ActionsCell;
