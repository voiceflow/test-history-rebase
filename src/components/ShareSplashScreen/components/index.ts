import Box from '@/components/Box';
import { FlexApart } from '@/components/Flex';
import { css, styled, transition } from '@/hocs';

const DEFAULT_COLOR_SCHEME = '#539af5';

// eslint-disable-next-line no-secrets/no-secrets
const vfLogo = 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/dohvpzgjnwzndaen346r';
export const Container = styled(FlexApart)`
  background-color: white;

  @media screen and (max-width: 500px) {
    & {
      padding: 32px;
    }
  }
  padding: 48px;
  height: 100%;
  width: 100%;
  flex-direction: column;
`;

export const StartButton = styled.button<{ color?: string }>`
  ${transition('opacity')};
  padding: 20px 48px;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 18px;
  position: relative;
  border: none;
  min-width: 260px;
  opacity: 0.8;
  ${({ color = DEFAULT_COLOR_SCHEME }) => css`
    background-color: ${color};
  `}
  :hover {
    opacity: 1;
  }
`;

export const ContentContainer = styled.div<{ centerAlign?: boolean }>`
  flex: 3;
  display: flex;
  ${({ centerAlign }) =>
    centerAlign &&
    css`
      text-align: center;
      align-items: center;
    `}
`;

export const BoxLogo = styled.div<{ img?: string; logoSize?: number }>`
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 32px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  border: solid 2px white;
  ${({ logoSize = 48 }) => css`
    width: ${logoSize}px;
    height: ${logoSize}px;
  `}
  ${({ img = vfLogo }) =>
    css`
      background: url('${img}');
      background-size: contain;
    `}
`;

export const WaterMark = styled(Box)<{ centerAlign?: boolean }>`
  ${({ centerAlign }) =>
    centerAlign &&
    css`
      text-align: center;
    `}
`;
