import type { Nullable } from '@voiceflow/common';
import type React from 'react';

export interface AIGenerateBaseButtonOption {
  id: string;
  label: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export interface IAIGenerateBaseButton<Option extends AIGenerateBaseButtonOption = AIGenerateBaseButtonOption> {
  options: Nullable<Option>[];
  subtext?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: string;
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  hoverOpen?: boolean;
  testID?: string;
}
