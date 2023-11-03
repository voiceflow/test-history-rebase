import type { Channel, Language, ObjectResource } from '@/common';

export interface ResponseDiscriminator extends ObjectResource {
  channel: Channel;
  language: Language;
  responseID: string;
  assistantID: string;
  variantOrder: string[];
  environmentID: string;
}
