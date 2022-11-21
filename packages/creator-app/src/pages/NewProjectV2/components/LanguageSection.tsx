import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { PLATFORM_PROJECT_META_MAP } from '../constants';
import LanguageSelect from './LanguageSelect';

interface LanguageSectionProps {
  nlu: Platform.Constants.NLUType | null;
  platform: Platform.Constants.PlatformType | null;
  language: GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale | null;
  setLanguage: (value: GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale | null) => void;
  alexaLocales: string[];
  setAlexaLocales: (locales: string[]) => void;
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
