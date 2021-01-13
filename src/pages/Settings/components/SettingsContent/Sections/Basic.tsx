import { Locale } from '@voiceflow/alexa-types';
import { Locale as GeneralLocale } from '@voiceflow/general-types';
import { Language, LanguageToLocale, Locale as GoogleLocale } from '@voiceflow/google-types';
import _constant from 'lodash/constant';
import React, { ChangeEvent } from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import { PlatformType } from '@/constants';
import { GENERAL_LOCALES_OPTIONS, GENERAL_LOCALE_NAME_MAP } from '@/constants/platforms';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import { SectionErrorMessage } from '@/pages/NewProject/Steps/components';
import {
  FORMATTED_GOOGLE_LOCALES_LABELS,
  FORMATTED_LOCALES,
  getAmazonInvocationNameError,
  getGoogleInvocationNameError,
  getLocaleLanguage,
} from '@/pages/Publish/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { without } from '@/utils/array';
import { getPlatformValue } from '@/utils/platform';

import { PlatformSettingsMetaProps, SettingSections } from '../../../constants';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

type BasicProps = {
  title: SettingSections;
  platform: PlatformType;
  platformMeta: PlatformSettingsMetaProps;
};

const sectionStyling = {
  paddingBottom: '24px',
};

const Basic: React.FC<ConnectedBasicProps & BasicProps> = ({
  meta,
  skill,
  platform,
  platformMeta,
  saveLocales,
  saveProjectName,
  saveInvocationName,
}) => {
  const { invName } = meta;
  const { name, locales = [] } = skill;
  const { descriptors, localeText } = platformMeta;
  const { projectName, invocationName, localesDescriptor } = descriptors;

  const [newInvocation, setNewInvocation] = React.useState(invName);
  const [newProjectName, setNewProjectName] = React.useState(name);

  const [alexaLocales, setAlexaLocales] = React.useState<Locale[]>((locales || []) as Locale[]);
  const [generalLocale, setGeneralLocale] = React.useState<GeneralLocale>((locales as GeneralLocale[])[0]);
  const [googleLanguage, setGoogleLanguage] = React.useState<string | Language>(() => getLocaleLanguage(locales as GoogleLocale[]));

  const displayName =
    platform === PlatformType.ALEXA
      ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
      : '';

  const invocationError =
    newInvocation &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      platform,
      {
        [PlatformType.ALEXA]: getAmazonInvocationNameError,
        [PlatformType.GOOGLE]: getGoogleInvocationNameError,
      },
      _constant(null)
    )(newInvocation as string, alexaLocales);

  const saveSettings = async () => {
    saveProjectName(newProjectName);
    saveInvocationName(newInvocation);

    if (platform === PlatformType.ALEXA) {
      saveLocales(alexaLocales as Locale[]);
    } else {
      saveLocales(LanguageToLocale[googleLanguage as Language]);
    }
  };

  useDidUpdateEffect(() => {
    saveSettings();
  }, [alexaLocales, googleLanguage, generalLocale]);

  return (
    <>
      <Section customContentStyling={sectionStyling} variant={SectionVariant.QUATERNARY} contentSuffix={projectName} header="Project Name">
        <Input value={newProjectName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProjectName(e.target.value)} onBlur={saveSettings} />
      </Section>

      {platform !== PlatformType.GENERAL && (
        <Section
          header="Invocation Name"
          variant={SectionVariant.QUATERNARY}
          contentSuffix={
            invocationError && newInvocation ? () => <SectionErrorMessage marginTop={16}>{invocationError}</SectionErrorMessage> : invocationName
          }
          isDividerNested
          customContentStyling={sectionStyling}
        >
          <Input
            error={!!invocationError}
            value={newInvocation}
            onBlur={saveSettings}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewInvocation(e.target.value)}
          />
        </Section>
      )}

      <Section
        header={localeText}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={localesDescriptor}
        isDividerNested
        customContentStyling={sectionStyling}
      >
        {getPlatformValue<() => React.ReactNode>(
          platform,
          {
            // eslint-disable-next-line react/display-name
            [PlatformType.ALEXA]: () => (
              <UnTypedDropdownMultiselect
                options={LOCALE_MAP}
                onSelect={(val: Locale) =>
                  setAlexaLocales(alexaLocales.includes(val) ? without(alexaLocales, alexaLocales.indexOf(val)) : [...alexaLocales, val])
                }
                autoWidth
                withCaret
                placeholder="Select Locales"
                buttonLabel="Unselect All"
                buttonClick={() => setAlexaLocales([])}
                selectedItems={alexaLocales}
                selectedValue={displayName}
                dropdownActive
              />
            ),
            // eslint-disable-next-line react/display-name
            [PlatformType.GOOGLE]: () => (
              <Select
                placeholder="Language"
                value={FORMATTED_GOOGLE_LOCALES_LABELS[googleLanguage]}
                options={FORMATTED_LOCALES}
                onSelect={setGoogleLanguage}
                getOptionValue={(option) => option?.value || ''}
                renderOptionLabel={(option) => option.name}
              />
            ),
            // eslint-disable-next-line react/display-name
            [PlatformType.GENERAL]: () => (
              <Select
                value={generalLocale}
                options={GENERAL_LOCALES_OPTIONS}
                disabled
                onSelect={setGeneralLocale}
                searchable
                placeholder="Locale"
                getOptionValue={(option) => option?.value || GeneralLocale.EN_US}
                getOptionLabel={(value) => GENERAL_LOCALE_NAME_MAP[value as GeneralLocale] ?? ''}
                renderOptionLabel={(option) => option.name}
              />
            ),
          },
          // eslint-disable-next-line lodash/prefer-constant
          () => null
        )()}
      </Section>
    </>
  );
};

const mapStateToProps = {
  meta: Skill.skillMetaSelector,
  skill: Skill.activeSkillSelector,
  versionID: Skill.activeSkillIDSelector,
};

const mapDispatchToProps = {
  saveInvocationName: Skill.saveInvocationName,
  saveProjectName: Skill.saveProjectName,
  saveLocales: Skill.saveLocales,
};

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
