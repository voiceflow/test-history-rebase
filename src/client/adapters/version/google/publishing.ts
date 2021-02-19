import { defaultGoogleVersionPublishing, GoogleVersionPublishing, Locale } from '@voiceflow/google-types';

import { createAdapter } from '@/client/adapters/utils';
import { FullSkill } from '@/models';

type SkillPublishing = Pick<
  FullSkill<Locale>['meta'],
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
  | 'locales'
>;

const googlePublishingAdapter = createAdapter<GoogleVersionPublishing, SkillPublishing>(
  (publishing) => {
    const {
      pronunciation,
      locales,
      shortDescription,
      fullDescription,
      category,
      privacyPolicyUrl,
      smallLogoImage,
      sampleInvocations,
      termsOfServiceUrl,
    } = defaultGoogleVersionPublishing(publishing);

    return {
      summary: shortDescription,
      description: fullDescription,
      invocations: sampleInvocations,
      smallIcon: smallLogoImage,
      category: category || null,
      termsAndCond: termsOfServiceUrl,
      privacyPolicy: privacyPolicyUrl,
      invName: pronunciation,
      purchase: false,
      personal: false,
      keywords: '',
      copa: false,
      ads: false,
      export: false,
      instructions: '',
      stage: 0,
      largeIcon: '',
      locales,
      updatesDescription: '',
    };
  },
  (skillPublishing) => {
    const {
      summary: shortDescription,
      description: fullDescription,
      invocations: sampleInvocations,
      smallIcon: smallLogoImage,
      category,
      termsAndCond: termsOfServiceUrl,
      privacyPolicy: privacyPolicyUrl,
      invName: pronunciation,
    } = skillPublishing;

    return {
      shortDescription,
      fullDescription,
      sampleInvocations,
      smallLogoImage,
      termsOfServiceUrl,
      privacyPolicyUrl,
      pronunciation,
      category,
    } as any;
  }
);

export default googlePublishingAdapter;
