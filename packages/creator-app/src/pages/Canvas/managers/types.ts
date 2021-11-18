import { Node as BaseNode } from '@voiceflow/base-types';
import { WithRequired } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import React from 'react';
import { Optional, Overwrite } from 'utility-types';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { FeatureFlagMap } from '@/ducks/feature';
import { PathEntry } from '@/pages/Canvas/components/EditorSidebar/hooks';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { ConnectedStep } from '@/pages/Canvas/components/Step';
import type { Engine } from '@/pages/Canvas/engine';

import { NodeDataUpdater } from '../types';

export type PortDescriptor = Partial<Omit<Realtime.Port, 'id'>>;

interface NodeDescriptorPorts<T extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  in: PortDescriptor[];
  out: {
    dynamic: PortDescriptor[];
    builtIn: { [key in keyof T]: PortDescriptor };
  };
}

export type NodeDescriptor<T extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = Partial<
  Overwrite<Realtime.Node, { ports: NodeDescriptorPorts<T> }>
>;
export type NodeDescriptorOptionalOupPorts<T extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = Partial<
  Overwrite<Realtime.Node, { ports: Optional<NodeDescriptorPorts<T>, 'out'> }>
>;
export type NodeDescriptorOptionalInPorts<T extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = Partial<
  Overwrite<Realtime.Node, { ports: Optional<NodeDescriptorPorts<T>, 'in'> }>
>;
export type NodeDescriptorOptionalPorts<T extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = Partial<
  Overwrite<Realtime.Node, { ports: Partial<NodeDescriptorPorts<T>> }>
>;

export type GoToPath = (index: number) => void;
export type PushToPath = (entry: PathEntry) => void;

export interface NodeEditorPropsType<T, P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  data: Realtime.NodeData<T>;
  node: Realtime.Node<P>;
  engine: Engine;
  nodeID: string;
  isOpen?: boolean;
  expanded: boolean;
  onExpand: () => void;
  onChange: NodeDataUpdater<T>;
  goToPath: GoToPath;
  platform: Constants.PlatformType;
  activePath: PathEntry;
  pushToPath: PushToPath;
  popFromPath: VoidFunction;
}

export type NodeEditor<T, P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord, E = {}> = React.FC<NodeEditorPropsType<T, P> & E>;

interface NodeFactoryOptions {
  features?: FeatureFlagMap;
  platform?: Constants.PlatformType;
  defaultVoice?: string;
  canvasNodeVisibility?: BaseNode.Utils.CanvasNodeVisibility;
}

interface BaseNodeConfig<T extends object | Realtime.Markup.AnyNodeData> {
  type: BlockType;

  icon?: Icon;
  getIcon?: (data: T) => Icon;
  iconColor?: string;
  getIconColor?: (data: T) => string;

  mergeTerminator?: boolean;
  mergeInitializer?: boolean;
}

export interface NodeConfig<T extends object | Realtime.Markup.AnyNodeData, P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptor<P>; data: Creator.DataDescriptor<T> };
}

export interface NodeConfigWithoutOutPorts<T extends object | Realtime.Markup.AnyNodeData> extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptorOptionalOupPorts; data: Creator.DataDescriptor<T> };
}

export interface NodeConfigWithoutInPorts<
  T extends object | Realtime.Markup.AnyNodeData,
  P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord
> extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptorOptionalInPorts<P>; data: Creator.DataDescriptor<T> };
}

export interface NodeConfigWithoutPorts<T extends object | Realtime.Markup.AnyNodeData> extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptorOptionalPorts; data: Creator.DataDescriptor<T> };
}

export type NodeManagerConfig<
  T extends object | Realtime.Markup.AnyNodeData,
  P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord
> = BaseNodeConfig<T> & {
  tip?: string;
  label: string;
  getDataLabel?: (data: T) => string;

  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptorOptionalPorts<P>; data: Creator.DataDescriptor<T> };

  buttons?: boolean;
  reprompt?: boolean;
  platforms?: Constants.PlatformType[];
  nameEditable?: boolean;

  step: ConnectedStep<T, P>;
  editor: NodeEditor<T, P>;
  markupNode?: T extends Realtime.Markup.AnyNodeData ? React.FC<ConnectedMarkupNodeProps<T>> : never;
  editorsByPath?: Record<string, React.FC<any>>;
};

export type BasicNodeManagerConfig<
  T extends object | Realtime.Markup.AnyNodeData = {},
  P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord
> = WithRequired<Partial<NodeManagerConfig<T, P>>, 'type'>;
