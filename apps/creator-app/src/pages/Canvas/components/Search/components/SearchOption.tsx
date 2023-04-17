import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';
import { components, OptionProps } from 'react-select';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks/redux';

import { SearchOption } from '../types';

const SearchOption: React.FC<OptionProps<SearchOption, false>> = ({ data, children, isFocused, ...props }) => {
  const { entry } = data;
  const isNodeEntry = 'nodeID' in entry;

  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: isNodeEntry ? entry.diagramID : null });

  return (
    <components.Option data={data} isFocused={isFocused} {...props}>
      <TippyTooltip content={diagram?.name ?? ''} visible={isFocused && isNodeEntry} disabled={!isNodeEntry || !diagram} placement="bottom">
        {children}
      </TippyTooltip>
    </components.Option>
  );
};

export default SearchOption;
