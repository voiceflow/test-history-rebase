import { Link } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { Base } from '@/config/nlp';
import { NLPType } from '@/config/nlp/constants';

import { ImportLearnMoreLink } from '../constants';

interface NLPLearnMoreLinkProps {
  nlp: Base.Config;
  platform: VoiceflowConstants.PlatformType;
  fileExtensions: string[];
}

const LarnMoreButton: React.FC<{ platformLearnMoreLink: string }> = ({ platformLearnMoreLink }) => (
  <div>
    Imports must be in CSV format. <Link href={platformLearnMoreLink}>Learn more</Link>
  </div>
);

const ImportedNLPText: React.FC<{ nlpPlatformName: string; fileExtensions: string[]; platformLearnMoreLink: string }> = ({
  platformLearnMoreLink,
  fileExtensions,
  nlpPlatformName,
}) => (
  <div>
    {nlpPlatformName} imports must be {fileExtensions}. <Link href={platformLearnMoreLink}>Learn more</Link>
  </div>
);

const NLPLearnMoreLink: React.FC<NLPLearnMoreLinkProps> = ({ nlp, platform, fileExtensions }) => {
  const platformLearnMoreLink = ImportLearnMoreLink[nlp.type];
  const nlpPlatformName = nlp.name;

  if (platform === VoiceflowConstants.PlatformType.VOICEFLOW && nlp.type === NLPType.VOICEFLOW) {
    return <LarnMoreButton platformLearnMoreLink={platformLearnMoreLink} />;
  }

  return <ImportedNLPText fileExtensions={fileExtensions} nlpPlatformName={nlpPlatformName} platformLearnMoreLink={platformLearnMoreLink} />;
};

export default NLPLearnMoreLink;
