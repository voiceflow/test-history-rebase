import React from 'react';
import { Overwrite } from 'utility-types';

import { BlockType, PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { Markup, Node, NodeData, Port } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step';

import { NodeDataUpdater } from '../types';

export type PortDescriptor = Partial<Omit<Port, 'id'>>;

export type NodeDescriptor = Partial<Overwrite<Omit<Node, 'id'>, { ports?: Partial<Record<'in' | 'out', PortDescriptor[]>> }>>;

export type NodeEditorPropsType<T> = {
  nodeID: string;
  data: NodeData<T>;
  onChange: NodeDataUpdater<T>;
  pushToPath?: ({ type, label }: { type: string; label: string }) => void;
  focusedNode?: NodeDescriptor;
  isOpen?: boolean;
};

export type NodeEditor<T> = React.FC<NodeEditorPropsType<T>>;

export type NodeConfig<T extends object | Markup.AnyNodeData> = {
  type: BlockType;
  icon?: string | React.FC;
  iconColor?: string;
  getIcon?: (data: T) => string | React.FC;
  getIconColor?: (data: T) => string;
  reprompt?: boolean;
  chips?: boolean;
  mergeInitializer?: boolean;
  mergeTerminator?: boolean;
  platformDependent?: boolean;
  nameEditable?: boolean;
  platforms?: PlatformType[];

  label: string;
  tip?: string;

  step: React.FC<ConnectedStepProps<T>>;
  editor: NodeEditor<T>;
  markupNode?: T extends Markup.AnyNodeData ? React.FC<ConnectedMarkupNodeProps<T>> : never;
  editorsByPath?: Record<string, React.FC<any>>;

  factory: (
    data?: Partial<T>
  ) => {
    node: NodeDescriptor;
    data: Creator.DataDescriptor<T>;
  };
};

export type BasicNodeConfig<T extends object | Markup.AnyNodeData = {}> = WithRequired<Partial<NodeConfig<T>>, 'type'>;
