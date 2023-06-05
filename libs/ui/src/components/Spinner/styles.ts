import { colors, css, styled, ThemeColor, transition } from '@ui/styles';

const fillContainerStyles = css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Container = styled.div<{ fillContainer?: boolean }>`
  ${transition('opacity')};
  ${({ fillContainer }) => fillContainer && fillContainerStyles}
  text-align: center;
`;

export const Text = styled.div`
  color: ${colors(ThemeColor.PRIMARY)};
  font-weight: 400;
  font-size: 18px;
`;
