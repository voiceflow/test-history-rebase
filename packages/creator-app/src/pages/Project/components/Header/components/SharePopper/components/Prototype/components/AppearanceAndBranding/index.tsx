import { Box } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { ColorInput, NegativeMarginContainer, UploadContainer, UploadImage } from './components';

interface AppearanceAndBrandingProps {
  isAllowed: boolean;
}

const AppearanceAndBranding: React.FC<AppearanceAndBrandingProps> = ({ isAllowed }) => {
  const avatar = useSelector(Prototype.prototypeAvatarSelector);
  const brandImage = useSelector(Prototype.prototypeBrandImageSelector);

  const updateSettings = useDispatch(Prototype.updateSharePrototypeSettings);

  return (
    <Box cursor={isAllowed ? 'default' : 'not-allowed'}>
      <ColorInput isAllowed={isAllowed} disabledBorderColor="rgba(210, 218, 226, 0.65)" />

      <NegativeMarginContainer>
        <Divider style={{ marginTop: '24px', marginBottom: 0 }} />

        <UploadContainer>
          <UploadImage
            id={Identifier.BRAND_IMAGE_INPUT_CONTAINER}
            title="Brand Image"
            image={brandImage}
            onUpdate={(image) => updateSettings({ brandImage: image })}
            isSquare={true}
            isAllowed={isAllowed}
            hasBorderRight={true}
          />

          <UploadImage
            id={Identifier.MESSAGE_ICON_INPUT_CONTAINER}
            title="Message Icon"
            image={avatar}
            onUpdate={(image) => updateSettings({ avatar: image })}
            isSquare={false}
            isAllowed={isAllowed}
            hasBorderRight={false}
          />
        </UploadContainer>

        <Divider offset={0} />
      </NegativeMarginContainer>
    </Box>
  );
};
export default AppearanceAndBranding;
