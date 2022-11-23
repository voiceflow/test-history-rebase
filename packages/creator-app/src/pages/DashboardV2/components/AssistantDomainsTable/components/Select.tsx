import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import React from 'react';

import { getCountByStatus } from '../utils';
import * as S from './styles';

export const DomainsSelect: React.FC<{ value: string; items: Realtime.Domain[]; onChange: (value: string) => void }> = ({
  value,
  items,
  onChange,
}) => {
  const statusOptions = React.useMemo(
    () => [
      { value: '', label: 'All', count: items.length },
      {
        value: BaseModels.Version.DomainStatus.DESIGN,
        label: 'Design',
        count: getCountByStatus(items, BaseModels.Version.DomainStatus.DESIGN),
      },
      {
        value: BaseModels.Version.DomainStatus.REVIEW,
        label: 'In Review',
        count: getCountByStatus(items, BaseModels.Version.DomainStatus.REVIEW),
      },
      {
        value: BaseModels.Version.DomainStatus.COMPLETE,
        label: 'Complete',
        count: getCountByStatus(items, BaseModels.Version.DomainStatus.COMPLETE),
      },
    ],
    [items]
  );

  const getOptionLabel = React.useCallback((label) => label, []);
  const getOptionKey = React.useCallback((option) => option.value, []);
  const getOptionValue = React.useCallback((option) => option.value, []);
  const selectValue = React.useMemo(() => statusOptions.find((option) => option.value === value)?.label, [value]);

  return (
    <S.SelectWrapper>
      <Select
        value={selectValue}
        options={statusOptions}
        onSelect={(option) => onChange(option || '')}
        placeholder={selectValue}
        renderOptionLabel={(option) => (
          <S.Option>
            <S.Label>{option.label}</S.Label>
            <S.Count>{option.count}</S.Count>
          </S.Option>
        )}
        prefix="STATUS"
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        getOptionKey={getOptionKey}
        width="180px"
      />
    </S.SelectWrapper>
  );
};
