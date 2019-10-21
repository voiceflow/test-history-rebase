import { createAdapter } from '../utils';

const skillMetaAdapter = createAdapter(
  ({
    inv_name,
    small_icon,
    large_icon,
    resume_prompt,
    error_prompt,
    alexa_events,
    account_linking,
    privacy_policy,
    terms_and_cond,
    updates_description,
    ...meta
  }) => ({
    ...meta,
    invName: inv_name,
    smallIcon: small_icon,
    largeIcon: large_icon,
    resumePrompt: resume_prompt,
    errorPrompt: error_prompt,
    alexaEvents: alexa_events,
    accountLinking: account_linking,
    privacyPolicy: privacy_policy,
    termsAndCond: terms_and_cond,
    updatesDescription: updates_description,
  }),
  ({
    invName,
    smallIcon,
    largeIcon,
    resumePrompt,
    errorPrompt,
    alexaEvents,
    accountLinking,
    privacyPolicy,
    termsAndCond,
    updatesDescription,
    ...meta
  }) => ({
    ...meta,
    privacy_policy: privacyPolicy,
    terms_and_cond: termsAndCond,
    updates_description: updatesDescription,
    inv_name: invName,
    small_icon: smallIcon,
    large_icon: largeIcon,
    resume_prompt: resumePrompt,
    error_prompt: errorPrompt,
    alexa_events: alexaEvents,
    account_linking: accountLinking,
  })
);

export default skillMetaAdapter;
