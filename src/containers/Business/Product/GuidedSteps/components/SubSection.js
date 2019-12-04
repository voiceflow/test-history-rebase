import { css, styled } from '@/hocs';

const SubSection = styled.div`
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
