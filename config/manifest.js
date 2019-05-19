exports.createManifest = (r, encoded_id) => {
  if (r.invocations && Array.isArray(r.invocations.value)) {
    r.invocations = r.invocations.value.map((item) => `Alexa, ${item}`);
  } else {
    r.invocations = [`Alexa, open ${r.inv_name}`];
  }
  r.keywords = r.keywords
    ? r.keywords
        .split(',')
        .map((item) => item.trim())
        .filter((word) => !!word)
    : [];

  const localeObj = {
    summary: r.summary,
    examplePhrases: r.invocations,
    name: r.name,
    description: r.description,
    keywords: r.keywords,
    smallIconUri: r.small_icon ? r.small_icon : '',
    largeIconUri: r.large_icon ? r.large_icon : '',
  };

  const locales = {};
  r.locales.forEach((locale) => {
    locales[locale] = localeObj;
  });

  // TODO: in the future we need a different one for each

  let privacyLocales = null;

  if (r.privacy_policy || r.terms_and_cond) {
    privacyLocales = {};

    r.locales.forEach((locale) => {
      privacyLocales[locale] = {};
      if (r.terms_and_cond) {
        privacyLocales[locale].termsOfUseUrl = r.terms_and_cond;
      }
      if (r.privacy_policy) {
        privacyLocales[locale].privacyPolicyUrl = r.privacy_policy;
      } else {
        privacyLocales[locale].privacyPolicyUrl = '';
      }
    });
  }

  const SKILL_ENDPOINT = `${process.env.SKILL_ENDPOINT ? process.env.SKILL_ENDPOINT : 'https://app.getvoiceflow.com'}/state/skill/${encoded_id}`;
  const ret = {
    manifest: {
      publishingInformation: {
        locales,
        isAvailableWorldwide: true,
        testingInstructions: r.instructions ? r.instructions : '',
      },
      apis: {
        custom: {
          endpoint: {
            uri: SKILL_ENDPOINT,
            sslCertificateType: 'Wildcard',
          },
        },
      },
      manifestVersion: '1.0',
      privacyAndCompliance: {
        allowsPurchases: !!r.purchase,
        isExportCompliant: !!r.export,
        isChildDirected: !!r.copa,
        usesPersonalInfo: !!r.personal,
        containsAds: !!r.ads,
      },
    },
  };
  if (r.category) {
    ret.manifest.publishingInformation.category = r.category;
  }
  if (privacyLocales) {
    ret.manifest.privacyAndCompliance.locales = privacyLocales;
  }

  if (r.alexa_events) {
    try {
      ret.manifest.events = JSON.parse(r.alexa_events);
      delete ret.manifest.events.regions;
    } catch (err) {
      console.log('INVALID JSON');
    }
  }

  if (Array.isArray(r.alexa_permissions) && r.alexa_permissions.length !== 0) {
    ret.manifest.permissions = r.alexa_permissions.map((permission) => ({ name: permission }));

    // TODO: FIX THIS JANK ASS SHIT - THE MOST INSANE BANDAID FIX YOUVE EVER SEEN
    if (!(typeof ret.manifest.events === 'object')) ret.manifest.events = {};
    ret.manifest.events.endpoint = { uri: SKILL_ENDPOINT, sslCertificateType: 'Wildcard' };
    if (!Array.isArray(ret.manifest.events.subscriptions)) ret.manifest.events.subscriptions = [];
    const events = ['SKILL_PERMISSION_ACCEPTED', 'SKILL_PERMISSION_CHANGED'];
    events.forEach((permission) => {
      if (!ret.manifest.events.subscriptions.find((sub) => sub.eventName === permission)) {
        ret.manifest.events.subscriptions.push({
          eventName: permission,
        });
      }
    });
  }

  // Add all project appropriate interfaces
  const interfaces = [];
  if (r.fulfillment && Object.keys(r.fulfillment).length > 0) {
    interfaces.push({
      type: 'CAN_FULFILL_INTENT_REQUEST',
    });
  }
  if (Array.isArray(r.alexa_interfaces) && r.alexa_interfaces.length !== 0) {
    interfaces.push(...r.alexa_interfaces.map((_interface) => ({ type: _interface })));
  }
  if (interfaces.length !== 0) {
    ret.manifest.apis.custom.interfaces = interfaces;
  }

  return ret;
};
