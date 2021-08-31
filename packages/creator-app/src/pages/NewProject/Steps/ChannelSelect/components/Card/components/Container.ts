import { css, styled, transition } from '@/hocs';

const Container = styled.div<{ disabled?: boolean }>`
  ${transition('opacity', 'border-color', 'box-shadow', 'opacity')};

  position: relative;
  width: 286px;
  min-height: 240px;
  padding: 24px;
  cursor: pointer;
  box-shadow: none;
  background-color: #fdfdfd;
  box-sizing: border-box;
  border: 1px solid #dfe3ed;
  border-radius: 12px;
  text-align: left;

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.65;
      pointer-events: none;
    `}

  :hover {
    box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
    border-color: transparent;
  }

  :last-child {
    margin-right: 0;
  }
`;

export default Container;
