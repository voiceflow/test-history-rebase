import { Menu } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as Domain from '@/ducks/domain';
import * as VersionV2 from '@/ducks/versionV2';
import { createGroupedSelectID, useSelector } from '@/hooks';

import { GroupedSelect, MultilevelSelect } from './components';
import { Props } from './types';

const BlockSelect: React.FC<Props> = ({ value, clearable, startNodeIsDefault, ...props }) => {
  const allDomains = useSelector(Domain.allDomainsSelector);
  const startNodeID = useSelector(CreatorV2.startNodeIDSelector);
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);

  const rootStartValue = startNodeIsDefault && rootDiagramID && startNodeID ? createGroupedSelectID(rootDiagramID, startNodeID) : null;
  const selectValue = value ? createGroupedSelectID(value.diagramID, value.stepID) : rootStartValue || null;

  const sharedProps = {
    value: selectValue,
    clearable: !!clearable && !!selectValue,
    searchable: true,
    renderEmpty: ({ search }: { search: string }) => (
      <Menu.NotFound>{!search ? 'No blocks exists in your project. ' : 'No blocks found. '}</Menu.NotFound>
    ),
    placeholder: 'Select a block',
  };

  return allDomains.length < 2 ? <GroupedSelect {...sharedProps} {...props} /> : <MultilevelSelect {...sharedProps} {...props} />;
};

export default BlockSelect;
