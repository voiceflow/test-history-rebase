import { Box, Divider } from '@voiceflow/ui';
import React from 'react';

import ColorInput from '@/components/ColorInput';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { NegativeMarginContainer, UploadContainer, UploadImage } from './components';

const AppearanceAndBranding: React.FC = () => {
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const brandImage = useSelector(Prototype.prototypeBrandImageSelector);
  const brandColor = useSelector(Prototype.prototypeBrandColorSelector);

  const updateSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  return (
    <Box>
      <ColorInput
        value={brandColor}
        onChange={(brandColor) => updateSettings({ brandColor })}
        disabledBorderColor="rgba(210, 218, 226, 0.65)"
      />

      <NegativeMarginContainer>
        <Divider style={{ marginTop: '24px', marginBottom: 0 }} />

        <UploadContainer>
          <UploadImage
            id={Identifier.BRAND_IMAGE_INPUT_CONTAINER}
            title="Brand Image"
            image={brandImage}
            onUpdate={(image) => updateSettings({ brandImage: image })}
            isSquare={true}
            hasBorderRight={true}
          />

          <UploadImage
            id={Identifier.MESSAGE_ICON_INPUT_CONTAINER}
            title="Message Icon"
            image={avatar}
            onUpdate={(image) => updateSettings({ avatar: image })}
            isSquare={false}
            hasBorderRight={false}
          />
        </UploadContainer>

        <Divider offset={0} />
      </NegativeMarginContainer>
    </Box>
  );
};
export default AppearanceAndBranding;
