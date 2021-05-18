import { getInvocationNameError as getAlexaInvocationNameError, Locale as AlexaLocale } from '@voiceflow/alexa-types';
import { Locale as GeneralLocale } from '@voiceflow/general-types';
import { getInvocationNameError as getGoogleInvocationNameError, Language, LanguageToLocale, Locale as GoogleLocale } from '@voiceflow/google-types';
import _constant from 'lodash/constant';
import React, { ChangeEvent } from 'react';

import Box, { Flex } from '@/components/Box';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import Input from '@/components/Input';
import Section, { SectionVariant } from '@/components/Section';
import Select from '@/components/Select';
import { UploadIconVariant, UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { PlatformType } from '@/constants';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect } from '@/hooks';
import { SectionErrorMessage } from '@/pages/NewProject/Steps/components';
import { FORMATTED_GOOGLE_LOCALES_LABELS, FORMATTED_LOCALES, getLocaleLanguage } from '@/pages/Publish/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps, MergeArguments } from '@/types';
import { without } from '@/utils/array';
import { getPlatformValue } from '@/utils/platform';

import { PlatformSettingsMetaProps, SettingSections } from '../../../constants';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;
const UnTypedUploadJustIcon: any = UploadJustIcon;

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
  project,
  platform,
  platformMeta,
  saveLocales,
  saveProjectName,
  saveProjectImage,
  saveInvocationName,
}) => {
  const { invName } = meta;
  const { name, locales = [] } = skill;
  const { descriptors, localeText } = platformMeta;
  const { projectName, invocationName, localesDescriptor } = descriptors;

  const [newInvocation, setNewInvocation] = React.useState(invName);
  const [newProjectName, setNewProjectName] = React.useState(name);
  const [projectImage, setProjectImage] = React.useState(project.image);

  const [alexaLocales, setAlexaLocales] = React.useState<AlexaLocale[]>((locales || []) as AlexaLocale[]);
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
        [PlatformType.ALEXA]: getAlexaInvocationNameError,
        [PlatformType.GOOGLE]: getGoogleInvocationNameError,
      },
      _constant(null)
    )(newInvocation as string, alexaLocales);

  const saveSettings = async () => {
    saveProjectName(newProjectName);
    saveInvocationName(newInvocation);

    if (projectImage) {
      saveProjectImage(project.id, projectImage);
    }

    if (platform === PlatformType.ALEXA) {
      saveLocales(alexaLocales as AlexaLocale[]);
    } else {
      saveLocales(LanguageToLocale[googleLanguage as Language]);
    }
  };

  useDidUpdateEffect(() => {
    saveSettings();
  }, [alexaLocales, googleLanguage, generalLocale, projectImage]);

  return (
    <>
      <Section customContentStyling={sectionStyling} variant={SectionVariant.QUATERNARY} contentSuffix={projectName} header="Project Name">
        <Flex>
          <Input value={newProjectName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProjectName(e.target.value)} onBlur={saveSettings} />
          <Box ml={16}>
            <UnTypedUploadJustIcon size={UploadIconVariant.EXTRA_SMALL} update={setProjectImage} image={projectImage} endpoint="/image" />
          </Box>
        </Flex>
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
                onSelect={(val: AlexaLocale) =>
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
          },
          () => (
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
          )
        )()}
      </Section>
    </>
  );
};

const mapStateToProps = {
  meta: Skill.skillMetaSelector,
  skill: Skill.activeSkillSelector,
  versionID: Session.activeVersionIDSelector,
  project: Project.projectByIDSelector,
};

const mapDispatchToProps = {
  saveInvocationName: Skill.saveInvocationName,
  saveProjectName: Skill.saveProjectName,
  saveLocales: Skill.saveLocales,
  saveProjectImage: Project.saveProjectImage,
};

const mergeProps = (...[{ skill, project: projectByIDSelector }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchToProps>) => ({
  project: projectByIDSelector(skill.projectID),
});

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Basic);
