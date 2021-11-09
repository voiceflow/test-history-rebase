import { Node as BaseNode } from '@voiceflow/base-types';
import { WithRequired } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon } from '@voiceflow/ui';
import React from 'react';
import { Overwrite } from 'utility-types';

import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { FeatureFlagMap } from '@/ducks/feature';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step';

import { NodeDataUpdater } from '../types';

export type PortDescriptor = Partial<Omit<Realtime.Port, 'id'>>;

export type NodeDescriptor = Partial<Overwrite<Realtime.Node, { ports?: Partial<Record<'in' | 'out', PortDescriptor[]>> }>>;

export type PushToPath = ({ type, label }: { type: string; label: string }) => void;

export interface NodeEditorPropsType<T> {
  nodeID: string;
  data: Realtime.NodeData<T>;
  onChange: NodeDataUpdater<T>;
  pushToPath?: PushToPath;
  focusedNode?: NodeDescriptor;
  isOpen?: boolean;
  expanded: boolean;
  onExpand: () => void;
}

export type NodeEditor<T, E = {}> = React.FC<NodeEditorPropsType<T> & E>;

interface NodeFactoryOptions {
  features?: FeatureFlagMap;
  platform?: Constants.PlatformType;
  defaultVoice?: string;
  canvasNodeVisibility?: BaseNode.Utils.CanvasNodeVisibility;
}

export interface NodeConfig<T extends object | Realtime.Markup.AnyNodeData> {
  type: BlockType;

  icon?: Icon;
  getIcon?: (data: T) => Icon;
  iconColor?: string;
  getIconColor?: (data: T) => string;

  mergeTerminator?: boolean;
  mergeInitializer?: boolean;

  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptor; data: Creator.DataDescriptor<T> };
}

export type NodeManagerConfig<T extends object | Realtime.Markup.AnyNodeData> = NodeConfig<T> & {
  tip?: string;
  label: string;
  getDataLabel?: (data: T) => string;

  buttons?: boolean;
  reprompt?: boolean;
  platforms?: Constants.PlatformType[];
  nameEditable?: boolean;

  step: React.FC<ConnectedStepProps<T>>;
  editor: NodeEditor<T>;
  markupNode?: T extends Realtime.Markup.AnyNodeData ? React.FC<ConnectedMarkupNodeProps<T>> : never;
  editorsByPath?: Record<string, React.FC<any>>;
};

export type BasicNodeManagerConfig<T extends object | Realtime.Markup.AnyNodeData = {}> = WithRequired<Partial<NodeManagerConfig<T>>, 'type'>;
