import SvgIcon from '@/components/SvgIcon';
import { css, styled } from '@/hocs';

export const CaretIcon = styled(SvgIcon)`
  display: inline-block;
`;

export const ButtonContainer = styled.div<{ isOpen: boolean; padding?: string; disabled?: boolean }>`
  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #5190e6;
    `}

   ${({ padding }) =>
     padding &&
     css`
       padding: ${padding};
     `}

    ${({ disabled }) =>
      disabled &&
      css`
        pointer-events: none;
      `}
cursor: pointer;

`;

export const TextContainer = styled.div`
  display: inline-block;
  margin-right: 13px;

  color: ${({ color = '#6e849a' }) => color};
`;
