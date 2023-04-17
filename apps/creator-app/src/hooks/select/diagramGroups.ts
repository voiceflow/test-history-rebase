import { BaseModels } from '@voiceflow/base-types';
import { createUIOnlyMenuItemOption, UIOnlyMenuItemOption } from '@voiceflow/ui';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import * as Session from '@/ducks/session';
import * as VersionV2 from '@/ducks/versionV2';

import { useSelector } from '../redux';
import { BaseSelectGroup, BaseSelectMultilevel, BaseSelectOption } from './types';
import { isNonEmptyGroupedOptionFactory } from './utils';

export interface BaseDiagramSelectOption extends BaseSelectOption {
  diagramID: string;
}

export type DiagramSelectGroup<Option extends BaseDiagramSelectOption> = BaseSelectGroup<Option>;
export type DomainDiagramSelectMultilevel<Option extends BaseDiagramSelectOption> = BaseSelectMultilevel<Option>;

const isNonEmptyGroupedOption = isNonEmptyGroupedOptionFactory<BaseDiagramSelectOption>();

export const useDomainAndDiagramMultilevelSelectOptions = <Option extends BaseDiagramSelectOption>(
  diagramsOptions: Record<string, Option | DomainDiagramSelectMultilevel<Option>>,
  { diagramGroupName }: { diagramGroupName: string }
) => {
  const allDomains = useSelector(Domain.allDomainsSelector);
  const components = useSelector(VersionV2.active.componentsSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const activeDomainID = useSelector(Session.activeDomainIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const activeDiagramType = useSelector(DiagramV2.active.typeSelector);

  const isComponentActive = !activeDiagramType || activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  return React.useMemo(() => {
    const topicsHeaderItem = createUIOnlyMenuItemOption('topicsHeader', { label: 'Topics', groupHeader: true });
    const domainsHeaderItem = createUIOnlyMenuItemOption('domainsHeader', { label: 'Domains', groupHeader: true });
    const componentsHeaderItem = createUIOnlyMenuItemOption('componentsHeader', { label: 'Components', groupHeader: true });
    const diagramGroupHeaderItem = createUIOnlyMenuItemOption(`${diagramGroupName}Header`, { label: diagramGroupName, groupHeader: true });
    const subtopicGroupHeaderItem = createUIOnlyMenuItemOption(`subtopicsHeader`, { label: 'Sub Topics', groupHeader: true });

    const optionsMap: Record<string, DomainDiagramSelectMultilevel<Option> | Option | UIOnlyMenuItemOption> = {
      ...diagramsOptions,
      [topicsHeaderItem.id]: topicsHeaderItem,
      [domainsHeaderItem.id]: domainsHeaderItem,
      [componentsHeaderItem.id]: componentsHeaderItem,
      [diagramGroupHeaderItem.id]: diagramGroupHeaderItem,
      [subtopicGroupHeaderItem.id]: subtopicGroupHeaderItem,
    };

    const sortedDomains = !isComponentActive ? [...allDomains].sort((domain) => (domain.id === activeDomainID ? -1 : 0)) : allDomains;

    const getSubtopicsOptions = (topicID: string) => {
      const diagram = getDiagramByID({ id: topicID });

      const subtopicsOptions: Array<Option | BaseSelectMultilevel<Option> | UIOnlyMenuItemOption> = [];

      if (!diagram) return subtopicsOptions;

      // eslint-disable-next-line no-restricted-syntax
      for (const menuItem of diagram.menuItems) {
        if (menuItem.type !== BaseModels.Diagram.MenuItemType.DIAGRAM) continue;

        const option = optionsMap[menuItem.sourceID];

        if (isNonEmptyGroupedOption(option)) {
          subtopicsOptions.push({ ...option, options: [diagramGroupHeaderItem, ...option.options] });
        }
      }

      return subtopicsOptions;
    };

    const options = sortedDomains.map(({ id, name, topicIDs }) => {
      const isActive = id === activeDomainID;
      const sortedTopicIDs = isActive ? [...topicIDs].sort((topicID) => (topicID === activeDiagramID ? -1 : 0)) : topicIDs;

      const domainOptions: Array<Option | BaseSelectMultilevel<Option> | UIOnlyMenuItemOption> = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const topicID of sortedTopicIDs) {
        const option = optionsMap[topicID];

        if (!option) continue;

        if (!('options' in option)) continue;

        const subtopicsOptions = getSubtopicsOptions(topicID);

        let topicOption = { ...option };

        if (topicOption.options.length) {
          topicOption = { ...topicOption, options: [diagramGroupHeaderItem, ...topicOption.options] };
        }

        if (subtopicsOptions?.length) {
          topicOption = { ...option, options: [...topicOption.options, subtopicGroupHeaderItem, ...subtopicsOptions] };
        }

        if (topicOption.options.length) {
          domainOptions.push(topicOption);
        }
      }

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

    const domainsOptions = options.filter(isNonEmptyGroupedOption);

    return {
      options:
        domainsOptions.length > 1
          ? [domainsHeaderItem, ...domainsOptions]
          : ((domainsOptions[0]?.options ?? []) as DomainDiagramSelectMultilevel<Option>[]),
      optionsMap,
    };
  }, [allDomains, components, activeDomainID, activeDiagramID, isComponentActive, diagramsOptions]);
};
