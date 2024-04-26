import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Select, Text } from '@voiceflow/ui';
import React from 'react';

import Domain from '@/components/Domain';

interface StatusSelectProps {
  value: string;
  items: Realtime.Domain[];
  onChange: (value: string) => void;
}

const StatusSelect: React.FC<StatusSelectProps> = ({ value, items, onChange }) => {
  const [options, optionsMap] = React.useMemo(() => {
    const domainsMapByStatus = items.reduce<Record<BaseModels.Version.DomainStatus, Realtime.Domain[]>>(
      (acc, item) => {
        acc[item.status ?? BaseModels.Version.DomainStatus.DESIGN].push(item);

        return acc;
      },
      {
        [BaseModels.Version.DomainStatus.DESIGN]: [],
        [BaseModels.Version.DomainStatus.REVIEW]: [],
        [BaseModels.Version.DomainStatus.COMPLETE]: [],
      }
    );

    const createStatusOption = (status: BaseModels.Version.DomainStatus, width: number) => ({
      value: status,
      label: Domain.Actions.STATUS_LABELS_MAP[status],
      count: domainsMapByStatus[status].length,
      width: `${width}px`,
    });

    const options = [
      { value: '', label: 'All', count: items.length, width: '132px' },
      createStatusOption(BaseModels.Version.DomainStatus.DESIGN, 163),
      createStatusOption(BaseModels.Version.DomainStatus.REVIEW, 163),
      createStatusOption(BaseModels.Version.DomainStatus.COMPLETE, 182),
    ];

    return [options, Utils.array.createMap(options, (option) => option.value)] as const;
  }, [items]);

  return (
    <Select
      width={optionsMap[value]?.width}
      value={value}
      prefix="STATUS"
      options={options}
      onSelect={(option) => onChange(option)}
      minMenuWidth={148}
      maxMenuWidth={148}
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => optionsMap[value ?? ''].label}
      renderOptionLabel={(option) => (
        <Box.FlexApart fullWidth>
          <span>{option.label}</span>
          <Text color="#8da2b5" fontSize={13}>
            {option.count}
          </Text>
        </Box.FlexApart>
      )}
    />
  );
};

export default StatusSelect;
