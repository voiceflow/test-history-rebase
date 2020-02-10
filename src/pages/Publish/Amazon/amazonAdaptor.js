import _ from 'lodash';

import { AMAZON_CATEGORIES } from '@/services/Categories';

const amazonAdaptor = {
  fromDB: ({
    export: resExport,
    summary,
    description,
    keywords,
    invocations,
    category,
    purchase,
    personal,
    copa,
    ads,
    instructions,
    privacy_policy,
    terms_and_cond,
    updates_description,
    inv_name,
    small_icon,
    large_icon,
    name,
    live,
    locales,
  }) => {
    let resInvocations = invocations;
    let resCategory = category;
    if (category) {
      // eslint-disable-next-line no-restricted-syntax
      for (const option of AMAZON_CATEGORIES) {
        if (option.value === category) {
          resCategory = option;
          break;
        }
      }
    }

    if (invocations && invocations.value) {
      resInvocations = invocations.value;
    }

    if (!Array.isArray(resInvocations) || resInvocations.length === 0) {
      resInvocations = [''];
    }

    return {
      name,
      live,
      locales,
      export: resExport,
      summary,
      description,
      keywords: keywords || '',
      invocations: resInvocations,
      category: resCategory,
      purchase,
      personal,
      copa,
      ads,
      instructions,
      privacyPolicy: !_.isEmpty(privacy_policy) ? privacy_policy : '',
      termsAndCond: terms_and_cond,
      updatesDescription: updates_description,
      invName: inv_name,
      smallIcon: small_icon,
      largeIcon: large_icon,
    };
  },
  toStore: (state, form) => ({
    skill: {
      name: form.name,
      locales: state.locales,
    },
    meta: {
      invName: form.invName,
      summary: form.summary,
      description: form.description,
      updatesDescription: form.updatesDescription,
      keywords: form.keywords,
      invocations: state.invocations,
      smallIcon: state.smallIcon,
      largeIcon: state.largeIcon,
      category: state.category && state.category.value ? state.category.value : null,
      copa: state.copa,
      privacyPolicy: !_.isEmpty(state.privacyPolicy) ? state.privacyPolicy : '',
      termsAndCond: state.termsAndCond,
      purchase: state.purchase,
      personal: state.personal,
      ads: state.ads,
      export: state.export,
      instructions: form.instructions,
    },
  }),
  toDb: (state, form) => ({
    name: form.name,
    locales: JSON.stringify(state.locales),
    inv_name: form.invName,
    summary: form.summary,
    description: form.description,
    updates_description: form.updatesDescription,
    keywords: form.keywords,
    invocations: state.invocations,
    small_icon: state.smallIcon,
    large_icon: state.largeIcon,
    category: state.category && state.category.value ? state.category.value : null,
    copa: state.copa,
    privacy_policy: !_.isEmpty(state.privacyPolicy) ? state.privacyPolicy : '',
    terms_and_cond: state.termsAndCond,
    purchase: state.purchase,
    personal: state.personal,
    ads: state.ads,
    export: state.export,
    instructions: form.instructions,
  }),
};

export default amazonAdaptor;
