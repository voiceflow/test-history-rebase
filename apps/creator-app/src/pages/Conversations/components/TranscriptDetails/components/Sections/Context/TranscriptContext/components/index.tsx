import { Box, SvgIcon } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import THEME from '@/styles/theme';

export const ContextTitle = styled(Box.Flex)`
  text-align: center;
  color: ${THEME.colors.primary};
  font-size: 15px;
  font-weight: 600;
  padding-top: 16px;
`;

export const ContextSubtext = styled(Box)`
  text-align: center;
  color: ${THEME.colors.secondary};
  line-height: 1.54;
  font-size: 13px;
  padding-top: 16px;
  text-transform: capitalize;
`;

export const StyledLogo = styled.div<{ isCustom: boolean }>`
  z-index: 1;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-image: ${({ isCustom }) =>
    isCustom ? 'none' : 'linear-gradient(to bottom, rgba(19, 33, 68, 0.85), #132144)'};

  & > * > svg {
    margin-left: 10px;
    margin-top: 12px;
    display: inline;
  }
`;

export const StyledUser = styled(SvgIcon)`
  z-index: 2;
  margin-left: -8px;
  border-radius: 50%;
  border: 1px solid #dfe3ed;
  background-color: #f9f9f9;
  box-shadow: rgb(252 252 252) 0px 0px 0px 3px;

  & > svg {
    height: 22px;
    width: 22px;
    margin-left: 13px;
    margin-top: 13px;
  }
`;

export const AvatarContainer = styled.img`
  z-index: 1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

export const DefaultUserContainer = styled.img`
  z-index: 2;
  width: 55px;
  height: 55px;
  object-fit: cover;

  margin-left: -12px;
  border-radius: 50%;
  opacity: 1;
  background: white;
  border: 3px solid white;
`;

export const LetterContainer = styled.div<{ color: string; backgroundColor: string }>`
  width: 52px;
  height: 52px;
  color: ${({ color }) => color};
  font-weight: 600;
  font-size: 20px;
  line-height: 48px;
  margin-left: -12px;
  z-index: 2;
  text-align: center;
  text-transform: uppercase;
  background-color: ${({ backgroundColor }) => backgroundColor};
  background-position: center;
  background-size: contain;
  border: 2px solid #fcfcfc;
  border-radius: 100%;
`;
