import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import { CloseButton, Container, OuterContainer, SubTitle, Title } from './styles';

interface BannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onClick?: VoidFunction;
  backgroundImage?: string;
  onClose?: VoidFunction;
}

const Banner: React.FC<BannerProps> = ({ title, subtitle, buttonText, onClick, backgroundImage, onClose }) => {
  const [isOpen, setOpen] = React.useState(true);

  const closeBanner = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <OuterContainer isOpen={isOpen}>
      <Container backgroundImage={backgroundImage}>
        <Box.FlexApart flexDirection="row">
          <Box.Flex flexDirection="column" style={{ padding: '24px 32px' }}>
            {title && <Title>{title}</Title>}
            {subtitle && <SubTitle>{subtitle}</SubTitle>}
          </Box.Flex>
          {buttonText && (
            <div style={{ padding: '28px 32px' }}>
              <Button variant={Button.Variant.PRIMARY} squareRadius onClick={onClick}>
                {buttonText}
              </Button>
            </div>
          )}
        </Box.FlexApart>
        <CloseButton onClick={closeBanner}>
          <SvgIcon icon="close" size="11" />
        </CloseButton>
      </Container>
    </OuterContainer>
  );
};
export default Banner;
