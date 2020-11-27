import { Locale } from '@voiceflow/alexa-types';
import { Language, LanguageToLocale, Locale as GoogleLocale } from '@voiceflow/google-types';
import _constant from 'lodash/constant';
import React, { ChangeEvent, useEffect } from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
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
  platformMeta: PlatformSettingsMetaProps;
  platform: PlatformType;
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

  const [selectedLocales, setSelectedLocales] = React.useState<Locale[]>((locales || []) as Locale[]);
  const [mainLanguage, setMainLanguage] = React.useState<string | Language>(getLocaleLanguage(locales as GoogleLocale[]));

  const displayName =
    platform === PlatformType.ALEXA
      ? selectedLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
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
    )(newInvocation as string, selectedLocales);

  const saveSettings = async () => {
    saveProjectName(newProjectName);
    saveInvocationName(newInvocation);
    if (platform === PlatformType.ALEXA) {
      saveLocales(selectedLocales as Locale[]);
    } else {
      saveLocales(LanguageToLocale[mainLanguage as Language]);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [selectedLocales]);

  const localeComponent = React.useMemo(() => {
    if (platform === PlatformType.ALEXA) {
      return (
        <UnTypedDropdownMultiselect
          dropdownActive
          placeholder="Select Locales"
          buttonLabel="Unselect All"
          buttonClick={() => setSelectedLocales([])}
          options={LOCALE_MAP}
          autoWidth
          onSelect={(val: Locale) => {
            const newLocales = selectedLocales.includes(val) ? without(selectedLocales, selectedLocales.indexOf(val)) : [...selectedLocales, val];
            setSelectedLocales(newLocales);
          }}
          selectedItems={selectedLocales}
          selectedValue={displayName}
          withCaret
        />
      );
    }

    if (platform === PlatformType.GOOGLE) {
      return (
        <Select
          placeholder="Language"
          value={FORMATTED_GOOGLE_LOCALES_LABELS[mainLanguage]}
          options={FORMATTED_LOCALES}
          onSelect={async (val) => {
            setMainLanguage(val as Language);
            saveLocales(LanguageToLocale[val as Language] as any);
          }}
          getOptionValue={(option) => option?.value || ''}
          renderOptionLabel={(option) => option.name}
        />
      );
    }
    return null;
  }, [platform, selectedLocales, mainLanguage]);

  return (
    <>
      <Section customContentStyling={sectionStyling} variant={SectionVariant.QUATERNARY} contentSuffix={projectName} header="Project Name">
        <Input value={newProjectName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProjectName(e.target.value)} onBlur={saveSettings} />
      </Section>

      {platform !== PlatformType.GENERAL && (
        <>
          <Section
            customContentStyling={sectionStyling}
            isDividerNested
            variant={SectionVariant.QUATERNARY}
            header="Invocation Name"
            contentSuffix={
              invocationError && newInvocation ? () => <SectionErrorMessage marginTop={16}>{invocationError}</SectionErrorMessage> : invocationName
            }
          >
            <Input
              error={!!invocationError}
              value={newInvocation}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewInvocation(e.target.value)}
              onBlur={saveSettings}
            />
          </Section>

          <Section
            customContentStyling={sectionStyling}
            isDividerNested
            variant={SectionVariant.QUATERNARY}
            contentSuffix={localesDescriptor}
            header={localeText}
          >
            {localeComponent}
          </Section>
        </>
      )}
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
