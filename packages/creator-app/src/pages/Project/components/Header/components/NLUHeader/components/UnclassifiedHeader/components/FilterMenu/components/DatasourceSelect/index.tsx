import { Utils } from '@voiceflow/common';
import { Checkbox, Select, SelectInputVariant, Text } from '@voiceflow/ui';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';

import * as S from './styles';

const DatasourceSelect: React.FC = () => {
  const nluManager = useNLUManager();
  const allUnclassifiedData = useSelector(NLUDuck.allUnclassifiedDataSelector);
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const allOptions = React.useMemo(() => {
    return allUnclassifiedData.map((datasource) => datasource.id);
  }, [allUnclassifiedData]);

  const optionsLoockup = React.useMemo(() => {
    return Object.fromEntries(allUnclassifiedData.map((datasource) => [datasource.id, datasource.name]));
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

  return (
    <Select<string>
      options={allOptions}
      inputVariant={SelectInputVariant.SELECTED}
      selectedOptions={selectedOptions}
      getOptionKey={(option) => option}
      getOptionLabel={(option) => option && optionsLoockup[option]}
      onBlur={() => nluManager.setUnclassifiedDataFilters({ ...nluManager.unclassifiedDataFilters, dataSourceIDs: selectedOptions })}
      placeholder="Select data sources"
      onSelect={handleSelect}
      autoDismiss={false}
      renderOptionLabel={(id) => (
        <S.DatasourceItem>
          <Checkbox checked={selectedOptions.includes(id)} />
          <Text>{optionsLoockup[id]}</Text>
        </S.DatasourceItem>
      )}
    />
  );
};

export default DatasourceSelect;
