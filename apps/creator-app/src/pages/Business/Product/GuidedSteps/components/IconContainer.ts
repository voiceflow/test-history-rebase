import { css, styled } from '@/hocs/styled';

export interface IconContainerProps {
  noBorder?: boolean;
}

const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin-top: -24px;
  padding: 20px 32px 20px 0;
  border-right: 1px solid #eaeff4;

  ${({ noBorder }) =>
    noBorder &&
    css`
      padding: 20px 0 20px 32px;
      border: none;
    `}
`;

export default IconContainer;
