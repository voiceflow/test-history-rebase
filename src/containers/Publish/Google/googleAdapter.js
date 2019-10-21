import _ from 'lodash';

const googleAdaptor = {
  fromDB: ({ privacy_policy, terms_and_cond, publish_info }) => {
    let publishInfo = publish_info;
    if (!_.isObject(publish_info)) {
      publishInfo = {};
    }

    if (!publish_info.locales) {
      publishInfo.locales = [];
    }
    if (!publish_info.main_locale) {
      publishInfo.main_locale = 'en';
    }

    if (!publish_info.google_link_user) {
      publishInfo.google_link_user = '0';
    }

    return {
      ...publishInfo,
      privacyPolicy: privacy_policy,
      termsAndCond: terms_and_cond,
    };
  },
};

export default googleAdaptor;
