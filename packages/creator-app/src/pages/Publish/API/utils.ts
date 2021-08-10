import { Language, Sample } from '@/components/AceEditor/Sample';

import { curl, nodeJS, python } from './constants';

// eslint-disable-next-line import/prefer-default-export
export const getSamples = (versionID?: string, apiKey?: string): Sample[] => {
  const sampleReplace = (sample: string) => {
    return sample.replace(/{{vf\.version_id}}/gi, versionID || '{version id}').replace(/{{vf\.api_key}}/gi, apiKey || '{api_key}');
  };

  return [
    {
      label: 'cURL',
      language: Language.SHELL,
      sample: sampleReplace(curl),
    },
    {
      label: 'Node.js',
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
