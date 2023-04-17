import { css, styled } from '@/hocs/styled';

export interface SubSectionProps {
  flex?: boolean;
  topAlign?: boolean;
}

const SubSection = styled.div<SubSectionProps>`
  margin-bottom: 16px;

  ${({ flex }) =>
    flex &&
    css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 0;
    `}

  ${({ topAlign }) =>
    topAlign &&
    css`
      align-items: flex-start;
    `}

  .small_input {
    width: 120px;
  }
`;

export default SubSection;
