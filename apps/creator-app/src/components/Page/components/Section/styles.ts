import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Container = styled(Box).attrs((props) => ({ mb: 32, maxWidth: 700, ...props }))``;

export const Header = styled(Box).attrs((props) => ({ mb: 16, ...props }))``;

export const Content = styled.div`
  box-shadow:
    1px 1px 3px rgba(17, 49, 96, 0.08),
    0px 0px 0px 1px rgba(17, 49, 96, 0.1);
  border-radius: 8px;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export const Description = styled.div<{ secondary?: boolean }>`
  font-size: 13px;

  ${({ secondary = true }) =>
    secondary &&
    css`
      color: #62778c;
    `};

  ${Title} + & {
    margin-top: 4px;
  }
`;
