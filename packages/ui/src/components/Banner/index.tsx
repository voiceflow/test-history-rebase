import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import React from 'react';

import * as S from './styles';

interface BannerProps extends Omit<S.OuterContainerProps, 'isOpen'> {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onClick?: VoidFunction;
  backgroundImage?: string;
  onClose?: VoidFunction;
  isCloseable?: boolean;
  className?: string;
  small?: boolean;
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle,
  buttonText,
  onClick,
  backgroundImage,
  onClose,
  isCloseable = true,
  className,
  small = false,
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(true);

  const closeBanner = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const textboxStyle = small
    ? {
        pt: 24,
        pb: 24,
        pl: 32,
      }
    : {
        px: 32,
        py: 24,
      };

  return (
    <S.OuterContainer isOpen={isOpen} className={className} {...props}>
      <S.Container backgroundImage={backgroundImage}>
        <Box.FlexApart flexDirection="row">
          <Box.Flex flexDirection="column" {...textboxStyle}>
            {title && <S.Title>{title}</S.Title>}
            {subtitle && <S.SubTitle>{subtitle}</S.SubTitle>}
          </Box.Flex>
          {buttonText && (
            <S.ButtonBox px={32} py={28}>
              <Button variant={Button.Variant.PRIMARY} squareRadius onClick={onClick}>
                {buttonText}
              </Button>
            </S.ButtonBox>
          )}
        </Box.FlexApart>
        {isCloseable && <S.CloseButton onClick={closeBanner} icon="closeSmall" />}
      </S.Container>
    </S.OuterContainer>
  );
};
export default Object.assign(Banner, { OuterContainer: S.OuterContainer, ButtonBox: S.ButtonBox });
