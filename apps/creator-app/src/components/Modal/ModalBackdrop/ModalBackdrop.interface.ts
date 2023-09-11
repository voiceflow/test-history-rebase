import type { VariantProps } from '@voiceflow/style';

import type { backdrop } from './ModalBackdrop.css';

export interface IModalBackdrop extends VariantProps<typeof backdrop> {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
