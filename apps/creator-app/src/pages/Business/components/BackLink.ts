import { styled } from '@/hocs/styled';

const BackLink = styled.div`
  display: flex;
  align-items: center;
  color: #8da2b5;
  cursor: pointer;

  & > * {
    padding-right: 10px;
  }

  &:hover {
    color: #62778c;
    text-decoration: none;
  }
`;

export default BackLink;
