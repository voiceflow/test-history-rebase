import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import SvgIcon from '@ui/components/SvgIcon';
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
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(true);

  const closeBanner = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <S.OuterContainer isOpen={isOpen} className={className} {...props}>
      <S.Container backgroundImage={backgroundImage}>
        <Box.FlexApart flexDirection="row">
          <Box.Flex flexDirection="column" style={{ padding: '24px 32px' }}>
            {title && <S.Title>{title}</S.Title>}
            {subtitle && <S.SubTitle>{subtitle}</S.SubTitle>}
          </Box.Flex>
          {buttonText && (
            <div style={{ padding: '28px 32px' }}>
              <Button variant={Button.Variant.PRIMARY} squareRadius onClick={onClick}>
                {buttonText}
              </Button>
            </div>
          )}
        </Box.FlexApart>
        {isCloseable && (
          <S.CloseButton onClick={closeBanner}>
            <SvgIcon icon="close" size="11" />
          </S.CloseButton>
        )}
      </S.Container>
    </S.OuterContainer>
  );
};
export default Object.assign(Banner, { OuterContainer: S.OuterContainer });
