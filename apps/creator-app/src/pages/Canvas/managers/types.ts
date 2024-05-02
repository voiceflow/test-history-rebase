import type { BaseNode } from '@voiceflow/base-types';
import type { EmptyObject, Nullable, Struct } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config';
import type * as Realtime from '@voiceflow/realtime-sdk';
import type { CustomScrollbarsTypes, OptionsMenuOption, SvgIconTypes } from '@voiceflow/ui';
import type React from 'react';
import type { ExtractRouteParams, match } from 'react-router';
import type { Optional, Overwrite } from 'utility-types';

import type { BlockType, HSLShades } from '@/constants';
import type { NodeCategory } from '@/contexts/SearchContext/types';
import type * as CreatorV2 from '@/ducks/creatorV2';
import type { FeatureFlagMap } from '@/ducks/feature';
import type { PathEntry } from '@/pages/Canvas/components/EditorSidebar/hooks';
import type { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import type Engine from '@/pages/Canvas/engine';
import type { NodeEntityResource } from '@/pages/Canvas/engine/entities/nodeEntity';
import type { State } from '@/store/types';

import type { EditorAnimationEffect } from '../constants';
import type { NodeDataUpdater } from '../types';

export { NodeEntityResource };

export type PortDescriptor = Partial<Omit<Realtime.Port, 'id'>>;

interface BaseConnectedProps<T, O extends Realtime.BuiltInPortRecord> {
  data: Realtime.NodeData<T>;
  ports: Realtime.NodePorts<O>;
  engine: Engine;
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
}

interface BaseConnectedStepProps<T, O extends Realtime.BuiltInPortRecord> extends BaseConnectedProps<T, O> {
  withPorts: boolean;
}

export interface ConnectedStepProps<T = EmptyObject, O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseConnectedStepProps<T, O> {
  palette: HSLShades;
  isLast?: boolean;
}

export type ConnectedStep<
  T = EmptyObject,
  O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> = React.FC<ConnectedStepProps<T, O>>;

export interface ConnectedActionProps<
  T = EmptyObject,
  O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> extends BaseConnectedStepProps<T, O> {
  reversed?: boolean;
  isActive?: boolean;
  onRemove: VoidFunction;
  sourceNodeID: string;
  sourcePortID: string;
  onOpenEditor: (routState?: Struct) => void;
}

export type ConnectedAction<
  T = EmptyObject,
  O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> = React.FC<ConnectedActionProps<T, O>>;

export interface ConnectedChipProps<T = EmptyObject, O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseConnectedProps<T, O> {}

export type ConnectedChip<
  T = EmptyObject,
  O extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> = React.FC<ConnectedChipProps<T, O>>;

interface NodeDescriptorPorts<T extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  in: PortDescriptor[];
  out: {
    byKey: Record<string, PortDescriptor>;
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
  nluType: Platform.Constants.NLUType;
  expanded: boolean;
  onExpand: () => void;
  onChange: NodeDataUpdater<T>;
  goToPath: GoToPath;
  platform: Platform.Constants.PlatformType;
  activePath: PathEntry;
  pushToPath: PushToPath;
  projectType: Platform.Constants.ProjectType;
  popFromPath: VoidFunction;
}

export type NodeEditor<
  T,
  P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
  E = EmptyObject,
> = React.FC<NodeEditorPropsType<T, P> & E>;

interface GoBack {
  <S extends string>(path?: S): void;
  <S extends string>(config: { path: S; params?: ExtractRouteParams<S> }): void;
}

interface GoTo {
  <S extends string>(path: S): void;
  <S extends string>(config: {
    path: S;
    state?: Record<string, unknown>;
    params?: ExtractRouteParams<S>;
    animationEffect?: EditorAnimationEffect;
  }): void;
}

interface SharedEditorProps<Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> {
  data: Realtime.NodeData<Data>;
  node: Realtime.Node<BuiltInPorts>;
  nodeID: string;
  onChange: (value: Partial<Realtime.NodeData<Data>>) => Promise<void>;
}

export interface NodeEditorV2Props<Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends SharedEditorProps<Data, BuiltInPorts> {
  label: string;
  isRoot: boolean;
  engine: Engine;
  goBack: GoBack;
  isOpened: boolean;
  platform: Platform.Constants.PlatformType;
  goToRoot: (animationEffect?: EditorAnimationEffect) => void;
  scrollbars: React.RefObject<CustomScrollbarsTypes.Scrollbars>;
  goToNested: GoTo;
  goToSibling: GoTo;
  projectType: Platform.Constants.ProjectType;
  isFullscreen: boolean;
  parentBlockData: Nullable<Realtime.NodeData<Realtime.NodeData.Combined>>;
  onToggleFullscreen: VoidFunction;
  onChangeParentBlock: (value: Partial<Realtime.NodeData<Realtime.NodeData.Combined>>) => Promise<void>;
}

export type NodeEditorV2<Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = React.FC<
  NodeEditorV2Props<Data, BuiltInPorts>
>;
export interface ActionEditorProps<Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends NodeEditorV2Props<Data, BuiltInPorts> {
  parentMatch: match & { parentUrl: string; parentPath: string };
  parentEditor: SharedEditorProps<unknown>;
}

export type ActionEditor<Data, BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord> = React.FC<
  ActionEditorProps<Data, BuiltInPorts>
>;

interface NodeFactoryOptions {
  features?: FeatureFlagMap;
  platform?: Platform.Constants.PlatformType;
  projectType?: Platform.Constants.ProjectType;
  defaultVoice?: string;
  canvasNodeVisibility?: BaseNode.Utils.CanvasNodeVisibility;
  allCustomBlocks?: Realtime.CustomBlock[];
}

export type NodeManagerFactory<
  Data extends object,
  BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> = (
  data?: Partial<Data & { name: string }>,
  options?: NodeFactoryOptions
) => { node: NodeDescriptorOptionalPorts<BuiltInPorts>; data: CreatorV2.DataDescriptor<Data> };

interface BaseNodeConfig<Data extends object> {
  type: BlockType;
  icon?: SvgIconTypes.Icon;
  getIcon?: (data: Data) => SvgIconTypes.Icon;
  factory?: NodeManagerFactory<Data, any>;

  searchIcon?: SvgIconTypes.Icon;
  searchCategory?: NodeCategory;
  getSearchParams?: (data: Data, store: State) => string[];

  mergeTerminator?: boolean;
  mergeInitializer?: boolean;

  getTooltipText?: (data: Data) => string;
  getTooptipLink?: (data: Data) => string;
  tooltipText?: string;
  tooltipLink?: string;
  isMergeTerminator?: (nodeEntity: NodeEntityResource<Data | unknown>) => boolean;
}

export interface NodeConfig<T extends object, P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord>
  extends BaseNodeConfig<T> {
  factory: (
    data?: Partial<T & { name: string }>,
    options?: NodeFactoryOptions
  ) => { node: NodeDescriptor<P>; data: CreatorV2.DataDescriptor<T> };
}

export interface NodeConfigWithoutOutPorts<T extends object> extends BaseNodeConfig<T> {
  factory: (
    data?: Partial<T & { name: string }>,
    options?: NodeFactoryOptions
  ) => { node: NodeDescriptorOptionalOupPorts; data: CreatorV2.DataDescriptor<T> };
}

export interface NodeConfigWithoutInPorts<
  T extends object,
  P extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> extends BaseNodeConfig<T> {
  factory: (
    data?: Partial<T & { name: string }>,
    options?: NodeFactoryOptions
  ) => { node: NodeDescriptorOptionalInPorts<P>; data: CreatorV2.DataDescriptor<T> };
}

export interface NodeConfigWithoutPorts<T extends object> extends BaseNodeConfig<T> {
  factory: (
    data?: Partial<T & { name: string }>,
    options?: NodeFactoryOptions
  ) => { node: NodeDescriptorOptionalPorts; data: CreatorV2.DataDescriptor<T> };
}

export interface BaseNodeManagerConfig<
  Data extends object,
  BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> extends BaseNodeConfig<Data> {
  label?: string;
  getDataLabel?: (data: Data) => string;

  platforms?: Platform.Constants.PlatformType[];
  projectTypes?: Platform.Constants.ProjectType[];

  editorV2?: NodeEditorV2<Data, BuiltInPorts>;
  editorV3?: NodeEditorV2<Data, BuiltInPorts>;
  actionEditor?: ActionEditor<Data, BuiltInPorts>;

  /**
   * @deprecated use editorV2 instead
   */
  editor?: NodeEditor<Data, BuiltInPorts> | null;

  /**
   * @deprecated use nested routes instead
   */
  editorsByPath?: Record<string, React.FC<any>>;

  step?: ConnectedStep<Data, BuiltInPorts>;
  chip?: ConnectedChip<Data, BuiltInPorts>;

  featureFlagOverrides?:
    | Partial<NodeManagerConfig<Data, BuiltInPorts>>
    | Partial<NodeManagerConfigV2<Data, BuiltInPorts>>;
  editorV3FeaturFlag?: Realtime.FeatureFlag;
}

export interface NodeManagerConfig<
  Data extends object,
  BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> extends BaseNodeManagerConfig<Data, BuiltInPorts> {
  label: string;
  factory: NodeManagerFactory<Data, BuiltInPorts>;

  step: ConnectedStep<Data, BuiltInPorts>;
  action?: ConnectedAction<Data, BuiltInPorts>;

  /**
   * @deprecated use editorV2 instead
   */
  editor: NodeEditor<Data, BuiltInPorts>;

  featureFlagOverrides?:
    | Partial<NodeManagerConfig<Data, BuiltInPorts>>
    | Partial<NodeManagerConfigV2<Data, BuiltInPorts>>;
}

export interface NodeManagerConfigV2<
  Data extends object,
  BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> extends BaseNodeManagerConfig<Data, BuiltInPorts> {
  label: string;
  factory: NodeManagerFactory<Data, BuiltInPorts>;

  step: ConnectedStep<Data, BuiltInPorts>;
  action?: ConnectedAction<Data, BuiltInPorts>;
  editorV2: NodeEditorV2<Data, BuiltInPorts>;

  featureFlagOverrides?: Partial<NodeManagerConfigV2<Data, BuiltInPorts>>;
}

export interface NodeManagerConfigV3<
  Data extends object,
  BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> extends BaseNodeManagerConfig<Data, BuiltInPorts> {
  label: string;
  factory: NodeManagerFactory<Data, BuiltInPorts>;

  step: ConnectedStep<Data, BuiltInPorts>;
  action?: ConnectedAction<Data, BuiltInPorts>;

  editorV2?: NodeEditorV2<Data, BuiltInPorts>;
  editorV3: NodeEditorV2<Data, BuiltInPorts>;

  featureFlagOverrides?: Partial<NodeManagerConfigV2<Data, BuiltInPorts>>;
}

export interface MarkupNodeManagerConfig<
  Data extends object,
  BuiltInPorts extends Realtime.BuiltInPortRecord = Realtime.BuiltInPortRecord,
> extends BaseNodeManagerConfig<Data, BuiltInPorts> {
  factory: NodeManagerFactory<Data, BuiltInPorts>;
  markupNode: Data extends Realtime.Markup.AnyNodeData ? React.FC<ConnectedMarkupNodeProps<Data>> : never;
}

export interface OptionalSectionConfig {
  option: OptionsMenuOption | null;
  section: React.ReactNode | false;
}
export type ManagerConfig = NodeManagerConfig<any, any> | BaseNodeManagerConfig<any, any>;
