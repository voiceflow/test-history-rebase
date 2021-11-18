import { Models as BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { LastCreatedComponentContext } from '@/pages/Project/contexts';

export interface ComponentItem {
  id: string;
  name: string;
  children: ComponentItem[];
  isFolder: boolean;
}

export interface ComponentsAPI {
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
  const lastCreatedComponent = React.useContext(LastCreatedComponentContext);

  const folders = useSelector(VersionV2.active.foldersSelector);
  const components = useSelector(VersionV2.active.componentsSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);

  const reorderComponents = useDispatch(Version.reorderComponents);

  const [searchValue, setSearchValue] = React.useState<string>('');

  const onClearLastCreatedDiagramID = React.useCallback(() => {
    lastCreatedComponent.setComponentID(null);
  }, []);

  const lowerCasedSearchValue = searchValue.trim().toLowerCase();

  const componentsItems = React.useMemo(() => {
    const createComponentItem = ({ type, sourceID }: BaseModels.VersionFolderItem): ComponentItem => {
      const isFolder = type === BaseModels.VersionFolderItemType.FOLDER;

      return {
        id: sourceID,
        name: isFolder ? folders[sourceID]?.name ?? '' : getDiagramByID(sourceID)?.name ?? '',
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
    searchValue,
    setSearchValue,
    activeDiagramID,
    componentsItems,
    searchMatchValue: lowerCasedSearchValue,
    onReorderComponents: reorderComponents,
    lastCreatedDiagramID: lastCreatedComponent.componentID,
    searchComponentsItems,
    searchOpenedComponents,
    onClearLastCreatedDiagramID,
  };
};
