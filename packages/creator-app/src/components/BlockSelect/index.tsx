import { BaseSelectProps, FlexApart, Select } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';
import { getDiagramName } from '@/utils/diagram';

import { BlockOption, TopicBlockOption } from './types';

interface StartFrom {
  stepID: string;
  diagramID: string;
}

interface BlockSelectProps extends BaseSelectProps {
  value: StartFrom | null;
  onChange: (value: StartFrom | null) => void;
  clearable?: boolean;
  startNodeIsDefault?: boolean;
}

const BlockSelect: React.FC<BlockSelectProps> = ({ value, onChange, className, clearable, startNodeIsDefault, ...props }) => {
  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const startingBlocks = useSelector(DiagramV2.startingBlocksSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const allDiagrams = useSelector(DiagramV2.allDiagramsSelector);

  const { options, optionsMap } = React.useMemo(() => {
    const options: TopicBlockOption[] = [];
    const optionsMap: Record<string, BlockOption> = {};

    Object.entries(startingBlocks).forEach(([diagramID, diagramBlocksData]) => {
      const diagram = getDiagramByID({ id: diagramID });

      if (!diagram) return;

      const blockOptions: BlockOption[] = [];

      Object.values(diagramBlocksData).forEach((blockData) => {
        if (!blockData) return;

        optionsMap[blockData.blockID] = { id: blockData.blockID, label: blockData.name, diagramID };

        blockOptions.push({
          id: blockData.blockID,
          label: blockData.name,
          diagramID,
        });
      });

      if (blockOptions.length) {
        options.push({
          id: diagramID,
          label: getDiagramName(diagram.name),
          options: blockOptions,
        });
      }
    });

    return { options, optionsMap };
  }, [startingBlocks, allDiagrams]);

  const onSelect = (stepID: string | null) => {
    if (!stepID) {
      onChange(null);
      return;
    }

    const startFrom = optionsMap[stepID];

    onChange({ stepID: startFrom.id, diagramID: startFrom.diagramID });
  };

  const selectValue = value?.stepID || (startNodeIsDefault ? startNodeID : null);

  return (
    <Select<BlockOption, TopicBlockOption, string>
      clearable={!!clearable && !!selectValue}
      searchable
      placeholder="Select a block"
      {...props}
      value={selectValue}
      grouped
      options={options}
      onSelect={onSelect}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      renderOptionLabel={(option) => <FlexApart fullWidth>{option.label}</FlexApart>}
    />
  );
};

export default BlockSelect;
