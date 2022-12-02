import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import React from 'react';

import { getCountByStatus } from '../utils';
import * as S from './styles';

interface DomainSelectProps {
  value: string;
  items: Realtime.Domain[];
  onChange: (value: string) => void;
}

export const DomainsSelect: React.FC<DomainSelectProps> = ({ value, items, onChange }) => {
  const options = React.useMemo(
    () => [
      { value: '', label: 'All', count: items.length, width: '132px' },
      {
        value: BaseModels.Version.DomainStatus.DESIGN,
        label: 'Design',
        count: getCountByStatus(items, BaseModels.Version.DomainStatus.DESIGN),
        width: '163px',
      },
      {
        value: BaseModels.Version.DomainStatus.REVIEW,
        label: 'In Review',
        count: getCountByStatus(items, BaseModels.Version.DomainStatus.REVIEW),
        width: '182px',
      },
      {
        value: BaseModels.Version.DomainStatus.COMPLETE,
        label: 'Complete',
        count: getCountByStatus(items, BaseModels.Version.DomainStatus.COMPLETE),
        width: '182px',
      },
    ],
    [items]
  );

  const optionsMap = React.useMemo(() => Utils.array.createMap(options, (option) => option.value), [options]);

  return (
    <S.SelectWrapper>
      <Select
        width={optionsMap[value]?.width}
        value={value}
        prefix="STATUS"
        options={options}
        onSelect={(option) => onChange(option || '')}
        minMenuWidth={148}
        maxMenuWidth={148}
        getOptionKey={(option) => option.value}
        getOptionValue={(option) => option?.value}
        getOptionLabel={(value) => optionsMap[value ?? ''].label}
        renderOptionLabel={(option) => (
          <S.Option>
            <S.Label>{option.label}</S.Label>
            <S.Count>{option.count}</S.Count>
          </S.Option>
        )}
      />
    </S.SelectWrapper>
  );
};
