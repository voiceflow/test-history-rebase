import type { Nullable } from '@voiceflow/common';
import type { IconName } from '@voiceflow/icons';

interface CMSEditorMoreButtonOption {
  label: string;
  prefixIcon?: IconName;
  onClick: VoidFunction;
}

export interface ICMSEditorMoreButton {
  options: Nullable<CMSEditorMoreButtonOption>[];
  disabled?: boolean;
}
