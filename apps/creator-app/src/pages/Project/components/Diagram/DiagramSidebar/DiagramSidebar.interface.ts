import type { BlockType } from '@voiceflow/realtime-sdk';
import type { ITreeData } from '@voiceflow/ui-next/build/cjs/components/Navigation/TreeView/types';

export interface DiagramSidebarFolderMetadata {
  id: string;
  type: 'folder';
}

export interface DiagramSidebarFlowMetadata {
  id: string;
  type: 'flow';
  diagramID: string;
}

export interface DiagramSidebarWorkflowMetadata {
  id: string;
  type: 'workflow';
  diagramID: string;
}

export interface DiagramSidebarNodeMetadata {
  type: 'node';
  nodeID: string;
  nodeType: BlockType;
  diagramID: string;
}

export type DiagramSidebarAnyFlowMetadata = DiagramSidebarFolderMetadata | DiagramSidebarFlowMetadata;

export type DiagramSidebarAnyWorkflowMetadata =
  | DiagramSidebarFolderMetadata
  | DiagramSidebarWorkflowMetadata
  | DiagramSidebarNodeMetadata;

export type DiagramSidebarFlowTreeData = ITreeData<DiagramSidebarAnyFlowMetadata>;

export type DiagramSidebarWorkflowTreeData = ITreeData<DiagramSidebarAnyWorkflowMetadata>;
