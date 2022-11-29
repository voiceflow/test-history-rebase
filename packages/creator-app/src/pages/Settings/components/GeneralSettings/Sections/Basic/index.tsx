import { Box, Input, Upload, UploadIconVariant, useDidUpdateEffect, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import LocalesSelect from '@/components/LocalesSelect';
import Section, { SectionVariant } from '@/components/Section';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActivePlatformConfig, useActiveProjectTypeConfig, useDispatch, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

import { headerStyling, SectionErrorMessage, sectionStyling } from './styles';

const Basic: React.FC = () => {
  const projectConfig = useActiveProjectTypeConfig();
  const platformConfig = useActivePlatformConfig();

  const project = useSelector(ProjectV2.active.projectSelector);
  const storedLocales = useSelector(VersionV2.active.localesSelector);
  const storedInvocationName = useSelector(VersionV2.active.invocationNameSelector);

  const updateLocales = useDispatch(Version.updateLocales);
  const updateProjectName = useDispatch(Project.updateActiveProjectName);
  const updateProjectImage = useDispatch(Project.updateProjectImage);
  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const initialLocales = React.useMemo(
    () => (projectConfig.project.locale.isLanguage ? [projectConfig.utils.locale.toLanguage(storedLocales)] : storedLocales),
    [projectConfig, storedLocales]
  );

  const [locales, setLocales] = useLinkedState(initialLocales);
  const [projectName, setProjectName] = React.useState(project?.name ?? '');
  const [projectImage, setProjectImage] = React.useState(project?.image ?? null);
  const [invocationName, setInvocationName] = React.useState(storedInvocationName ?? '');

  const saveLocales = async () => {
    if (projectConfig.project.locale.isLanguage) {
      await updateLocales(projectConfig.utils.locale.fromLanguage(locales[0]));
    } else {
      await updateLocales(locales);
    }
  };

  const invocationError = projectConfig.utils.invocationName.validate({ value: invocationName, locales: storedLocales });

  const onSaveInvocationName = () => projectConfig.project.invocationName && !invocationError && updateInvocationName(invocationName);

  const saveSettings = async () =>
    Promise.all([
      saveLocales(),
      updateProjectName(projectName),
      onSaveInvocationName(),
      project && projectImage ? updateProjectImage(project.id, projectImage) : null,
    ]);

  useDidUpdateEffect(() => {
    saveSettings();
  }, [locales, projectImage]);

  return (
    <>
      <Section
        header="Assistant Name"
        variant={SectionVariant.QUATERNARY}
        contentSuffix={<DescriptorContainer>{projectConfig.project.description}</DescriptorContainer>}
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
        header={projectConfig.project.locale.name}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={<DescriptorContainer>{projectConfig.project.locale.description}</DescriptorContainer>}
        customHeaderStyling={headerStyling}
        customContentStyling={sectionStyling}
      >
        <LocalesSelect
          type={projectConfig.type}
          locales={locales}
          disabled={!projectConfig.project.locale.editable}
          platform={platformConfig.type}
          onChange={setLocales}
        />
      </Section>
    </>
  );
};

export default Basic;
