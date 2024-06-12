import {
  ReferenceResource,
  ReferenceResourceBlockNodeMetadata,
  ReferenceResourceIntentNodeMetadata,
  ReferenceResourceStartNodeMetadata,
  ReferenceResourceTriggerNodeMetadata,
} from '@voiceflow/dtos';
import { BlockType } from '@voiceflow/realtime-sdk';
interface ReferenceBaseTriggerNode {
  id: string;
  type: BlockType.INTENT | BlockType.TRIGGER | BlockType.START;
  label: string;
  nodeID: string;
  isEmpty: boolean;
  resourceID: string;
}

export interface ReferenceIntentTriggerNode extends ReferenceBaseTriggerNode {
  type: BlockType.INTENT;
  intentID: string | null;
}

export interface ReferenceTriggerTriggerNode extends ReferenceBaseTriggerNode {
  type: BlockType.TRIGGER;
  intentID: string | null;
}

export interface ReferenceStartTriggerNode extends ReferenceBaseTriggerNode {
  type: BlockType.START;
  intentID: string | null;
}

export type ReferenceAnyTriggerNode =
  | ReferenceIntentTriggerNode
  | ReferenceTriggerTriggerNode
  | ReferenceStartTriggerNode;

export type ReferenceBlockNodeResource = ReferenceResource<
  ReferenceResourceStartNodeMetadata | ReferenceResourceBlockNodeMetadata
>;

export type ReferenceTriggerNodeResource = ReferenceResource<
  ReferenceResourceStartNodeMetadata | ReferenceResourceIntentNodeMetadata | ReferenceResourceTriggerNodeMetadata
>;
