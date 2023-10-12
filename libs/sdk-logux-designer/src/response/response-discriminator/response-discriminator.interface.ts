import type { Channel, Language, ObjectResource } from '@/common';

export interface ResponseDiscriminator extends ObjectResource {
  language: Language;
  channel: Channel;
  variantOrder: string[];
  responseID: string;
  assistantID: string;
}
