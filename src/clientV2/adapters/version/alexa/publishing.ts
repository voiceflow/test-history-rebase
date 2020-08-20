import { AlexaPublishing, defaultAlexaPublishing } from '@voiceflow/alexa-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

type SkillPublishing = Pick<
  FullSkill['meta'],
  | 'summary'
  | 'description'
  | 'keywords'
  | 'invocations'
  | 'category'
  | 'purchase'
  | 'personal'
  | 'copa'
  | 'ads'
  | 'export'
  | 'instructions'
  | 'stage'
  | 'smallIcon'
  | 'largeIcon'
  | 'termsAndCond'
  | 'privacyPolicy'
  | 'invName'
>;

const alexaPublishingAdapter = createAdapter<AlexaPublishing, SkillPublishing>(
  (publishing) => {
    const {
      summary,
      description,
      keywords,
      invocations,
      category,
      hasPurchase,
      personal,
      hasAds,
      forChildren,
      forExport,
      instructions,
      smallIcon,
      largeIcon,
      termsAndConditions,
      privacyPolicy,
      invocationName,
    } = defaultAlexaPublishing(publishing);

    return {
      summary,
      description,
      keywords,
      invocations: { value: invocations || [] },
      category,
      purchase: hasPurchase,
      personal,
      copa: forChildren,
      ads: hasAds,
      export: forExport,
      instructions,
      stage: 0,
      smallIcon,
      largeIcon,
      termsAndCond: termsAndConditions,
      privacyPolicy,
      invName: invocationName,
    };
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default alexaPublishingAdapter;
