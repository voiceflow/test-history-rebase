import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Dropdown, Table, TableTypes, toast } from '@voiceflow/ui';
import React from 'react';

import Domain from '@/components/Domain';
import * as DomainDuck from '@/ducks/domain';
import { useDispatch } from '@/hooks';

import * as S from './styles';

const StatusCell: React.FC<TableTypes.ItemProps<Realtime.Domain>> = ({ item }) => {
  const row = Table.useRowContext();
  const patchDomain = useDispatch(DomainDuck.patch, item.id);

  const onChangeStatusFactory = (status: BaseModels.Version.DomainStatus) => async () => {
    await patchDomain({ status });

    toast.success(`Status updated to ${Domain.Actions.STATUS_LABELS_MAP[status]}.`);
  };

  const createOption = (status: BaseModels.Version.DomainStatus) => ({
    label: Domain.Actions.STATUS_LABELS_MAP[status],
    value: status,
    onClick: onChangeStatusFactory(status),
  });

  return (
    <Dropdown
      options={[
        createOption(BaseModels.Version.DomainStatus.DESIGN),
        createOption(BaseModels.Version.DomainStatus.REVIEW),
        createOption(BaseModels.Version.DomainStatus.COMPLETE),
      ]}
      placement="bottom"
      selfDismiss
    >
      {(ref, onToggle, isOpen) => (
        <S.Container ref={ref} active={isOpen} rowHovered={row.hovered} onClick={onToggle}>
          {Domain.Actions.STATUS_LABELS_MAP[item.status ?? BaseModels.Version.DomainStatus.DESIGN]} <S.Icon icon="arrowRightTopics" size={9} />
        </S.Container>
      )}
    </Dropdown>
  );
};

export default StatusCell;
