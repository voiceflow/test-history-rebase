import type { BoxProps } from '@ui/components/Box';
import Box from '@ui/components/Box';
import Button from '@ui/components/Button';
import { useLocalStorageState } from '@ui/hooks/storage';
import React from 'react';

import * as S from './styles';

interface BannerProps extends BoxProps {
  title?: string;
  small?: boolean;
  onClick?: VoidFunction;
  subtitle?: string;
  closeKey?: string;
  className?: string;
  buttonText?: string;
  backgroundImage?: string;
}

const Banner: React.FC<BannerProps> = ({
  small = false,
  title,
  onClick,
  closeKey,
  subtitle,
  buttonText,
  backgroundImage,
  ...props
}) => {
  const [isClosed, setIsClosed] = useLocalStorageState(closeKey ?? 'unknown-close-key', false);

  if (isClosed) return null;

  return (
    <S.OuterContainer {...props}>
      <S.Container backgroundImage={backgroundImage}>
        <Box.FlexApart flexDirection="row">
          <S.TextContainer small={small}>
            {title && <S.Title>{title}</S.Title>}

            {subtitle && <S.SubTitle>{subtitle}</S.SubTitle>}
          </S.TextContainer>

          {buttonText && (
            <Button variant={Button.Variant.PRIMARY} squareRadius onClick={onClick}>
              {buttonText}
            </Button>
          )}
        </Box.FlexApart>

        {closeKey && <S.CloseButton onClick={() => setIsClosed(true)} icon="closeSmall" />}
      </S.Container>
    </S.OuterContainer>
  );
};
export default Object.assign(Banner, {
  Container: S.Container,
  TextContainer: S.TextContainer,
  OuterContainer: S.OuterContainer,
});
