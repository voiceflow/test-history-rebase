import { AlexaConstants, AlexaUtils } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { DFESConstants } from '@voiceflow/google-dfes-types';
import { GoogleConstants, GoogleUtils } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, Input, Select, Upload, UploadIconVariant, useDidUpdateEffect } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import _constant from 'lodash/constant';
import React from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import Section, { SectionVariant } from '@/components/Section';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { SectionErrorMessage } from '@/pages/NewProject/Steps/components';
import { FORMATTED_DIALOGFLOW_LOCALES, FORMATTED_DIALOGFLOW_LOCALES_LABELS, getDialogflowLocaleLanguage } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS, FORMATTED_LOCALES, getLocaleLanguage } from '@/pages/Publish/Google/utils';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { isAlexaPlatform, isDialogflowPlatform, isGooglePlatform, isPlatformWithInvocationName, isVoiceflowBasedPlatform } from '@/utils/typeGuards';

import { PlatformSettingsMetaProps, SettingSections } from '../../../constants';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;

interface BasicProps {
  title: SettingSections;
  platform: VoiceflowConstants.PlatformType;
  platformMeta: PlatformSettingsMetaProps;
}

const headerStyling = {
  paddingBottom: '11px',
};

const sectionStyling = {
  paddingBottom: '24px',
};

const LanguagesDescriptor: React.FC = () => <DescriptorContainer>The language(s) that your assistant supports.</DescriptorContainer>;

const Basic: React.FC<ConnectedBasicProps & BasicProps> = ({
  invocationName,
  agentName,
  locales,
  project,
  platform,
  platformMeta,
  updateLocales,
  updateProjectName,
  updateProjectImage,
  updateInvocationName,
  updateAgentName,
}) => {
  const { descriptors, localeText } = platformMeta;

  const initialDialogflowLanguage = React.useMemo(() => getDialogflowLocaleLanguage(locales as any[]), [locales]);
  const initialGoogleLanguage = React.useMemo(() => getLocaleLanguage(locales as GoogleConstants.Locale[]), [locales]);

  const [newInvocation, setNewInvocation] = React.useState(invocationName ?? '');
  const [newProjectName, setNewProjectName] = React.useState(project?.name ?? '');
  const [projectImage, setProjectImage] = React.useState(project?.image ?? null);
  const [newAgentName, setNewAgentName] = React.useState(agentName || '');

  const [alexaLocales, setAlexaLocales] = React.useState<AlexaConstants.Locale[]>((locales || []) as AlexaConstants.Locale[]);
  const [generalLocale, setGeneralLocale] = React.useState<VoiceflowConstants.Locale>((locales as VoiceflowConstants.Locale[])[0]);
  const [googleLanguage, setGoogleLanguage] = React.useState<string | GoogleConstants.Language>(initialGoogleLanguage);
  const [dialogflowLanguage, setDialogflowLanguage] = React.useState<string | DFESConstants.Language>(initialDialogflowLanguage);

  const displayName =
    platform === VoiceflowConstants.PlatformType.ALEXA
      ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
      : '';

  const invocationError =
    newInvocation &&
    Realtime.Utils.platform.createPlatformSelector<(name?: string, locales?: any[]) => string | null>(
      {
        [VoiceflowConstants.PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [VoiceflowConstants.PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
      },
      _constant(null)
    )(platform)(
      newInvocation,
      isGooglePlatform(platform) ? GoogleConstants.LanguageToLocale[googleLanguage as GoogleConstants.Language] : alexaLocales
    );

  const saveAlexaLocales = () => (isAlexaPlatform(platform) && locales !== alexaLocales ? updateLocales(alexaLocales) : null);

  const saveGoogleLocales = () =>
    isGooglePlatform(platform) && googleLanguage !== initialGoogleLanguage
      ? updateLocales(GoogleConstants.LanguageToLocale[googleLanguage as GoogleConstants.Language])
      : null;

  const saveDialogflowLocales = () =>
    isDialogflowPlatform(platform) && dialogflowLanguage !== initialDialogflowLanguage
      ? updateLocales(DFESConstants.LanguageToLocale[dialogflowLanguage as DFESConstants.Language])
      : null;

  const saveSettings = async () => {
    await Promise.all([
      updateProjectName(newProjectName),
      !isVoiceflowBasedPlatform(platform) ? updateInvocationName(newInvocation) : null,
      project && projectImage ? updateProjectImage(project.id, projectImage) : null,
      newAgentName ? updateAgentName(newAgentName as string) : null,
      saveAlexaLocales(),
      saveGoogleLocales(),
      saveDialogflowLocales(),
    ]);
  };

  useDidUpdateEffect(() => {
    saveSettings();
  }, [alexaLocales, googleLanguage, generalLocale, dialogflowLanguage, projectImage]);

  return (
    <>
      <Section
        customHeaderStyling={headerStyling}
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={descriptors.projectName}
        header="Assistant Name"
      >
        <BoxFlex>
          <Input value={newProjectName} onChangeText={setNewProjectName} onBlur={saveSettings} />
          <Box ml={16}>
            <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} update={setProjectImage} image={projectImage ?? ''} />
          </Box>
        </BoxFlex>
      </Section>

      {isDialogflowPlatform(platform) && (
        <Section
          customHeaderStyling={headerStyling}
          customContentStyling={sectionStyling}
          variant={SectionVariant.QUATERNARY}
          contentSuffix={
            !newAgentName
              ? () => <SectionErrorMessage marginTop={12}>Your agent requires a valid name to be uploaded</SectionErrorMessage>
              : descriptors.agentName
          }
          header="Agent Name"
        >
          <BoxFlex>
            <Input value={newAgentName} onChangeText={setNewAgentName} placeholder="Enter agent name" onBlur={saveSettings} error={!newAgentName} />
          </BoxFlex>
        </Section>
      )}

      {isPlatformWithInvocationName(platform) && (
        <Section
          header="Invocation Name"
          variant={SectionVariant.QUATERNARY}
          contentSuffix={
            invocationError && newInvocation
              ? () => <SectionErrorMessage marginTop={16}>{invocationError}</SectionErrorMessage>
              : descriptors.invocationName
          }
          customHeaderStyling={headerStyling}
          customContentStyling={sectionStyling}
        >
          <Input error={!!invocationError} value={newInvocation} onBlur={saveSettings} onChangeText={setNewInvocation} />
        </Section>
      )}

      <Section
        header={localeText || 'Language'}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={descriptors.localesDescriptor || LanguagesDescriptor}
        customHeaderStyling={headerStyling}
        customContentStyling={sectionStyling}
      >
        {Realtime.Utils.platform.createPlatformSelector<() => React.ReactNode>(
          {
            [VoiceflowConstants.PlatformType.ALEXA]: () => (
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
            [VoiceflowConstants.PlatformType.GOOGLE]: () => (
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
            [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: () => (
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

const mapStateToProps = {
  versionID: Session.activeVersionIDSelector,
  project: ProjectV2.active.projectSelector,
  invocationName: VersionV2.active.invocationNameSelector,
  agentName: VersionV2.active.dialogflow.agentNameSelector,
  locales: VersionV2.active.localesSelector,
};

const mapDispatchToProps = {
  updateInvocationName: Version.updateInvocationName,
  updateProjectName: Project.updateActiveProjectName,
  updateLocales: Version.updateLocales,
  updateProjectImage: Project.updateProjectImage,
  updateAgentName: Version.dialogflow.updateAgentName,
};

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
