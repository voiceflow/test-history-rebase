import type { Nullable } from '@voiceflow/common';

interface CMSEditorMoreButtonOption {
  label: string;
  onClick: VoidFunction;
}

export interface ICMSEditorMoreButton {
  options: Nullable<CMSEditorMoreButtonOption>[];
  disabled?: boolean;
}
