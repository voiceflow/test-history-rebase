import { BaseModels } from '@voiceflow/base-types';
import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';
import { components, OptionProps } from 'react-select';

import { Designer, Diagram } from '@/ducks';
import { useSelector } from '@/hooks/redux';

import { SearchOption } from '../types';

// eslint-disable-next-line no-import-assign
const SearchOption: React.FC<OptionProps<SearchOption, false>> = ({ data, children, isFocused, ...props }) => {
  const { entry } = data;
  const isNodeEntry = 'nodeID' in entry;

  const flow = useSelector(Designer.Flow.selectors.oneByDiagramID, { diagramID: isNodeEntry ? entry.diagramID : null });
  const diagram = useSelector(Diagram.diagramByIDSelector, { id: isNodeEntry ? entry.diagramID : null });
  const workflow = useSelector(Designer.Workflow.selectors.oneByDiagramID, {
    diagramID: isNodeEntry ? entry.diagramID : null,
  });

  const topicName = workflow?.name;

  return (
    <components.Option data={data} isFocused={isFocused} {...props}>
      <TippyTooltip
        content={diagram?.type === BaseModels.Diagram.DiagramType.TOPIC ? topicName : flow?.name}
        visible={isFocused && isNodeEntry}
        disabled={!isNodeEntry || !diagram}
        placement="bottom"
      >
        {children}
      </TippyTooltip>
    </components.Option>
  );
};

export default SearchOption;
