import { css, styled } from '@/hocs/styled';

const DescriptionSection = styled.div`
  margin-bottom: 10px;

  ${({ color }) =>
    color &&
    css`
      color: #62778c;
    `}

  ul {
    padding-top: 10px;
  }

  span {
    font-weight: 600;
  }
`;

export default DescriptionSection;
