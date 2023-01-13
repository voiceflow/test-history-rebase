import { Dropdown, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { useDataSourceMenu } from '@/contexts/NLUContext/hooks';

export interface DataSourceOptionsProps {
  items: string[];
  dataSourceID: string;
  dataSourceName: string;
  children?: React.ReactNode;
}

const DataSourceOptions: React.FC<DataSourceOptionsProps> = ({ items, dataSourceID, dataSourceName }) => {
  const { options } = useDataSourceMenu({ items, dataSourceID, dataSourceName });

  return options.length ? (
    <Dropdown placement="bottom-end" selfDismiss options={options}>
      {(ref, onToggle, isOpened) => (
        <IconButton
          style={{ marginRight: '0px' }}
          size={14}
          icon="ellipsis"
          variant={IconButtonVariant.BASIC}
          onClick={onToggle}
          activeClick={isOpened}
          ref={ref}
        />
      )}
    </Dropdown>
  ) : null;
};

export default DataSourceOptions;
