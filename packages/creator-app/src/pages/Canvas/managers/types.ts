import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Icon, OptionsMenuOption } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { ExtractRouteParams } from 'react-router';
import { Optional, Overwrite } from 'utility-types';

import { Scrollbars } from '@/components/CustomScrollbars';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { FeatureFlagMap } from '@/ducks/feature';
import { PathEntry } from '@/pages/Canvas/components/EditorSidebar/hooks';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { ConnectedStep } from '@/pages/Canvas/components/Step';
import type Engine from '@/pages/Canvas/engine';

import { EditorAnimationEffect } from '../constants';
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
  platform: VoiceflowConstants.PlatformType;
  activePath: PathEntry;
  pushToPath: PushToPath;
  projectType: VoiceflowConstants.ProjectType;
  popFromPath: VoidFunction;
}

export type NodeEditor<T, P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord, E = {}> = React.FC<NodeEditorPropsType<T, P> & E>;

interface GoBack {
  <S extends string>(path?: S): void;
  <S extends string>(config: { path: S; params?: ExtractRouteParams<S> }): void;
}

interface GoToNested {
  <S extends string>(path: S): void;
  <S extends string>(config: { path: S; params?: ExtractRouteParams<S>; animationEffect?: EditorAnimationEffect }): void;
}

export interface NodeEditorV2Props<Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  data: Realtime.NodeData<Data>;
  node: Realtime.Node<BuiltInPorts>;
  label: string;
  isRoot: boolean;
  engine: Engine;
  nodeID: string;
  goBack: GoBack;
  isOpened: boolean;
  platform: VoiceflowConstants.PlatformType;
  onExpand: VoidFunction;
  onChange: (value: Partial<Realtime.NodeData<Data>>, save?: boolean) => Promise<void>;
  goToRoot: (animationEffect?: EditorAnimationEffect) => void;
  isExpanded: boolean;
  scrollbars: React.RefObject<Scrollbars>;
  goToNested: GoToNested;
  projectType: VoiceflowConstants.ProjectType;
}

export type NodeEditorV2<Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = React.FC<
  NodeEditorV2Props<Data, BuiltInPorts>
>;

interface NodeFactoryOptions {
  features?: FeatureFlagMap;
  platform?: VoiceflowConstants.PlatformType;
  projectType?: VoiceflowConstants.ProjectType;
  defaultVoice?: string;
  canvasNodeVisibility?: BaseNode.Utils.CanvasNodeVisibility;
}

export type NodeManagerFactory<Data extends object, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = (
  data?: Partial<Data>,
  options?: NodeFactoryOptions
) => { node: NodeDescriptorOptionalPorts<BuiltInPorts>; data: Creator.DataDescriptor<Data> };

interface BaseNodeConfig<Data extends object> {
  type: BlockType;
  icon?: Icon;
  getIcon?: (data: Data) => Icon;
  factory?: NodeManagerFactory<Data, any>;

  mergeTerminator?: boolean;
  mergeInitializer?: boolean;
}

export interface NodeConfig<T extends object, P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptor<P>; data: Creator.DataDescriptor<T> };
}

export interface NodeConfigWithoutOutPorts<T extends object> extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptorOptionalOupPorts; data: Creator.DataDescriptor<T> };
}

export interface NodeConfigWithoutInPorts<T extends object, P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptorOptionalInPorts<P>; data: Creator.DataDescriptor<T> };
}

export interface NodeConfigWithoutPorts<T extends object> extends BaseNodeConfig<T> {
  factory: (data?: Partial<T>, options?: NodeFactoryOptions) => { node: NodeDescriptorOptionalPorts; data: Creator.DataDescriptor<T> };
}

export interface BaseNodeManagerConfig<Data extends object, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseNodeConfig<Data> {
  label?: string;
  getDataLabel?: (data: Data) => string;

  platforms?: VoiceflowConstants.PlatformType[];
  projectTypes?: VoiceflowConstants.ProjectType[];

  editorV2?: NodeEditorV2<Data, BuiltInPorts>;

  /**
   * @deprecated use editorV2 instead
   */
  editor?: NodeEditor<Data, BuiltInPorts>;

  /**
   * @deprecated use nested routes instead
   */
  editorsByPath?: Record<string, React.FC<any>>;
}

export interface NodeManagerConfig<Data extends object, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseNodeManagerConfig<Data, BuiltInPorts> {
  label: string;
  factory: NodeManagerFactory<Data, BuiltInPorts>;

  step: ConnectedStep<Data, BuiltInPorts>;
  /**
   * @deprecated use editorV2 instead
   */
  editor: NodeEditor<Data, BuiltInPorts>;
}

export interface NodeManagerConfigV2<Data extends object, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseNodeManagerConfig<Data, BuiltInPorts> {
  label: string;
  factory: NodeManagerFactory<Data, BuiltInPorts>;

  step: ConnectedStep<Data, BuiltInPorts>;
  editorV2: NodeEditorV2<Data, BuiltInPorts>;
}

export interface MarkupNodeManagerConfig<Data extends object, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseNodeManagerConfig<Data, BuiltInPorts> {
  factory: NodeManagerFactory<Data, BuiltInPorts>;
  markupNode: Data extends Realtime.Markup.AnyNodeData ? React.FC<ConnectedMarkupNodeProps<Data>> : never;
}

export interface OptionalSectionConfig {
  option: OptionsMenuOption | null;
  section: React.ReactNode | false;
}
