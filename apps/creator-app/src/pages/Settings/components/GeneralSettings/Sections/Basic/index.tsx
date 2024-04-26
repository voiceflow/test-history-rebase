import { Box, Input, SectionV2, Upload, UploadIconVariant, useDidUpdateEffect, useLinkedState } from '@voiceflow/ui';
import React from 'react';

import LocalesSelect from '@/components/LocalesSelect';
import * as Settings from '@/components/Settings';
import * as ProjectV2 from '@/ducks/projectV2';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectPlatformConfig, useActiveProjectTypeConfig, useDispatch, useSelector } from '@/hooks';

const Basic: React.FC = () => {
  const projectConfig = useActiveProjectTypeConfig();
  const platformConfig = useActiveProjectPlatformConfig();

  const project = useSelector(ProjectV2.active.projectSelector);
  const storedLocales = useSelector(VersionV2.active.localesSelector);
  const storedInvocationName = useSelector(VersionV2.active.invocationNameSelector);

  const updateLocales = useDispatch(VersionV2.updateLocales);
  const updateProjectName = useDispatch(ProjectV2.updateActiveProjectName);
  const updateProjectImage = useDispatch(ProjectV2.updateProjectImage);
  const updateInvocationName = useDispatch(VersionV2.updateInvocationName);

  const initialLocales = React.useMemo(
    () =>
      projectConfig.project.locale.isLanguage ? [projectConfig.utils.locale.toLanguage(storedLocales)] : storedLocales,
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

  const invocationError = projectConfig.utils.invocationName.validate({
    value: invocationName,
    locales: storedLocales,
  });

  const onSaveInvocationName = () =>
    projectConfig.project.invocationName && !invocationError && updateInvocationName(invocationName);

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
    <Settings.Section title="Name & Language">
      <Settings.Card>
        <Settings.SubSection header="Assistant Name" splitView>
          <Box.Flex gap={12} fullWidth>
            <Input value={projectName} onChangeText={setProjectName} onBlur={saveSettings} style={{ flexGrow: 1 }} />

            <Upload.IconUpload
              size={UploadIconVariant.EXTRA_SMALL}
              isSquare
              update={setProjectImage}
              image={projectImage ?? ''}
            />
          </Box.Flex>

          <Settings.SubSection.Description>{projectConfig.project.description}</Settings.SubSection.Description>
        </Settings.SubSection>

        <SectionV2.Divider />

        {!!projectConfig.project.invocationName && (
          <>
            <Settings.SubSection header={projectConfig.project.invocationName.name} splitView>
              <Input
                error={!!invocationError}
                value={invocationName}
                style={{ flexGrow: 1 }}
                onBlur={onSaveInvocationName}
                placeholder={projectConfig.project.invocationName.placeholder}
                onChangeText={setInvocationName}
              />

              <Settings.SubSection.Description error={!!invocationError}>
                {invocationError || projectConfig.project.invocationName.description}
              </Settings.SubSection.Description>
            </Settings.SubSection>

            <SectionV2.Divider />
          </>
        )}

        <Settings.SubSection header={projectConfig.project.locale.name} splitView>
          <LocalesSelect
            type={projectConfig.type}
            locales={locales}
            disabled={!projectConfig.project.locale.editable}
            platform={platformConfig.type}
            onChange={setLocales}
          />

          <Settings.SubSection.Description>{projectConfig.project.locale.description}</Settings.SubSection.Description>
        </Settings.SubSection>
      </Settings.Card>
    </Settings.Section>
  );
};

export default Basic;
