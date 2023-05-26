import { Language, Sample } from '@/components/CodePreview/Samples';

import { curl } from './constants';

export const getSamples = (generalServiceEndpoint?: string, apiKey?: string): Sample[] => {
  const sampleReplace = (sample: string) => {
    return sample
      .replace(/{{vf\.api_key}}/gi, apiKey || '{api_key}')
      .replace(/{{general-service-endpoint}}/gi, generalServiceEndpoint || 'https://general-runtime.voiceflow.com');
  };

  return [
    {
      label: 'cURL',
      language: Language.SHELL,
      sample: sampleReplace(curl),
    },
  ];
};
