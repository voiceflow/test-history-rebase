import { styled } from '@/hocs';

const BackLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #8da2b5;

  & > * {
    padding-right: 10px;
  }

  &:hover {
    text-decoration: none;
    color: #62778c;
  }
`;

export default BackLink;
