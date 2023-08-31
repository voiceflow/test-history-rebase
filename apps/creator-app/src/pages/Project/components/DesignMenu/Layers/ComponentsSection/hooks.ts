import { BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { BlockType } from '@/constants';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useDnDReorder } from '@/hooks/dnd';
import { useEventualEngine } from '@/hooks/engine';
import { useDispatch, useLocalDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';

export interface ComponentItem {
  id: string;
  name: string;
  children: ComponentItem[];
  isFolder: boolean;
}

export interface ComponentsAPI {
  onDragEnd: (item: ComponentItem) => void;
  onDragStart: (item: ComponentItem) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  componentsItems: ComponentItem[];
  activeDiagramID: Nullable<string>;
  searchMatchValue: string;
  onReorderComponents: (from: number, to: number) => void;
  lastCreatedDiagramID: Nullable<string>;
  searchComponentsItems: ComponentItem[];
  searchOpenedComponents: Record<string, true>;
  onClearLastCreatedDiagramID: VoidFunction;
}

export const useComponents = (): ComponentsAPI => {
  const folders = useSelector(VersionV2.active.foldersSelector);
  const components = useSelector(VersionV2.active.componentsSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const lastCreatedDiagramID = useSelector(DiagramV2.lastCreatedIDSelector);

  const reorderComponents = useDispatch(VersionV2.reorderComponents);
  const setLastCreatedDiagramID = useLocalDispatch(DiagramV2.setLastCreatedID);

  const getEngine = useEventualEngine();

  const dndReorder = useDnDReorder({
    getID: (item: ComponentItem) => item.id,
    onPersist: (fromID: string, toIndex: number) => reorderComponents({ fromID, toIndex }),
    onReorder: (fromID: string, toIndex: number) => reorderComponents({ fromID, toIndex, skipPersist: true }),
  });

  const [searchValue, setSearchValue] = React.useState<string>('');

  const onClearLastCreatedDiagramID = React.useCallback(() => setLastCreatedDiagramID({ id: null }), []);

  const onDragStart = usePersistFunction((item: ComponentItem) => {
    const engine = getEngine();

    dndReorder.onStart(item);

    if (!engine || !item) return;

    engine.merge.setVirtualSource(BlockType.COMPONENT, { name: item.name, diagramID: item.id } as Realtime.NodeData<any>);
  });

  const onDragEnd = usePersistFunction(() => {
    dndReorder.onEnd();
    getEngine()?.merge.reset();
  });

  const lowerCasedSearchValue = searchValue.trim().toLowerCase();

  const componentsItems = React.useMemo(() => {
    const createComponentItem = ({ type, sourceID }: BaseModels.Version.FolderItem): ComponentItem => {
      const isFolder = type === BaseModels.Version.FolderItemType.FOLDER;

      return {
        id: sourceID,
        name: isFolder ? folders[sourceID]?.name ?? '' : getDiagramByID({ id: sourceID })?.name ?? '',
        isFolder,
        children: isFolder ? folders[sourceID]?.items.map(createComponentItem) ?? [] : [],
      };
    };

    return components.map(createComponentItem);
  }, [folders, components, getDiagramByID]);

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
    onReorderComponents: dndReorder.onReorder,
    lastCreatedDiagramID,
    searchComponentsItems,
    searchOpenedComponents,
    onClearLastCreatedDiagramID,
  };
};
