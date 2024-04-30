import Box from '@/components/Box';
import { css, styled } from '@/styles';

export const Container = styled(Box.Flex)<{ isSmall?: boolean }>`
  padding-top: 16px;
  padding-bottom: 8px;

  ${({ isSmall }) =>
    isSmall &&
    css`
      padding-bottom: 0px;

      &:first-child {
        padding-top: 4px;
      }
    `}
`;

export const Line = styled.div`
  height: 1px;
  margin: 10px 0 7px 0;
  background-color: #eaeff4;
  flex: 1;
`;

export const Title = styled.div`
  color: #62778c;
  font-size: 13px;
  font-weight: 600;
  position: relative;
  padding: 0px 13px 0 24px;
`;
