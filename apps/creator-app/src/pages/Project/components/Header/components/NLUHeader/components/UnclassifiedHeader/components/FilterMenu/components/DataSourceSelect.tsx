import { Utils } from '@voiceflow/common';
import { Box, Checkbox, Select, SelectInputVariant, Text } from '@voiceflow/ui';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';

import type { FilterMenuSectionComponentProps } from './types';

const DataSourceSelect: React.FC<FilterMenuSectionComponentProps> = ({ isActive }) => {
  const nluManager = useNLUManager();
  const allUnclassifiedData = useSelector(NLUDuck.allUnclassifiedDataSelector);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const { options, optionsMap } = React.useMemo(() => {
    const optionsMap = Object.fromEntries(allUnclassifiedData.map((dataSource) => [dataSource.id, dataSource.name]));

    return {
      options: Object.keys(optionsMap),
      optionsMap,
    };
  }, [allUnclassifiedData]);

  const handleSelect = (option: string | null) => {
    if (!option) return;

    if (selectedOptions.includes(option)) {
      setSelectedOptions(Utils.array.withoutValue(selectedOptions, option));
      return;
    }

    setSelectedOptions([...selectedOptions, option]);
  };

  React.useEffect(() => {
    if (nluManager.unclassifiedDataFilters.dataSourceIDs !== selectedOptions) {
      setSelectedOptions(nluManager.unclassifiedDataFilters.dataSourceIDs || []);
    }
  }, [nluManager.unclassifiedDataFilters.dataSourceIDs]);

  if (!isActive) return null;

  return (
    <Select<string>
      onBlur={() => nluManager.setUnclassifiedDataFilters({ ...nluManager.unclassifiedDataFilters, dataSourceIDs: selectedOptions })}
      options={options}
      onSelect={handleSelect}
      autoDismiss={false}
      placeholder="Select data sources"
      inputVariant={SelectInputVariant.SELECTED}
      getOptionKey={(option) => option}
      getOptionLabel={(option) => option && optionsMap[option]}
      selectedOptions={selectedOptions}
      renderOptionLabel={(id) => (
        <Box.Flex>
          <Checkbox checked={selectedOptions.includes(id)} />
          <Text>{optionsMap[id]}</Text>
        </Box.Flex>
      )}
    />
  );
};

export default DataSourceSelect;
