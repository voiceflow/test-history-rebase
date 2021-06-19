import { Language, Sample } from '@/components/AceEditor/Sample';
import { conditionalReplace } from '@/utils/string';

import { curl, nodeJS, python } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const getSamples = (versionID?: string, apiKey?: string): Sample[] => {
  const sampleReplace = (sample: string) => {
    return conditionalReplace(conditionalReplace(sample, /{versionID}/g, versionID), /{apiKey}/g, apiKey);
  };

  return [
    {
      label: 'cURL',
      language: Language.JAVASCRIPT,
      sample: sampleReplace(curl),
    },
    {
      label: 'NodeJS',
      language: Language.JAVASCRIPT,
      sample: sampleReplace(nodeJS),
    },
    {
      label: 'Python',
      language: Language.PYTHON,
      sample: sampleReplace(python),
    },
  ];
};
