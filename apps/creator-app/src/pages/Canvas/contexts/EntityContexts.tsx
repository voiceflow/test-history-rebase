import React from 'react';

import type Engine from '@/pages/Canvas/engine';
import type { ResourceEntity } from '@/pages/Canvas/engine/entities/entity';
import LinkEntity from '@/pages/Canvas/engine/entities/linkEntity';
import NodeEntity from '@/pages/Canvas/engine/entities/nodeEntity';
import PortEntity from '@/pages/Canvas/engine/entities/portEntity';
import ThreadEntity from '@/pages/Canvas/engine/entities/threadEntity';

import { EngineContext } from './EngineContext';

const createResourceEntityProvider =
  <T extends ResourceEntity<any, any>>(
    EntityContext: React.Context<T | null>,
    EngineEntity: { new (engine: Engine, id: string): T }
  ): React.FC<React.PropsWithChildren<{ id: string }>> =>
  ({ id, children }) => {
    const engine = React.useContext(EngineContext)!;
    const entity = React.useMemo(() => new EngineEntity(engine, id), []);
    const value = entity.resolve();

    if (!value) return null;

    return <EntityContext.Provider value={entity}>{children}</EntityContext.Provider>;
  };

export const PortEntityContext = React.createContext<PortEntity | null>(null);
export const { Consumer: PortEntityConsumer } = PortEntityContext;

export const PortEntityProvider = createResourceEntityProvider(PortEntityContext, PortEntity);

export const LinkEntityContext = React.createContext<LinkEntity | null>(null);
export const { Consumer: LinkEntityConsumer } = LinkEntityContext;

export const LinkEntityProvider = createResourceEntityProvider(LinkEntityContext, LinkEntity);

export const NodeEntityContext = React.createContext<NodeEntity | null>(null);
export const { Consumer: NodeEntityConsumer } = NodeEntityContext;

export const NodeEntityProvider = createResourceEntityProvider(NodeEntityContext, NodeEntity);

export const ThreadEntityContext = React.createContext<ThreadEntity | null>(null);
export const { Consumer: ThreadEntityConsumer } = ThreadEntityContext;

export const ThreadEntityProvider = createResourceEntityProvider(ThreadEntityContext, ThreadEntity);
