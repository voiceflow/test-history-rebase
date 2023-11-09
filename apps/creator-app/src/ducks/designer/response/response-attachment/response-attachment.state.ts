import type { AnyResponseAttachment } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';

export const STATE_KEY = 'attachment';

export interface ResponseAttachmentState extends Normalized<AnyResponseAttachment> {}
