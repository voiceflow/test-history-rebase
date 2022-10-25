import { App, Header } from '@voiceflow/react-chat';
import { Box, Button, ButtonVariant, Label, ThemeColor, Upload } from '@voiceflow/ui';
import React from 'react';

import ColorInput from '@/components/ColorInput';
import * as VoiceflowVersion from '@/ducks/version/platform/general';
import * as Version from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { upload } from '@/utils/dom';

import Section from './components/Section';
import { PreviewCrop, SelectorLine } from './styled';

export const ApperanceSection: React.FC = () => {
  const config = useSelector(Version.active.general.chatPublishingSelector);
  const updateConfig = useDispatch(VoiceflowVersion.patchPublishing);

  const imageUploader = Upload.useUpload({ fileType: 'image', endpoint: '/image' });

  const uploadImage = (files: FileList) => {
    imageUploader.onUpload('/image', files[0]).then((url) => updateConfig({ image: url }));
  };

  const startUpload = () => {
    upload(uploadImage, { multiple: false, accept: '.jpg,.jpeg,.png' });
  };

  return (
    <Section icon="apperance" title="Appearance" description="Customize the look and feel of your chat widget">
      <Section.Group width={160}>
        <Label>Main Color</Label>
        <ColorInput value={config.color} onChange={(color) => updateConfig({ color })} />
      </Section.Group>
      <Section.Group>
        <Label>Assistant Image</Label>
        <Box.Flex>
          <PreviewCrop>
            <Box mt={12} ml={12}>
              <App.ChatContainer>
                <Header title={config.title} image={config.image} />
                <Box backgroundColor={ThemeColor.WHITE} height={30} />
              </App.ChatContainer>
            </Box>
          </PreviewCrop>
          <Box.Flex ml={-32}>
            <SelectorLine />
            <Button variant={ButtonVariant.SECONDARY} squareRadius flat onClick={startUpload}>
              Upload Image
            </Button>
          </Box.Flex>
        </Box.Flex>
      </Section.Group>
    </Section>
  );
};
