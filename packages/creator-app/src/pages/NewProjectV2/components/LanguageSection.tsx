import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as NLU from '@/config/nlu';

import { PLATFORM_PROJECT_META_MAP } from '../constants';
import LanguageSelect from './LanguageSelect';

interface LanguageSectionProps {
  nlu: NLU.Constants.NLUType | null;
  platform: Platform.Constants.PlatformType | null;
  language: GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale | null;
  setLanguage: (value: GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale | null) => void;
  alexaLocales: AlexaConstants.Locale[];
  setAlexaLocales: (locales: AlexaConstants.Locale[]) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = (props) => {
  const channel = props.nlu ?? props.platform;
  const headerText = channel ? PLATFORM_PROJECT_META_MAP[channel]?.localesText : 'Language';

  return (
    <Section
      header={headerText}
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '32px' }}
    >
      <LanguageSelect {...props} />
    </Section>
  );
};

export default LanguageSection;
