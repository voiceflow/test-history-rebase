import React from 'react';
import { Overwrite } from 'utility-types';

import { BlockType, PlatformType } from '@/constants';
import * as Creator from '@/ducks/creator';
import { Markup, Node, NodeData, Port } from '@/models';
import { ConnectedMarkupNodeProps } from '@/pages/Canvas/components/MarkupNode/types';
import { ConnectedStepProps } from '@/pages/Canvas/components/Step';

export type PortDescriptor = Partial<Omit<Port, 'id'>>;

export type NodeDescriptor = Partial<Overwrite<Omit<Node, 'id'>, { ports?: Partial<Record<'in' | 'out', PortDescriptor[]>> }>>;

export type NodeEditorPropsType<T> = React.FC<{
  data: NodeData<T>;
  onChange: (value: any, save?: any) => Promise<void>;
  pushToPath?: ({ type, label }: { type: string; label: string }) => void;
}>;

export type NodeConfig<T extends object | Markup.NodeData> = {
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
  platforms?: PlatformType[];

  label: string;
  labelV2?: string;
  tip?: string;

  step: React.FC<ConnectedStepProps<T>>;
  editor: NodeEditorPropsType<T>;
  markupNode?: T extends Markup.NodeData ? React.FC<ConnectedMarkupNodeProps<T>> : never;
  editorsByPath?: Record<string, React.FC<any>>;

  factory: (
    data?: Partial<T>
  ) => {
    node: NodeDescriptor;
    data: Creator.DataDescriptor<T>;
  };
};

export type BasicNodeConfig<T extends object | Markup.NodeData = {}> = WithRequired<Partial<NodeConfig<T>>, 'type'>;
