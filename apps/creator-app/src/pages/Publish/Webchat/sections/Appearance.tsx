import { Utils } from '@voiceflow/common';
import { ChatWidget, Header, Launcher, SystemResponse } from '@voiceflow/react-chat';
import { Box, Button, ButtonVariant, ThemeColor, Upload } from '@voiceflow/ui';
import React from 'react';

import ColorInput from '@/components/ColorInput';
import * as Settings from '@/components/Settings';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { upload } from '@/utils/dom';

import Section from './components/Section';
import * as S from './styles';

export const AppearanceSection: React.FC = () => {
  const now = React.useMemo(() => Date.now(), []);
  const config = useSelector(VersionV2.active.voiceflow.chat.publishingSelector);
  const updateConfig = useDispatch(Version.voiceflow.chat.patchActiveAndLivePublishing);

  const imageUploader = Upload.useUpload({ fileType: 'image', endpoint: '/image' });

  const startUpload = (property: 'image' | 'avatar' | 'launcher') => () => {
    const uploadImage = async (files: FileList) => {
      const url = await imageUploader.onUpload('/image', files[0]);
      updateConfig({ [property]: url }, { track: true });
    };

    upload(uploadImage, { multiple: false, accept: '.jpg,.jpeg,.png,.svg' });
  };

  return (
    <Section icon="apperance" title="Appearance" description="Customize the look and feel of your chat widget">
      <Box width={164}>
        <Settings.SubSection header="Main Color" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
          <ColorInput value={config.color} onChange={(color) => updateConfig({ color }, { track: true })} />
        </Settings.SubSection>
      </Box>

      <Settings.SubSection header="Launcher" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
        <Box.Flex>
          <Launcher image={config.launcher} open={Utils.functional.noop} />

          <Box.Flex ml={-48}>
            <S.SelectorBox />
            <S.SelectorLine width={64} />
            <Button variant={ButtonVariant.SECONDARY} onClick={startUpload('launcher')}>
              Upload Image
            </Button>
          </Box.Flex>
        </Box.Flex>
      </Settings.SubSection>

      <Settings.SubSection header="Assistant Image" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0 }}>
        <Box.Flex>
          <S.PreviewCrop>
            <Box mt={12} ml={12}>
              <ChatWidget.ChatContainer>
                <Header title={config.title} image={config.image} />
                <Box backgroundColor={ThemeColor.WHITE} height={30} />
              </ChatWidget.ChatContainer>
            </Box>
          </S.PreviewCrop>

          <Box.Flex ml={-32}>
            <S.SelectorLine width={64} />
            <Button variant={ButtonVariant.SECONDARY} onClick={startUpload('image')}>
              Upload Image
            </Button>
          </Box.Flex>
        </Box.Flex>
      </Settings.SubSection>

      <Settings.SubSection header="Assistant Avatar" headerProps={{ px: 0, pt: 0 }} contentProps={{ px: 0, pb: 0 }}>
        <Box.Flex>
          <S.PreviewCrop>
            <Box ml={12} mt={-13}>
              <ChatWidget.ChatContainer>
                <Box backgroundColor={ThemeColor.WHITE} py={30} px={20}>
                  <SystemResponse avatar={config.avatar} timestamp={now} messages={[{ type: 'text', text: 'Lorem ipsum dolor' }]} />
                </Box>
              </ChatWidget.ChatContainer>
            </Box>
          </S.PreviewCrop>

          <Box.Flex ml={-38}>
            <S.SelectorLine width={70} />
            <Button variant={ButtonVariant.SECONDARY} onClick={startUpload('avatar')}>
              Upload Image
            </Button>
          </Box.Flex>
        </Box.Flex>
      </Settings.SubSection>
    </Section>
  );
};
