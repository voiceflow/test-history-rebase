import { Nullable } from '@voiceflow/common';
import { Flow } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as Designer from '@/ducks/designer';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useEventualEngine } from '@/hooks/engine';
import { useLocalDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

export interface ComponentItem {
  id: string;
  name: string;
  isFolder: boolean;
  children: ComponentItem[];
}

export interface ComponentsAPI {
  onDragEnd: (item: ComponentItem) => void;
  onDragStart: (item: ComponentItem) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  componentsItems: ComponentItem[];
  activeDiagramID: Nullable<string>;
  searchMatchValue: string;
  lastCreatedDiagramID: Nullable<string>;
  searchComponentsItems: ComponentItem[];
  searchOpenedComponents: Record<string, true>;
  onClearLastCreatedDiagramID: VoidFunction;
}

export const useComponents = (): ComponentsAPI => {
  const folders = useSelector(VersionV2.active.foldersSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const lastCreatedDiagramID = useSelector(DiagramV2.lastCreatedIDSelector);
  const cmsComponents = useSelector(Designer.Flow.selectors.allOrderedByName);
  const setLastCreatedDiagramID = useLocalDispatch(DiagramV2.setLastCreatedID);

  const getEngine = useEventualEngine();

  const [searchValue, setSearchValue] = React.useState<string>('');

  const onClearLastCreatedDiagramID = React.useCallback(() => setLastCreatedDiagramID({ id: null }), []);

  const onDragStart = usePersistFunction((item: ComponentItem) => {
    const engine = getEngine();

    if (!engine || !item) return;

    engine.merge.setVirtualSource(BlockType.COMPONENT, { name: item.name, diagramID: item.id } as Realtime.NodeData<any>);
  });

  const onDragEnd = usePersistFunction(() => {
    getEngine()?.merge.reset();
  });

  const lowerCasedSearchValue = searchValue.trim().toLowerCase();

  const componentsItems = React.useMemo(() => {
    const createComponentItemFromCMS = (component: Flow): ComponentItem => ({
      id: component.diagramID,
      name: component.name,
      isFolder: false,
      children: [],
    });

    return cmsComponents.map(createComponentItemFromCMS);
  }, [folders, cmsComponents, getDiagramByID]);

  const [searchComponentsItems, searchOpenedComponents] = React.useMemo(() => {
    const items: ComponentItem[] = [];
    const openedComponents: Record<string, true> = {};

    if (!lowerCasedSearchValue) {
      return [items, openedComponents];
    }

    const matchComponentItem = (component: ComponentItem, parentItems: ComponentItem[]): void => {
      const matchedChildren: ComponentItem[] = [];

      component.children.forEach((subItem) => matchComponentItem(subItem, matchedChildren));

      if (component.name.toLowerCase().includes(lowerCasedSearchValue) && !matchedChildren.length) {
        parentItems.push(component);
      } else if (matchedChildren.length) {
        parentItems.push({ ...component, children: matchedChildren });
        openedComponents[component.id] = true;
      }
    };

    componentsItems.forEach((component) => matchComponentItem(component, items));

    return [items, openedComponents];
  }, [componentsItems, lowerCasedSearchValue]);

  return {
    onDragEnd,
    onDragStart,
    searchValue,
    setSearchValue,
    activeDiagramID,
    componentsItems,
    searchMatchValue: lowerCasedSearchValue,
    lastCreatedDiagramID,
    searchComponentsItems,
    searchOpenedComponents,
    onClearLastCreatedDiagramID,
  };
};
