import { createUIOnlyMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';

import { useSelector } from '../redux';
import { BaseSelectGroup, BaseSelectOption } from './types';
import { isNonEmptyGroupedOptionFactory } from './utils';

export interface BaseDiagramSelectOption extends BaseSelectOption {
  diagramID: string;
}

export type DiagramSelectGroup<Option extends BaseDiagramSelectOption> = BaseSelectGroup<Option>;

const isNonEmptyGroupedOption = isNonEmptyGroupedOptionFactory<BaseDiagramSelectOption>();

export const useDiagramMultilevelSelectOptions = <Option extends BaseDiagramSelectOption>(
  diagramsOptions: Record<string, Option | DiagramSelectGroup<Option>>,
  { diagramGroupName }: { diagramGroupName: string }
) => {
  const diagrams = useSelector(DiagramV2.allDiagramsSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);

  return React.useMemo(() => {
    const diagramsHeaderItem = createUIOnlyMenuItemOption('diagramsHeader', { label: 'Diagrams', groupHeader: true });
    const diagramGroupHeaderItem = createUIOnlyMenuItemOption(`${diagramGroupName}Header`, { label: diagramGroupName, groupHeader: true });

    const optionsMap: Record<string, DiagramSelectGroup<Option> | Option | UIOnlyMenuItemOption> = {
      ...diagramsOptions,
      [diagramsHeaderItem.id]: diagramsHeaderItem,
      [diagramGroupHeaderItem.id]: diagramGroupHeaderItem,
    };

    const sortedDiagram = [...diagrams].sort((diagram) => (diagram.id === activeDiagramID ? -1 : 0));

    const options = sortedDiagram
      .map((diagram) => optionsMap[diagram.id])
      .filter(isNonEmptyGroupedOption)
      .map((option) => ({ ...option, options: [diagramGroupHeaderItem, ...option.options] }));

    return {
      options,
      optionsMap,
    };
  }, [activeDiagramID, diagramsOptions]);
};
