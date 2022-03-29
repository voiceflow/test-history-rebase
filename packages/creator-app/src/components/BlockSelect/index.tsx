import { BaseSelectProps, FlexApart, Select } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';
import { getDiagramName } from '@/utils/diagram';

import { BlockOption, TopicBlockOption } from './types';

interface BlockSelectProps extends BaseSelectProps {
  value: string | null;
  onChange: (value: string) => void;
}

const BlockSelect: React.FC<BlockSelectProps> = ({ value, onChange, className, ...props }) => {
  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const startingBlocks = useSelector(DiagramV2.startingBlocksSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const allDiagrams = useSelector(DiagramV2.allDiagramsSelector);

  const { options, labels } = React.useMemo(() => {
    const options: TopicBlockOption[] = [];
    const labels: Record<string, string> = {};

    // eslint-disable-next-line no-restricted-syntax
    Object.entries(startingBlocks).forEach(([diagramID, diagramBlocksData]) => {
      const diagram = getDiagramByID({ id: diagramID });

      if (!diagram) return;

      const blockOptions: BlockOption[] = [];

      Object.values(diagramBlocksData).forEach((blockData) => {
        if (!blockData) return;

        labels[blockData.blockID] = blockData.name;
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

    return { options, labels };
  }, [startingBlocks, allDiagrams]);

  return (
    <Select
      searchable
      placeholder="Select a block"
      {...props}
      value={value || startNodeID}
      options={options}
      onSelect={(newValue) => onChange(newValue === value ? '' : newValue)}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => value && labels[value]}
      renderOptionLabel={(option) => <FlexApart fullWidth>{option.label}</FlexApart>}
      grouped
    />
  );
};

export default BlockSelect;
