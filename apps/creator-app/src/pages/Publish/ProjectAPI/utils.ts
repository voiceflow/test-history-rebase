import { Language, Sample } from '@/components/CodePreview/Samples';

import { curl } from './constants';

export const getSamples = (versionID?: string, apiEndpoint?: string, apiKey?: string): Sample[] => {
  const sampleReplace = (sample: string) => {
    return sample
      .replace(/{{vf\.api_key}}/gi, apiKey || '{api_key}')
      .replace(/{{api-endpoint}}/gi, apiEndpoint || 'https://api.voiceflow.com')
      .replace(/{{vf\.version_id}}/gi, versionID || '{version_id}');
  };

  return [
    {
      label: 'cURL',
      language: Language.SHELL,
      sample: sampleReplace(curl),
    },
  ];
};
