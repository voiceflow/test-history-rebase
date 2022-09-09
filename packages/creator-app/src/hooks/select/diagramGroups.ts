import { BaseModels } from '@voiceflow/base-types';
import { createUIOnlyMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

import { BaseSelectGroup, BaseSelectMultilevel, BaseSelectOption } from './types';
import { isNonEmptyGroupedOptionFactory } from './utils';

export interface BaseDiagramSelectOption extends BaseSelectOption {
  diagramID: string;
}

export type DiagramSelectGroup<Option extends BaseDiagramSelectOption> = BaseSelectGroup<Option>;
export type DomainDiagramSelectMultilevel<Option extends BaseDiagramSelectOption> = BaseSelectMultilevel<Option>;

const isNonEmptyGroupedOption = isNonEmptyGroupedOptionFactory<BaseDiagramSelectOption>();

export const useDiagramGroupedSelectOptions = <Option extends BaseDiagramSelectOption>(
  diagramsOptions: Record<string, Option | DiagramSelectGroup<Option>>
) => {
  const topicIDs = useSelector(Domain.active.topicIDsSelector);
  const components = useSelector(VersionV2.active.componentsSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const activeDiagramType = useSelector(DiagramV2.active.typeSelector);

  const isComponentActive = !activeDiagramType || activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  return React.useMemo(() => {
    const optionsMap: Record<string, Option | DiagramSelectGroup<Option>> = { ...diagramsOptions };

    const sortedTopicIDs = !isComponentActive ? [...topicIDs].sort((topicID) => (topicID === activeDiagramID ? -1 : 0)) : topicIDs;
    const options = sortedTopicIDs.map((topicID) => optionsMap[topicID]);

    const sortedComponents = isComponentActive ? [...components].sort((component) => (component.sourceID === activeDiagramID ? -1 : 0)) : components;
    const componentOptions = sortedComponents.map((component) => optionsMap[component.sourceID]);

    if (isComponentActive) {
      options.unshift(...componentOptions);
    } else {
      options.push(...componentOptions);
    }

    return {
      options: options.filter(isNonEmptyGroupedOption),
      optionsMap,
    };
  }, [components, topicIDs, activeDiagramID, isComponentActive, diagramsOptions]);
};

export const useDomainAndDiagramMultilevelSelectOptions = <Option extends BaseDiagramSelectOption>(
  diagramsOptions: Record<string, Option | DomainDiagramSelectMultilevel<Option>>,
  { diagramGroupName }: { diagramGroupName: string }
) => {
  const allDomains = useSelector(Domain.allDomainsSelector);
  const components = useSelector(VersionV2.active.componentsSelector);
  const activeDomainID = useSelector(Session.activeDomainIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const activeDiagramType = useSelector(DiagramV2.active.typeSelector);

  const isComponentActive = !activeDiagramType || activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  return React.useMemo(() => {
    const domainsHeaderItem: UIOnlyMenuItemOption = {
      ...createUIOnlyMenuItemOption('domainsHeader'),
      label: 'Domains',
      groupHeader: true,
    };

    const topicsHeaderItem: UIOnlyMenuItemOption = {
      ...createUIOnlyMenuItemOption('topicsHeader'),
      label: 'Topics',
      groupHeader: true,
    };

    const componentsHeaderItem: UIOnlyMenuItemOption = {
      ...createUIOnlyMenuItemOption('componentsHeader'),
      label: 'Components',
      groupHeader: true,
    };

    const diagramGroupHeaderItem: UIOnlyMenuItemOption = {
      ...createUIOnlyMenuItemOption(`${diagramGroupName}Header`),
      label: diagramGroupName,
      groupHeader: true,
    };

    const optionsMap: Record<string, DomainDiagramSelectMultilevel<Option> | Option | UIOnlyMenuItemOption> = {
      ...diagramsOptions,
      [topicsHeaderItem.id]: topicsHeaderItem,
      [domainsHeaderItem.id]: domainsHeaderItem,
      [componentsHeaderItem.id]: componentsHeaderItem,
      [diagramGroupHeaderItem.id]: diagramGroupHeaderItem,
    };

    const sortedDomains = !isComponentActive ? [...allDomains].sort((domain) => (domain.id === activeDomainID ? -1 : 0)) : allDomains;

    const options = sortedDomains.map(({ id, name, topicIDs }) => {
      const isActive = id === activeDomainID;
      const sortedTopicIDs = isActive ? [...topicIDs].sort((topicID) => (topicID === activeDiagramID ? -1 : 0)) : topicIDs;

      const domainOptions = sortedTopicIDs
        .map((topicID) => optionsMap[topicID])
        .filter(isNonEmptyGroupedOption)
        .map((option) => ({ ...option, options: [diagramGroupHeaderItem, ...option.options] }));

      if (!domainOptions.length) {
        return null;
      }

      const option: DomainDiagramSelectMultilevel<Option> = {
        id,
        label: name,
        options: [topicsHeaderItem, ...domainOptions],
      };

      optionsMap[option.id] = option;

      return option;
    });

    const sortedComponents = isComponentActive ? [...components].sort((component) => (component.sourceID === activeDiagramID ? -1 : 0)) : components;

    const componentOptions = sortedComponents
      .map((component) => optionsMap[component.sourceID])
      .filter(isNonEmptyGroupedOption)
      .map((option) => ({ ...option, options: [diagramGroupHeaderItem, ...option.options] }));

    if (componentOptions.length) {
      const componentOption: DomainDiagramSelectMultilevel<Option> = {
        id: 'components',
        label: 'Components',
        options: [componentsHeaderItem, ...componentOptions],
      };

      // if the component is active, add components options as a first level
      if (isComponentActive) {
        options.unshift(componentOption);
      } else {
        options.push(componentOption);
      }

      optionsMap[componentOption.id] = componentOption;
    }

    return {
      options: [domainsHeaderItem, ...options.filter(isNonEmptyGroupedOption)],
      optionsMap,
    };
  }, [allDomains, components, activeDomainID, activeDiagramID, isComponentActive, diagramsOptions]);
};
