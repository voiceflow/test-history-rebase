import { css, styled } from '@/hocs/styled';

export interface PhraseButtonProps {
  disable?: boolean;
  addPadding?: boolean;
}

const PhraseButton = styled.div<PhraseButtonProps>`
  display: flex;
  align-items: center;
  padding-left: 10px;
  color: #6e849a;
  cursor: pointer;

  ${({ disable }) =>
    disable &&
    css`
      color: #bac4cf;
      cursor: auto;
      pointer-events: none;
    `}

  ${({ addPadding }) =>
    addPadding &&
    css`
      padding-right: 24px;
    `}
`;

export default PhraseButton;
