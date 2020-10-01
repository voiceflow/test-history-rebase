import { Locale } from '@voiceflow/alexa-types';
import React, { ChangeEvent, useEffect } from 'react';

import client from '@/client';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import { FeatureFlag } from '@/config/features';
import { PlatformType } from '@/constants';
import { googleIDSelector, updatePublishInfo } from '@/ducks/publish/google';
import * as Skill from '@/ducks/skill';
import { saveSkillSettings } from '@/ducks/skill/sideEffects';
import { saveInvocationName, saveLocales, saveProjectName } from '@/ducks/skill/sideEffectsV2';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { FORMATTED_LOCALES } from '@/pages/Publish/Google/Form';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { without } from '@/utils/array';
import { arrayStringReplace } from '@/utils/string';

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

type newSettingsDataProps = {
  name: string;
  invName: string;
  locales: Locale[];
  invocations?: string[];
};

const sectionStyling = {
  paddingBottom: '24px',
};

const Basic: React.FC<ConnectedBasicProps & BasicProps> = ({
  saveProjectName,
  saveSkillSettings,
  saveInvocationName,
  saveSkillMeta,
  saveLocales,
  meta,
  skill,
  updatePublishInfo,
  versionID,
  googleID,
  platform,
  platformMeta,
}) => {
  const { invName } = meta;
  const { name, locales, publishInfo } = skill;
  const initialInvocationName = React.useMemo(() => invName, [invName]);
  const [newInvocation, setNewInvocation] = React.useState(invName);
  const [newProjectName, setNewProjectName] = React.useState(name);
  const [selectedLocales, setSelectedLocales] = React.useState<Locale[]>(locales || []);
  const [mainLanguage, setMainLanguage] = React.useState<string>(publishInfo?.google?.main_locale);
  const displayName = selectedLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ');
  const { descriptors, localeText } = platformMeta;
  const { projectName, invocationName, localesDescriptor } = descriptors;
  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);

  const saveSettings = async () => {
    const newSettingsData: newSettingsDataProps = {
      name: newProjectName,
      invName: newInvocation,
      locales: selectedLocales,
    };

    if (dataRefactor.isEnabled) {
      saveProjectName(newProjectName);
      saveInvocationName(newInvocation);
      saveLocales(selectedLocales as [Locale, ...Locale[]]);
    } else {
      // Legacy, to be removed after data refactor is merged / enabled
      if (initialInvocationName !== newInvocation) {
        const newPhrases = arrayStringReplace(initialInvocationName, newInvocation, meta.invocations.value || meta.invocations);
        newSettingsData.invocations = newPhrases;
      }

      const newMeta = { locales: selectedLocales };
      await saveSkillMeta(newMeta);
      await saveSkillSettings(newSettingsData);
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
          onSelect={async (val: string) => {
            setMainLanguage(val);
            const googlePublishInfo = {
              main_locale: val,
            };

            await client.skill.updateGooglePublishInfo(versionID, googlePublishInfo);
            updatePublishInfo({ ...googlePublishInfo, googleId: googleID });
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
  googleID: googleIDSelector,
  versionID: Skill.activeSkillIDSelector,
};

const mapDispatchToProps = {
  saveSkillMeta: Skill.saveSkillMeta,
  saveSkillSettings,
  saveInvocationName,
  saveProjectName,
  updatePublishInfo,
  saveLocales,
};

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
