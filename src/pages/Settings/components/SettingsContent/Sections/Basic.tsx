import { Locale } from '@voiceflow/alexa-types';
import React, { ChangeEvent, useEffect } from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import { PlatformType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { FORMATTED_LOCALES, GOOGLE_LANGUAGE_TO_LOCALES } from '@/pages/Publish/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { without } from '@/utils/array';

import { PlatformSettingsMetaProps, SettingSections } from '../../../constants';

export const FORMATTED_GOOGLE_LOCALES_LABELS: Record<string, string> = FORMATTED_LOCALES.reduce<Record<string, string>>(
  (acc, locale) => Object.assign(acc, { [locale.value]: locale.name }),
  {}
);

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

type BasicProps = {
  title: SettingSections;
  platformMeta: PlatformSettingsMetaProps;
  platform: PlatformType;
};

const sectionStyling = {
  paddingBottom: '24px',
};

const getLocaleLanguage = (locales: any[]) => {
  return Object.keys(GOOGLE_LANGUAGE_TO_LOCALES).find((locale) => GOOGLE_LANGUAGE_TO_LOCALES[locale].includes(locales[0])) || '';
};

const Basic: React.FC<ConnectedBasicProps & BasicProps> = ({
  saveProjectName,
  saveInvocationName,
  saveLocales,
  meta,
  skill,
  platform,
  platformMeta,
}) => {
  const { invName } = meta;
  const { name, locales } = skill;
  const { descriptors, localeText } = platformMeta;
  const { projectName, invocationName, localesDescriptor } = descriptors;

  const [newInvocation, setNewInvocation] = React.useState(invName);
  const [newProjectName, setNewProjectName] = React.useState(name);
  const [selectedLocales, setSelectedLocales] = React.useState<Locale[]>(locales || []);
  const [mainLanguage, setMainLanguage] = React.useState<string>(getLocaleLanguage(locales));

  const displayName =
    platform === PlatformType.ALEXA
      ? selectedLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
      : '';

  const saveSettings = async () => {
    saveProjectName(newProjectName);
    saveInvocationName(newInvocation);
    if (platform === PlatformType.ALEXA) {
      saveLocales(selectedLocales as [Locale, ...Locale[]]);
    } else {
      saveLocales(GOOGLE_LANGUAGE_TO_LOCALES[mainLanguage] as any);
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
            setMainLanguage(val);
            saveLocales(GOOGLE_LANGUAGE_TO_LOCALES[val] as any);
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
            contentSuffix={invocationName}
            header="Invocation Name"
          >
            <Input value={newInvocation} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewInvocation(e.target.value)} onBlur={saveSettings} />
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
