import type { IContextMenu } from '@voiceflow/ui-next';

export interface IResponseAttachmentContextMenu extends Omit<IContextMenu, 'children'> {
  onRemove: VoidFunction;
  onDuplicate: VoidFunction;
}
