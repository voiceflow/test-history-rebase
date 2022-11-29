import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import LocalesSelect from '@/components/LocalesSelect';
import Section, { SectionVariant } from '@/components/Section';

interface LanguageSectionProps {
  type: Platform.Constants.ProjectType | null;
  locales: string[];
  platform: Platform.Constants.PlatformType | null;
  onLocalesChange: (locales: string[]) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ type, locales, platform, onLocalesChange }) => {
  const projectConfig = Platform.Config.getTypeConfig({
    type: type ?? Platform.Constants.ProjectType.VOICE,
    platform: platform ?? Platform.Constants.PlatformType.VOICEFLOW,
  });

  return (
    <Section
      header={projectConfig.project.locale.name}
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '32px' }}
    >
      <LocalesSelect type={type} platform={platform} locales={locales} onChange={onLocalesChange} />
    </Section>
  );
};

export default LanguageSection;
