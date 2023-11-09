import type { AnyAttachment, AttachmentType } from '@voiceflow/dtos';
import type { IPopper } from '@voiceflow/ui-next/build/cjs/components/Utility/Popper/Popper.interface';

import type { MediaType } from '@/components/MediaLibrary/MediaLibrary.enum';

export type View = 'type-menu' | `media-${MediaType}` | `library-${MediaType}`;

export interface IResponseAttachmentPopper extends Omit<IPopper<unknown>, 'children'> {
  attachment?: AnyAttachment;
  initialView?: View;
  onAttachmentSelect: (data: { id: string; type: AttachmentType }) => void;
}
