import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { useAsyncEffect, useContextApi } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import client from '@/client';
import * as Diagram from '@/ducks/diagramV2';
import * as Session from '@/ducks/session';
import { useSelector, useStore } from '@/hooks/redux';

import { DiagramNodeDatabaseMap, Filters, NodeDatabaseEntry } from './types';
import { buildSearchDatabase } from './utils';

export * as SearchTypes from './types';
export * as SearchUtils from './utils';

export interface SearchContextContextValue {
  isVisible: boolean;
  toggle: () => void;
  hide: (event?: MouseEvent) => void;
  syncNodeDatabases: (databases: DiagramNodeDatabaseMap) => NodeDatabaseEntry[];
  filters: Filters;
  updateFilters: (filters: Filters) => void;
  searchBarRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const SearchContext = React.createContext<SearchContextContextValue | null>(null);
export const { Consumer: SearchConsumer } = SearchContext;

const SearchProvider: React.FC<React.PropsWithChildren<{ database?: DiagramNodeDatabaseMap | null }>> = ({
  database,
  children,
}) => {
  const searchBarRef = React.useRef<HTMLDivElement | null>(null);

  const [isVisible, toggle, hide] = useDismissable(false, { ref: searchBarRef, disableLayers: true });
  const staticDiagramDatabases = React.useRef<DiagramNodeDatabaseMap>(database ?? {});
  const store = useStore();
  const diagramIDs = useSelector(Diagram.allDiagramIDsSelector);
  const [filters, setFilters] = React.useState<Filters>({});
  const updateFilters = React.useCallback(
    (filters: Filters) => setFilters((currentFilters) => ({ ...currentFilters, ...filters })),
    []
  );

  // initialize one time ever on load of project, all the diagrams
  useAsyncEffect(async () => {
    if (database) return;

    const state = store.getState();
    const versionID = Session.activeVersionIDSelector(state);

    if (!versionID) return;

    const diagrams = await client.api.version.getDiagrams<BaseModels.Diagram.Model>(versionID);

    staticDiagramDatabases.current = buildSearchDatabase(diagrams, state);
  }, []);

  // delete any diagrams that are no longer in the project (realtime)
  React.useEffect(() => {
    const diagramIDsSet = new Set(diagramIDs);
    Object.keys(staticDiagramDatabases.current).forEach((diagramID) => {
      if (!diagramIDsSet.has(diagramID)) {
        delete staticDiagramDatabases.current[diagramID];
      }
    });
  }, [diagramIDs]);

  const syncNodeDatabases = React.useCallback((databases: DiagramNodeDatabaseMap) => {
    Object.assign(staticDiagramDatabases.current, databases);

    const newDiagramIDs = Object.keys(databases);
    // this forces new diagrams to the front
    const diagramIDs = Utils.array.unique([...newDiagramIDs, ...Object.keys(staticDiagramDatabases.current)]);

    return diagramIDs.map((diagramID) => staticDiagramDatabases.current[diagramID]).flat();
  }, []);

  const api = useContextApi({ filters, isVisible, toggle, hide, syncNodeDatabases, updateFilters, searchBarRef });

  return <SearchContext.Provider value={api}>{children}</SearchContext.Provider>;
};

export { SearchProvider };
