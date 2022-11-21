import { Utils } from '@voiceflow/realtime-sdk';
import { Box, BoxFlex, Flex, Input, Upload, UploadIconVariant } from '@voiceflow/ui';
import React from 'react';

import ColorInput from '@/components/ColorInput';
import Section, { SectionVariant } from '@/components/Section';
import Upgrade from '@/components/Upgrade';
import { Permission } from '@/config/permissions';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Prototype from '@/ducks/prototype';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useAlexaProjectSettings, useDispatch, usePermission, useSelector } from '@/hooks';

const TestToolSettings: React.FC = () => {
  const [canCustomize] = usePermission(Permission.CUSTOMIZE_PROTOTYPE);
  const patchSettings = useDispatch(Version.chat.patchSettings);
  const canUseAlexaSettings = useAlexaProjectSettings();

  const durationMilliseconds = useSelector(VersionV2.active.voiceflow.chat.messageDelaySelector);

  const brandColor = useSelector(Prototype.prototypeBrandColorSelector);
  const prototypeAvatar = useSelector(Prototype.prototypeAvatarSelector);
  const updatePrototypeSettings = useDispatch(Prototype.updateSharePrototypeSettings);
  const [delayDuration, setDelayDuration] = React.useState(durationMilliseconds);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);

  const showMessageDelaySetting = Utils.typeGuards.isChatProjectType(projectType);
  const onChangeDelay = async (val: string) => {
    const delay = parseInt(val, 10);
    setDelayDuration(delay);
  };

  const savePrototypeImage = async (image: string | null) => {
    await updatePrototypeSettings({ avatar: image ?? '' });
  };

  const persistDelayDurationChange = async () => {
    let newDelayDuration = delayDuration;
    if (!newDelayDuration) {
      setDelayDuration(0);
      newDelayDuration = 0;
    }
    await patchSettings({ messageDelay: { durationMilliseconds: newDelayDuration } });
  };

  return (
    <>
      {showMessageDelaySetting && (
        <Section
          header="Message Delay"
          variant={SectionVariant.QUATERNARY}
          customHeaderStyling={{ paddingBottom: '11px' }}
          customContentStyling={{ paddingBottom: '24px' }}
        >
          <Flex>
            <Box width="80px" mr={12}>
              <Input
                hideDefaultNumberControls
                value={delayDuration}
                onBlur={persistDelayDurationChange}
                onChangeText={onChangeDelay}
                placeholder="1000"
                type="number"
                min={0}
              />
            </Box>
            <Box color="#64788d">millisecond message delay</Box>
          </Flex>
        </Section>
      )}

      {canUseAlexaSettings && (
        <>
          <Section
            header="Appearance & Branding"
            variant={SectionVariant.QUATERNARY}
            dividers
            isDividerNested={!!showMessageDelaySetting}
            customHeaderStyling={{ paddingBottom: '11px' }}
            customContentStyling={{ paddingBottom: '24px' }}
          >
            <BoxFlex mr={120}>
              <ColorInput
                value={brandColor}
                onChange={(brandColor) => updatePrototypeSettings({ brandColor })}
                isAllowed={canCustomize}
                disabledBorderColor="rgba(210, 218, 226, 0.65)"
              />
              <Box ml={16}>
                <Upload.IconUpload image={prototypeAvatar} size={UploadIconVariant.EXTRA_SMALL} update={savePrototypeImage} />
              </Box>
            </BoxFlex>
          </Section>

          {!canCustomize && (
            <Box position="relative" top={10} mb={12}>
              <Upgrade>Customize test tool and prototype style and branding.</Upgrade>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default TestToolSettings;
