import { IButton } from '@voiceflow/ui-next';
import React from 'react';

export interface IConformV2Modal {
  body: React.ReactNode;
  title: string;
  confirm?: () => void | Promise<void>;
  cancelButtonLabel?: string | null;
  confirmButtonLabel?: string;
  cancelButtonVariant?: IButton['variant'];
  confirmButtonVariant?: IButton['variant'];
}
