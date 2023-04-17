import type { IAPLOptions } from 'apl-viewhost-web';
import React from 'react';

export interface APLRendererProps extends React.ComponentProps<'div'> {
  content: string;
  data?: string;
  commands?: string;
  onCommandFail?: (error: Error) => void;
  viewport: IAPLOptions['viewport'];
}
