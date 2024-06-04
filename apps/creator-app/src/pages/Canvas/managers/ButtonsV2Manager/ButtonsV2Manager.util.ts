import { Utils } from '@voiceflow/common';
import { ButtonsV2NodeDataItem } from '@voiceflow/dtos';
import { markupFactory } from '@voiceflow/utils-designer';

export const buttonItemFactory = ({
  id = Utils.id.objectID(),
  label = markupFactory(),
}: Partial<ButtonsV2NodeDataItem> = {}): ButtonsV2NodeDataItem => ({
  id,
  label,
});
