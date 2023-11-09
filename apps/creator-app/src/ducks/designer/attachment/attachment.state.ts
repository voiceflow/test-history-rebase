import type { AnyAttachment } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'attachment';

export interface AttachmentState extends Normalized<AnyAttachment> {}
