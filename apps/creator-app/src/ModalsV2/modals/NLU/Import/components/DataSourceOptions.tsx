import { Dropdown, System } from '@voiceflow/ui';
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
      {({ ref, onToggle, isOpen }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base ref={ref} icon="ellipsis" active={isOpen} onClick={onToggle} iconProps={{ size: 14 }} />
        </System.IconButtonsGroup.Base>
      )}
    </Dropdown>
  ) : null;
};

export default DataSourceOptions;
