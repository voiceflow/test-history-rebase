import { Version as DBVersion, VersionPlatformData } from '@voiceflow/api-sdk';
import { Version as VoiceVersion } from '@voiceflow/voice-types';

import { Nullable } from '@/types';

export { DBVersion };

export interface Version<P extends VersionPlatformData<VoiceVersion.VoiceVersionSettings<string>, any>>
  extends Pick<DBVersion<P>, 'creatorID' | 'variables' | 'projectID' | 'rootDiagramID'> {
  id: string;
  status: Nullable<P['status']>;
  session: Nullable<Version.Session>;
  settings: Omit<P['settings'], 'session'>;
  publishing: P['publishing'];
}

export namespace Version {
  export interface Session {
    restart: boolean;
    resumePrompt: {
      voice: Nullable<string>;
      content: string;
      followVoice: Nullable<string>;
      followContent: Nullable<string>;
    };
  }
}
