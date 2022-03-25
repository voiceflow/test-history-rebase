import { AlexaConstants } from '@voiceflow/alexa-types';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';

import { getPlatformOrProjectTypeMeta } from '../../constants';
import LanguageSelect from '../Select/LanguageSelect';

interface LanguageSectionProps {
  language?: GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale;
  setLanguage: (value: GoogleConstants.Language | DFESConstants.Language | VoiceflowConstants.Locale | undefined) => void;
  channel?: VoiceflowConstants.PlatformType | VoiceflowConstants.ProjectType;
  nlu?: VoiceflowConstants.PlatformType;
  alexaLocales: AlexaConstants.Locale[];
  setAlexaLocales: (locales: AlexaConstants.Locale[]) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = (props) => {
  const headerText = props.channel ? getPlatformOrProjectTypeMeta[props.channel]?.localesText : 'Language';
  return (
    <Section header={headerText} variant={SectionVariant.TERTIARY}>
      <LanguageSelect {...props} />
    </Section>
  );
};

export default LanguageSection;
