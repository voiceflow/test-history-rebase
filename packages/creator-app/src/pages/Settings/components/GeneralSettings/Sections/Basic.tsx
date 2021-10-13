import { Constants as AlexaConstants, Utils as AlexaUtils } from '@voiceflow/alexa-types';
import { Constants, Constants as GeneralConstants } from '@voiceflow/general-types';
import { Constants as DialogflowConstants } from '@voiceflow/google-dfes-types';
import { Constants as GoogleConstants, Utils as GoogleUtils } from '@voiceflow/google-types';
import { Box, BoxFlex, Input, Select, useDidUpdateEffect } from '@voiceflow/ui';
import _constant from 'lodash/constant';
import React, { ChangeEvent } from 'react';

import DropdownMultiselect from '@/components/DropdownMultiselect';
import Section, { SectionVariant } from '@/components/Section';
import { UploadIconVariant, UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { GENERAL_LOCALE_NAME_MAP, GENERAL_LOCALES_OPTIONS } from '@/constants/platforms';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { connect } from '@/hocs';
import { SectionErrorMessage } from '@/pages/NewProject/Steps/components';
import { FORMATTED_DIALOGFLOW_LOCALES, FORMATTED_DIALOGFLOW_LOCALES_LABELS, getDialogflowLocaleLanguage } from '@/pages/Publish/Dialogflow/utils';
import { FORMATTED_GOOGLE_LOCALES_LABELS, FORMATTED_LOCALES, getLocaleLanguage } from '@/pages/Publish/Google/utils';
import LOCALE_MAP from '@/services/LocaleMap';
import { ConnectedProps } from '@/types';
import { without } from '@/utils/array';
import { getPlatformValue } from '@/utils/platform';
import { isAlexaPlatform, isAnyGeneralPlatform, isDialogflowPlatform, isGooglePlatform } from '@/utils/typeGuards';

import { PlatformSettingsMetaProps, SettingSections } from '../../../constants';

const UnTypedDropdownMultiselect: any = DropdownMultiselect;
const UnTypedUploadJustIcon: any = UploadJustIcon;

interface BasicProps {
  title: SettingSections;
  platform: Constants.PlatformType;
  platformMeta: PlatformSettingsMetaProps;
}

const sectionStyling = {
  paddingBottom: '24px',
};

const Basic: React.FC<ConnectedBasicProps & BasicProps> = ({
  invocationName,
  locales,
  project,
  platform,
  platformMeta,
  saveLocales,
  saveProjectName,
  saveProjectImage,
  saveInvocationName,
}) => {
  const { descriptors, localeText } = platformMeta;

  const initialDialogflowLanguage = React.useMemo(() => getDialogflowLocaleLanguage(locales as any[]), [locales]);
  const initialGoogleLanguage = React.useMemo(() => getLocaleLanguage(locales as GoogleConstants.Locale[]), [locales]);

  const [newInvocation, setNewInvocation] = React.useState(invocationName ?? '');
  const [newProjectName, setNewProjectName] = React.useState(project?.name ?? '');
  const [projectImage, setProjectImage] = React.useState(project?.image ?? '');

  const [alexaLocales, setAlexaLocales] = React.useState<AlexaConstants.Locale[]>((locales || []) as AlexaConstants.Locale[]);
  const [generalLocale, setGeneralLocale] = React.useState<GeneralConstants.Locale>((locales as GeneralConstants.Locale[])[0]);
  const [googleLanguage, setGoogleLanguage] = React.useState<string | GoogleConstants.Language>(initialGoogleLanguage);
  const [dialogflowLanguage, setDialogflowLanguage] = React.useState<string | DialogflowConstants.Language>(initialDialogflowLanguage);

  const displayName =
    platform === Constants.PlatformType.ALEXA
      ? alexaLocales.map((localValue) => LOCALE_MAP.find((locale) => locale.value === localValue)!.label).join(', ')
      : '';

  const invocationError =
    newInvocation &&
    getPlatformValue<(name?: string, locales?: any[]) => string | null>(
      platform,
      {
        [Constants.PlatformType.ALEXA]: AlexaUtils.getInvocationNameError,
        [Constants.PlatformType.GOOGLE]: GoogleUtils.getInvocationNameError,
      },
      _constant(null)
    )(newInvocation as string, alexaLocales);

  const saveAlexaLocales = () => (isAlexaPlatform(platform) && locales !== alexaLocales ? saveLocales(alexaLocales) : null);

  const saveGoogleLocales = () =>
    isGooglePlatform(platform) && googleLanguage !== initialGoogleLanguage
      ? saveLocales(GoogleConstants.LanguageToLocale[googleLanguage as GoogleConstants.Language])
      : null;

  const saveDialogflowLocales = () => {
    // eslint-disable-next-line no-console
    console.log({ isdfes: isDialogflowPlatform(platform), dialogflowLanguage, initialDialogflowLanguage });

    return isDialogflowPlatform(platform) && dialogflowLanguage !== initialDialogflowLanguage
      ? saveLocales(DialogflowConstants.LanguageToLocale[dialogflowLanguage as DialogflowConstants.Language])
      : null;
  };

  const saveSettings = async () => {
    await Promise.all([
      saveProjectName(newProjectName),
      !isAnyGeneralPlatform(platform) ? saveInvocationName(newInvocation) : null,
      project && projectImage ? saveProjectImage(project.id, projectImage) : null,
      saveAlexaLocales(),
      saveGoogleLocales(),
      saveDialogflowLocales(),
    ]);
  };

  useDidUpdateEffect(() => {
    saveSettings();
  }, [alexaLocales, googleLanguage, generalLocale, dialogflowLanguage, projectImage]);

  const DialogflowSelect = () => (
    <Select
      placeholder="Language"
      value={FORMATTED_DIALOGFLOW_LOCALES_LABELS[dialogflowLanguage]}
      options={FORMATTED_DIALOGFLOW_LOCALES}
      onSelect={setDialogflowLanguage}
      getOptionValue={(option) => option?.value || ''}
      renderOptionLabel={(option) => option.name}
    />
  );

  return (
    <>
      <Section
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={descriptors.projectName}
        header="Project Name"
      >
        <BoxFlex>
          <Input value={newProjectName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewProjectName(e.target.value)} onBlur={saveSettings} />
          <Box ml={16}>
            <UnTypedUploadJustIcon size={UploadIconVariant.EXTRA_SMALL} update={setProjectImage} image={projectImage} endpoint="/image" />
          </Box>
        </BoxFlex>
      </Section>

      {!isAnyGeneralPlatform(platform) && !isDialogflowPlatform(platform) && (
        <Section
          header="Invocation Name"
          variant={SectionVariant.QUATERNARY}
          contentSuffix={
            invocationError && newInvocation
              ? () => <SectionErrorMessage marginTop={16}>{invocationError}</SectionErrorMessage>
              : descriptors.invocationName
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
        contentSuffix={descriptors.localesDescriptor}
        isDividerNested
        customContentStyling={sectionStyling}
      >
        {getPlatformValue<() => React.ReactNode>(
          platform,
          {
            [Constants.PlatformType.ALEXA]: () => (
              <UnTypedDropdownMultiselect
                options={LOCALE_MAP}
                onSelect={(val: AlexaConstants.Locale) =>
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
            [Constants.PlatformType.GOOGLE]: () => (
              <Select
                placeholder="Language"
                value={FORMATTED_GOOGLE_LOCALES_LABELS[googleLanguage]}
                options={FORMATTED_LOCALES}
                onSelect={setGoogleLanguage}
                getOptionValue={(option) => option?.value || ''}
                renderOptionLabel={(option) => option.name}
              />
            ),
            [Constants.PlatformType.DIALOGFLOW_ES_CHAT]: DialogflowSelect,
            [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: DialogflowSelect,
          },
          () => (
            <Select
              value={generalLocale}
              options={GENERAL_LOCALES_OPTIONS}
              disabled
              onSelect={setGeneralLocale}
              searchable
              placeholder="Locale"
              getOptionValue={(option) => option?.value || GeneralConstants.Locale.EN_US}
              getOptionLabel={(value) => GENERAL_LOCALE_NAME_MAP[value as GeneralConstants.Locale] ?? ''}
              renderOptionLabel={(option) => option.name}
            />
          )
        )()}
      </Section>
    </>
  );
};

const mapStateToProps = {
  versionID: Session.activeVersionIDSelector,
  project: ProjectV2.active.projectSelector,
  invocationName: Version.activeInvocationNameSelector,
  locales: Version.activeLocalesSelector,
};

const mapDispatchToProps = {
  saveInvocationName: Version.saveInvocationName,
  saveProjectName: Project.saveProjectName,
  saveLocales: Version.saveLocales,
  saveProjectImage: Project.saveProjectImage,
};

type ConnectedBasicProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Basic);
