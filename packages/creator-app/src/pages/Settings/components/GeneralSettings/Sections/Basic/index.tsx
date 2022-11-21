import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants } from '@voiceflow/google-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Input, Select, Upload, UploadIconVariant, useDidUpdateEffect } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import Section, { SectionVariant } from '@/components/Section';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useSelector } from '@/hooks';
import { FORMATTED_DIALOGFLOW_LOCALES, FORMATTED_DIALOGFLOW_LOCALES_LABELS, getDialogflowLocaleLanguage } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS, FORMATTED_LOCALES, getLocaleLanguage } from '@/pages/Publish/Google/utils';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import LOCALE_MAP from '@/services/LocaleMap';
import { isAlexaPlatform, isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { PlatformSettingsMetaProps, SettingSections } from '../../../../constants';
import { headerStyling, SectionErrorMessage, sectionStyling } from './styles';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

interface BasicProps {
  title: SettingSections;
  platform: Platform.Constants.PlatformType;
  platformMeta: PlatformSettingsMetaProps;
}

const Basic: React.FC<BasicProps> = ({ platform, platformMeta }) => {
  const projectConfig = useActiveProjectTypeConfig();
  const { descriptors, localeText } = platformMeta;

  const project = useSelector(ProjectV2.active.projectSelector);
  const locales = useSelector(VersionV2.active.localesSelector);
  const storedInvocationName = useSelector(VersionV2.active.invocationNameSelector);

  const updateLocales = useDispatch(Version.updateLocales);
  const updateProjectName = useDispatch(Project.updateActiveProjectName);
  const updateProjectImage = useDispatch(Project.updateProjectImage);
  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const initialGoogleLanguage = React.useMemo(() => getLocaleLanguage(locales as GoogleConstants.Locale[]), [locales]);
  const initialDialogflowLanguage = React.useMemo(() => getDialogflowLocaleLanguage(locales as any[]), [locales]);

  const [projectName, setProjectName] = React.useState(project?.name ?? '');
  const [projectImage, setProjectImage] = React.useState(project?.image ?? null);
  const [invocationName, setInvocationName] = React.useState(storedInvocationName ?? '');

  const [alexaLocales, setAlexaLocales] = React.useState<AlexaConstants.Locale[]>((locales || []) as AlexaConstants.Locale[]);
  const [generalLocale, setGeneralLocale] = React.useState<VoiceflowConstants.Locale>((locales as VoiceflowConstants.Locale[])[0]);
  const [googleLanguage, setGoogleLanguage] = React.useState<string | GoogleConstants.Language>(initialGoogleLanguage);
  const [dialogflowLanguage, setDialogflowLanguage] = React.useState<string | DFESConstants.Language>(initialDialogflowLanguage);

  const displayName =
    platform === Platform.Constants.PlatformType.ALEXA
      ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
      : '';

  const saveAlexaLocales = () => (isAlexaPlatform(platform) && locales !== alexaLocales ? updateLocales(alexaLocales) : null);

  const saveGoogleLocales = () =>
    isGooglePlatform(platform) && googleLanguage !== initialGoogleLanguage
      ? updateLocales(GoogleConstants.LanguageToLocale[googleLanguage as GoogleConstants.Language])
      : null;

  const saveDialogflowLocales = () =>
    isDialogflowPlatform(platform) && dialogflowLanguage !== initialDialogflowLanguage
      ? updateLocales(DFESConstants.LanguageToLocale[dialogflowLanguage as DFESConstants.Language])
      : null;

  const invocationError = projectConfig.utils.invocationName.validate({
    value: invocationName,
    locales: isGooglePlatform(platform) ? GoogleConstants.LanguageToLocale[googleLanguage as GoogleConstants.Language] : alexaLocales,
  });

  const onSaveInvocationName = () => projectConfig.project.invocationName && !invocationError && updateInvocationName(invocationName);

  const saveSettings = async () =>
    Promise.all([
      updateProjectName(projectName),
      onSaveInvocationName(),
      project && projectImage ? updateProjectImage(project.id, projectImage) : null,
      saveAlexaLocales(),
      saveGoogleLocales(),
      saveDialogflowLocales(),
    ]);

  useDidUpdateEffect(() => {
    saveSettings();
  }, [alexaLocales, googleLanguage, generalLocale, dialogflowLanguage, projectImage]);

  return (
    <>
      <Section
        header="Assistant Name"
        variant={SectionVariant.QUATERNARY}
        contentSuffix={descriptors.projectName}
        customHeaderStyling={headerStyling}
        customContentStyling={sectionStyling}
      >
        <Box.Flex>
          <Input value={projectName} onChangeText={setProjectName} onBlur={saveSettings} />

          <Box ml={16}>
            <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} update={setProjectImage} image={projectImage ?? ''} />
          </Box>
        </Box.Flex>
      </Section>

      {!!projectConfig.project.invocationName && (
        <Section
          header={projectConfig.project.invocationName.name}
          variant={SectionVariant.QUATERNARY}
          contentSuffix={
            invocationError ? (
              <SectionErrorMessage marginTop={16}>{invocationError}</SectionErrorMessage>
            ) : (
              <DescriptorContainer>{projectConfig.project.invocationName.description}</DescriptorContainer>
            )
          }
          customHeaderStyling={headerStyling}
          customContentStyling={sectionStyling}
        >
          <Input
            error={!!invocationError}
            value={invocationName}
            onBlur={onSaveInvocationName}
            placeholder={projectConfig.project.invocationName.placeholder}
            onChangeText={setInvocationName}
          />
        </Section>
      )}

      <Section
        header={localeText || 'Language'}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={descriptors.localesDescriptor || <DescriptorContainer>The language(s) that your assistant supports.</DescriptorContainer>}
        customHeaderStyling={headerStyling}
        customContentStyling={sectionStyling}
      >
        {Realtime.Utils.platform.createPlatformSelector<() => React.ReactNode>(
          {
            [Platform.Constants.PlatformType.ALEXA]: () => (
              <UnTypedDropdownMultiselect
                options={LOCALE_MAP}
                onSelect={(val: AlexaConstants.Locale) =>
                  setAlexaLocales(alexaLocales.includes(val) ? Utils.array.without(alexaLocales, alexaLocales.indexOf(val)) : [...alexaLocales, val])
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
            [Platform.Constants.PlatformType.GOOGLE]: () => (
              <Select
                value={googleLanguage}
                options={FORMATTED_LOCALES}
                onSelect={setGoogleLanguage}
                placeholder="Language"
                getOptionKey={(option) => option.value}
                getOptionValue={(option) => option?.value || ''}
                getOptionLabel={(value) => value && FORMATTED_GOOGLE_LOCALES_LABELS[value]}
                renderOptionLabel={(option) => option.name}
              />
            ),
            [Platform.Constants.PlatformType.DIALOGFLOW_ES]: () => (
              <Select
                value={dialogflowLanguage}
                options={FORMATTED_DIALOGFLOW_LOCALES}
                onSelect={setDialogflowLanguage}
                placeholder="Language"
                getOptionKey={(option) => option.value}
                getOptionValue={(option) => option?.value || ''}
                getOptionLabel={(value) => value && FORMATTED_DIALOGFLOW_LOCALES_LABELS[value]}
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
              getOptionKey={(option) => option.value}
              getOptionValue={(option) => option?.value || VoiceflowConstants.Locale.EN_US}
              getOptionLabel={(value) => GENERAL_LOCALE_NAME_MAP[value as VoiceflowConstants.Locale] ?? ''}
              renderOptionLabel={(option) => option.name}
            />
          )
        )(platform)()}
      </Section>
    </>
  );
};

export default Basic;
