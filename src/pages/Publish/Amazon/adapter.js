import _ from 'lodash';

const amazonAdapter = {
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
      category: _.isString(state.category) ? state.category : state.category?.value,
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
  toDB: (state, form) => ({
    name: form.name,
    locales: state.locales,
    invName: form.invName,
    summary: form.summary,
    description: form.description,
    updatesDescription: form.updatesDescription,
    keywords: form.keywords,
    invocations: state.invocations,
    smallIcon: state.smallIcon,
    largeIcon: state.largeIcon,
    category: _.isString(state.category) ? state.category : state.category?.value,
    copa: state.copa,
    privacyPolicy: !_.isEmpty(state.privacyPolicy) ? state.privacyPolicy : '',
    termsAndCond: state.termsAndCond,
    purchase: state.purchase,
    personal: state.personal,
    ads: state.ads,
    export: state.export,
    instructions: form.instructions,
  }),
};

export default amazonAdapter;
