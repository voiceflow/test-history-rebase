import { Utils } from '@voiceflow/common';
import { ChatWidget, Header, Launcher, SystemResponse } from '@voiceflow/react-chat';
import { Box, Button, ButtonVariant, Label, ThemeColor, Upload } from '@voiceflow/ui';
import React from 'react';

import ColorInput from '@/components/ColorInput';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { upload } from '@/utils/dom';

import Section from './components/Section';
import { PreviewCrop, SelectorBox, SelectorLine } from './styled';

export const ApperanceSection: React.OldFC = () => {
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
      <Section.Group width={164}>
        <Label>Main Color</Label>
        <ColorInput value={config.color} onChange={(color) => updateConfig({ color }, { track: true })} />
      </Section.Group>
      <Section.Group>
        <Label>Launcher</Label>
        <Box.Flex>
          <Launcher image={config.launcher} open={Utils.functional.noop} />
          <Box.Flex ml={-48}>
            <SelectorBox />
            <SelectorLine width={64} />
            <Button variant={ButtonVariant.SECONDARY} onClick={startUpload('launcher')}>
              Upload Image
            </Button>
          </Box.Flex>
        </Box.Flex>
      </Section.Group>
      <Section.Group>
        <Label>Assistant Image</Label>
        <Box.Flex>
          <PreviewCrop>
            <Box mt={12} ml={12}>
              <ChatWidget.ChatContainer>
                <Header title={config.title} image={config.image} />
                <Box backgroundColor={ThemeColor.WHITE} height={30} />
              </ChatWidget.ChatContainer>
            </Box>
          </PreviewCrop>
          <Box.Flex ml={-32}>
            <SelectorLine width={64} />
            <Button variant={ButtonVariant.SECONDARY} onClick={startUpload('image')}>
              Upload Image
            </Button>
          </Box.Flex>
        </Box.Flex>
      </Section.Group>
      <Section.Group>
        <Label>Assistant Avatar</Label>
        <Box.Flex>
          <PreviewCrop>
            <Box ml={12} mt={-13}>
              <ChatWidget.ChatContainer>
                <Box backgroundColor={ThemeColor.WHITE} py={30} px={20}>
                  <SystemResponse avatar={config.avatar} timestamp={now} messages={[{ type: 'text', text: 'Lorem ipsum dolor' }]} />
                </Box>
              </ChatWidget.ChatContainer>
            </Box>
          </PreviewCrop>
          <Box.Flex ml={-38}>
            <SelectorLine width={70} />
            <Button variant={ButtonVariant.SECONDARY} onClick={startUpload('avatar')}>
              Upload Image
            </Button>
          </Box.Flex>
        </Box.Flex>
      </Section.Group>
    </Section>
  );
};
