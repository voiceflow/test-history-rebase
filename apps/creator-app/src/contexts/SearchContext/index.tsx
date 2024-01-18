import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useAsyncEffect, useContextApi } from '@voiceflow/ui';
import React from 'react';
import { useDismissable } from 'react-dismissable-layers';

import client from '@/client';
import * as Diagram from '@/ducks/diagramV2';
import * as Project from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { useSelector, useStore } from '@/hooks/redux';

import { Filters, NodeDatabaseEntry } from './types';
import { buildNodeDatabase } from './utils';

export * as SearchTypes from './types';
export * as SearchUtils from './utils';

type DiagramNodeDatabaseMap = Record<string, NodeDatabaseEntry[]>;

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

const SearchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const searchBarRef = React.useRef<HTMLDivElement | null>(null);

  const [isVisible, toggle, hide] = useDismissable(false, { ref: searchBarRef, disableLayers: true });
  const staticDiagramDatabases = React.useRef<DiagramNodeDatabaseMap>({});
  const store = useStore();
  const diagramIDs = useSelector(Diagram.allDiagramIDsSelector);
  const [filters, setFilters] = React.useState<Filters>({});
  const updateFilters = React.useCallback((filters: Filters) => setFilters((currentFilters) => ({ ...currentFilters, ...filters })), []);

  // initialize one time ever on load of project, all the diagrams
  useAsyncEffect(async () => {
    const state = store.getState();
    const versionID = Session.activeVersionIDSelector(state);
    const projectType = Project.active.projectTypeSelector(state);
    const platform = Project.active.platformSelector(state);

    if (!versionID) return;

    const diagrams = await client.api.version.getDiagrams<BaseModels.Diagram.Model>(versionID);
    diagrams.forEach((diagram) => {
      if (diagram.diagramID in staticDiagramDatabases.current) return;
      if (diagram.type === BaseModels.Diagram.DiagramType.TEMPLATE) return;

      const { nodes, data } = Realtime.Adapters.creatorAdapter.fromDB(diagram, { platform, projectType, context: {} });
      staticDiagramDatabases.current[diagram.diagramID] = buildNodeDatabase(
        nodes.map(({ id }) => data[id]).filter(Boolean),
        diagram.diagramID,
        state
      );
    });
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

  const api = useContextApi({ isVisible, toggle, hide, syncNodeDatabases, updateFilters, searchBarRef });

  return <SearchContext.Provider value={{ ...api, filters }}>{children}</SearchContext.Provider>;
};

export { SearchProvider };
