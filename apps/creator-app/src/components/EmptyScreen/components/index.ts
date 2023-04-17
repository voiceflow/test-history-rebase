import { colors, ThemeColor } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const BodyTextContainer = styled.div`
  max-width: 250px;
  margin-bottom: 16px;
  color: ${colors(ThemeColor.SECONDARY)};
`;

export const ButtonContainer = styled.div`
  display: grid;
  place-items: center;
`;

export const TitleLabel = styled.div`
  color: ${colors(ThemeColor.PRIMARY)};
  margin-bottom: 8px;
  text-align: center;
  display: block;
  font-weight: 600;
  font-size: 15px;
`;

export const LogoContainer = styled.div`
  text-align: center;
`;

export const Logo = styled.img`
  margin-bottom: 16px;
  vertical-align: middle;
`;

export const ContentContainer = styled.div`
  text-align: center;
  align-self: center;
`;

export const Container = styled.div`
  height: 100%;
  justify-content: center;
  display: flex;
`;
