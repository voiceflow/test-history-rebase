import { Channel, Language } from '@voiceflow/dtos';

export interface ICMSResponseTableTypeCell {
  responseID: string;
  language: Language;
  channel: Channel;
  isFolder?: boolean;
}
