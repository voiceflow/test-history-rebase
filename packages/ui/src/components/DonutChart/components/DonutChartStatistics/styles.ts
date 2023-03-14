import Box from '@ui/components/Box';
import SvgIcon from '@ui/components/SvgIcon';
import { css, styled } from '@ui/styles';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
`;

export const ValueContainer = styled.div`
  dispaly: flex;
  flex-direction: row;
  align-items: baseline;
`;

export const Value = styled.span`
  color: #132144;
  font-size: 30px;
  font-weight: 700;
`;

export const PercentSign = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #8c94a6;
  padding-left: 4px;
`;

export interface TrendProps {
  delta: number;
}

export const Trend = styled(Box.Flex)<TrendProps>`
  font-size: 13px;
  font-weight: 600;

  ${SvgIcon.Container} {
    margin-right: 6px;
  }

  ${({ delta }) =>
    delta >= 0
      ? css`
          color: #38751f;
        `
      : css`
          color: #bd425f;

          ${SvgIcon.Container} {
            transform: scaleY(-1);
          }
        `}
`;
