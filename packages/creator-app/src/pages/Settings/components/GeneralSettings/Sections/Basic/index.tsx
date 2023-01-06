import { Box, Input, SectionV2, Upload, UploadIconVariant, useDidUpdateEffect, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import LocalesSelect from '@/components/LocalesSelect';
import { SectionVariants, SettingsSection, SettingsSubSection } from '@/components/Settings';
import * as Project from '@/ducks/project';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectPlatformConfig, useActiveProjectTypeConfig, useDispatch, useSelector } from '@/hooks';
import { DescriptorContainer } from '@/pages/Settings/components/ContentDescriptors/components';

import { SectionErrorMessage } from './styles';

const Basic: React.OldFC = () => {
  const projectConfig = useActiveProjectTypeConfig();
  const platformConfig = useActiveProjectPlatformConfig();

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
    <SettingsSection variant={SectionVariants.PRIMARY} title="Name & Language" marginBottom={40}>
      <SettingsSubSection header="Assistant Name" leftDescription={<DescriptorContainer>{projectConfig.project.description}</DescriptorContainer>}>
        <Input value={projectName} onChangeText={setProjectName} onBlur={saveSettings} style={{ flexGrow: 1 }} />
        <Box ml={12}>
          <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} isSquare update={setProjectImage} image={projectImage ?? ''} />
        </Box>
      </SettingsSubSection>

      <SectionV2.Divider />

      {!!projectConfig.project.invocationName && (
        <>
          <SettingsSubSection
            header={projectConfig.project.invocationName.name}
            leftDescription={
              invocationError ? (
                <SectionErrorMessage marginTop={-2}>{invocationError}</SectionErrorMessage>
              ) : (
                <DescriptorContainer>{projectConfig.project.invocationName.description}</DescriptorContainer>
              )
            }
          >
            <Input
              error={!!invocationError}
              value={invocationName}
              onBlur={onSaveInvocationName}
              style={{ flexGrow: 1 }}
              placeholder={projectConfig.project.invocationName.placeholder}
              onChangeText={setInvocationName}
            />
          </SettingsSubSection>
          <SectionV2.Divider />
        </>
      )}

      <SettingsSubSection
        header={projectConfig.project.locale.name}
        leftDescription={<DescriptorContainer>{projectConfig.project.locale.description}</DescriptorContainer>}
      >
        <Box style={{ flexGrow: 1 }}>
          <LocalesSelect
            type={projectConfig.type}
            locales={locales}
            disabled={!projectConfig.project.locale.editable}
            platform={platformConfig.type}
            onChange={setLocales}
          />
        </Box>
      </SettingsSubSection>
    </SettingsSection>
  );
};

export default Basic;
